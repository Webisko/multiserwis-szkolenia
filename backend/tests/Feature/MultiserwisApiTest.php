<?php

namespace Tests\Feature;

use App\Mail\InquiryReceivedMail;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MultiserwisApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_catalog_endpoints_return_active_courses_and_machines(): void
    {
        $coursesRes = $this->getJson('/api/courses')->assertOk();
        $this->assertCount(25, $coursesRes->json());

        $c1 = Course::query()->where('code', 'c1')->firstOrFail();
        $c1->update(['is_active' => false]);

        $coursesAfter = $this->getJson('/api/courses')->assertOk();
        $this->assertCount(24, $coursesAfter->json());

        $machinesRes = $this->getJson('/api/machines')->assertOk();
        $this->assertCount(3, $machinesRes->json());

        $this->getJson('/api/settings')->assertOk()
            ->assertJsonPath('companyNip', '7752676330');
    }

    public function test_auth_login_and_registration_role_protection(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'Hacker Admin',
            'email' => 'hacker@example.com',
            'password' => 'secret123',
            'role' => 'ADMIN',
        ])->assertStatus(403);

        $regRes = $this->postJson('/api/auth/register', [
            'name' => 'Nowy Kursant',
            'email' => 'nowy@example.com',
            'password' => 'secret123',
            'phone' => '+48 600 700 800',
            'role' => 'STUDENT',
        ])->assertStatus(201);

        $this->assertNotEmpty($regRes->json('token'));
        $this->assertSame('STUDENT', $regRes->json('user.role'));

        $loginRes = $this->postJson('/api/auth/login', [
            'email' => 'kursant@multiserwis.edu.pl',
            'password' => 'MS#Kursant2026!',
        ])->assertOk();

        $token = $loginRes->json('token');
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'kursant@multiserwis.edu.pl');
    }

    public function test_zero_trust_orders_and_anti_idor_public_token_and_fail_closed_webhook(): void
    {
        $orderRes = $this->postJson('/api/orders', [
            'courseId' => 'c1',
            'customerName' => 'Adam Testowy',
            'customerEmail' => 'adam@example.com',
            'amountGross' => 1, // Attempted price tampering from frontend
        ])->assertStatus(201);

        // Must use server-side DB price (1000 PLN), ignoring frontend tampering
        $this->assertEquals(1000.0, $orderRes->json('amountGross'));
        $publicToken = $orderRes->json('publicToken');
        $this->assertNotEmpty($publicToken);

        $this->getJson('/api/orders/'.$publicToken.'/status')
            ->assertOk()
            ->assertJsonPath('status', 'PENDING_PAYMENT');

        // Webhook must fail-closed when PAYMENT_WEBHOOK_SECRET is empty
        config(['services.payment.webhook_secret' => '']);
        $this->postJson('/api/webhooks/payment', ['publicToken' => $publicToken, 'status' => 'PAID'])
            ->assertStatus(500);
    }

    public function test_lms_dashboard_and_progress_calculation(): void
    {
        $student = User::query()->where('email', 'kursant@multiserwis.edu.pl')->firstOrFail();

        $dash = $this->actingAs($student, 'sanctum')
            ->getJson('/api/lms/dashboard')
            ->assertOk();

        $this->assertCount(2, $dash->json('myCourses'));

        $this->actingAs($student, 'sanctum')
            ->postJson('/api/lms/progress', [
                'courseId' => 'c1',
                'lessonId' => 'c1l5',
                'completed' => true,
            ])
            ->assertOk()
            ->assertJsonPath('ok', true);
    }

    public function test_guardian_b2b_dashboard_and_employee_creation(): void
    {
        $guardian = User::query()->where('email', 'opiekun@multiserwis.edu.pl')->firstOrFail();

        $this->actingAs($guardian, 'sanctum')
            ->getJson('/api/guardian/dashboard')
            ->assertOk()
            ->assertJsonPath('companyName', 'ABC Transport Sp. z o.o.');

        $this->actingAs($guardian, 'sanctum')
            ->postJson('/api/guardian/employees', [
                'name' => 'Kamil Pracownik',
                'email' => 'k.pracownik@abctransport.pl',
                'phone' => '+48 501 502 503',
                'courseCode' => 'c2',
            ])
            ->assertStatus(201);
    }

    public function test_contact_form_creates_inquiry_and_sends_mail_with_reply_to(): void
    {
        Mail::fake();

        $this->postJson('/api/contact', [
            'name' => 'Marek Klient',
            'email' => 'marek.klient@example.com',
            'phone' => '+48 700 800 900',
            'subject' => 'Szkolenia UDT',
            'message' => 'Proszę o informację o najbliższym terminie kursu na wózki widłowych.',
        ])->assertStatus(201);

        $this->assertDatabaseHas('inquiries', [
            'email' => 'marek.klient@example.com',
            'name' => 'Marek Klient',
        ]);

        Mail::assertSent(InquiryReceivedMail::class, function (InquiryReceivedMail $mail) {
            return $mail->hasReplyTo('marek.klient@example.com');
        });
    }

    public function test_filament_panel_access_control(): void
    {
        $admin = User::query()->where('email', 'admin@webisko.pl')->firstOrFail();
        $manager = User::query()->where('email', 'menedzer@multiserwis.edu.pl')->firstOrFail();
        $student = User::query()->where('email', 'kursant@multiserwis.edu.pl')->firstOrFail();

        $this->actingAs($admin)->get('/admin/kokpit')->assertOk();
        $this->actingAs($admin)->get('/admin/szkolenia')->assertOk();
        $this->actingAs($admin)->get('/admin/uzytkownicy')->assertOk();
        $this->actingAs($admin)->get('/admin/ustawienia-strony')->assertOk();

        $this->flushSession();
        $this->actingAs($manager)->get('/admin/kokpit')->assertOk();
        $this->actingAs($manager)->get('/admin/szkolenia')->assertOk();
        $this->actingAs($manager)->get('/admin/uzytkownicy')->assertForbidden();
        $this->actingAs($manager)->get('/admin/ustawienia-strony')->assertForbidden();

        $this->flushSession();
        $this->actingAs($student)->get('/admin/kokpit')->assertForbidden();
    }

    public function test_lms_portal_island_endpoints_and_course_access_protection(): void
    {
        $student = User::query()->where('email', 'kursant@multiserwis.edu.pl')->firstOrFail();

        $this->actingAs($student, 'sanctum')
            ->getJson('/api/auth/session')
            ->assertOk()
            ->assertJsonPath('authenticated', true)
            ->assertJsonPath('user.email', 'kursant@multiserwis.edu.pl')
            ->assertJsonPath('user.firstName', 'Jan');

        $coursesRes = $this->actingAs($student, 'sanctum')
            ->getJson('/api/lms/courses')
            ->assertOk();
        $this->assertCount(2, $coursesRes->json());

        $detailRes = $this->actingAs($student, 'sanctum')
            ->getJson('/api/lms/courses/c1')
            ->assertOk();
        $this->assertSame('c1', $detailRes->json('id'));
        $this->assertNotEmpty($detailRes->json('modules'));
        $this->assertNotEmpty($detailRes->json('examQuestions'));

        // Student does NOT have enrollment for c3 -> must return 403 Forbidden
        $this->actingAs($student, 'sanctum')
            ->getJson('/api/lms/courses/c3')
            ->assertStatus(403);

        // Support tickets creation and reply with Polish labels from LmsPortalIsland
        $ticketRes = $this->actingAs($student, 'sanctum')
            ->postJson('/api/tickets', [
                'subject' => 'Pytanie o diagram udźwigu',
                'category' => 'Merytoryczne',
                'priority' => 'normal',
                'message' => 'Jak odczytać środek ciężkości 600 mm?',
            ])
            ->assertStatus(201);

        $ticketId = $ticketRes->json('id');
        $this->assertNotEmpty($ticketId);

        $this->actingAs($student, 'sanctum')
            ->postJson('/api/tickets/'.$ticketId.'/messages', [
                'message' => 'Dziękuję, proszę o dodatkowe wyjaśnienie.',
            ])
            ->assertStatus(201)
            ->assertJsonPath('ok', true);
    }

    public function test_order_history_preserved_on_course_delete_and_zero_cms_overwrite_on_reseed(): void
    {
        $c25 = Course::query()->where('code', 'c25')->firstOrFail();
        $c25->update(['price_gross' => 750, 'price_label' => '750 zł']);

        // Re-running DatabaseSeeder must NOT overwrite CMS changes (Zero CMS Overwrite)
        $this->seed(DatabaseSeeder::class);
        $this->assertEquals(750.0, (float) $c25->fresh()->price_gross);

        $student = User::query()->where('email', 'kursant@multiserwis.edu.pl')->firstOrFail();
        $order = Order::query()->create([
            'user_id' => $student->id,
            'course_id' => $c25->id,
            'course_code' => $c25->code,
            'course_name' => $c25->title,
            'customer_name' => $student->name,
            'customer_email' => $student->email,
            'unit_price_gross' => 750,
            'amount_gross' => 750,
            'status' => 'PENDING_PAYMENT',
        ]);

        // Marking order PAID in CMS must automatically activate Enrollment
        $order->update(['status' => 'PAID']);
        $this->assertNotNull($order->fresh()->paid_at);
        $this->assertTrue(
            Enrollment::query()
                ->where('user_id', $student->id)
                ->where('course_id', $c25->id)
                ->where('status', 'ACTIVE')
                ->exists()
        );

        // Soft-deleting or force-deleting course/user must NOT cascade-delete financial order history
        $c25->forceDelete();
        $student->delete();

        $freshOrder = Order::query()->find($order->id);
        $this->assertNotNull($freshOrder);
        $this->assertNull($freshOrder->course_id);
        $this->assertSame('Operator kos spalinowych i wykaszarek', $freshOrder->course_name);
    }

    public function test_admin_sso_login_and_token_revocation(): void
    {
        $admin = User::query()->where('email', 'admin@webisko.pl')->firstOrFail();
        $token = $admin->createToken('test-sso')->plainTextToken;

        // Pierwsze logowanie SSO z tokenem: sukces i przekierowanie do kokpitu
        $response = $this->get('/admin/sso?sso_token='.urlencode($token));
        $response->assertRedirect('/admin/kokpit');
        $this->assertAuthenticatedAs($admin, 'web');

        // Token został unieważniony (single-use): ponowna próba z tym samym tokenem przekierowuje do logowania
        \Illuminate\Support\Facades\Auth::guard('web')->logout();
        $response2 = $this->get('/admin/sso?sso_token='.urlencode($token));
        $response2->assertRedirect('/admin/logowanie');
    }
}
