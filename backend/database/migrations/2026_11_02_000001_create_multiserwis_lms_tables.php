<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('Ośrodek Szkolenia Kadr MultiSerwis Kutno');
            $table->string('company_legal_name')->default('MULTISERWIS KUTNO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ');
            $table->string('company_nip', 32)->default('7752676330');
            $table->string('phone_training', 64)->default('+48 730 101 000');
            $table->string('phone_training_secondary', 64)->default('+48 570 403 806');
            $table->string('phone_rental', 64)->default('+48 730 202 000');
            $table->string('email_office')->default('biuro@multiserwis.edu.pl');
            $table->string('email_notifications')->default('szkolenia@multiserwis.tech');
            $table->string('office_address')->default('ul. Henryka Siemiradzkiego 18, 99-300 Kutno');
            $table->string('training_ground_address')->default('ul. Przemysłowa 2, 99-300 Kutno');
            $table->string('opening_hours')->default('Pon.–Pt.: 8:00 – 16:00');
            $table->string('facebook_url')->nullable();
            $table->string('top_bar_badge')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('default_og_image')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique(); // e.g. c1..c25
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category', 64)->index(); // UDT, IMBiGS, SEP, Spawalnictwo, Inne
            $table->string('duration', 64)->default('24 godz.');
            $table->decimal('price_gross', 10, 2)->default(1000.00);
            $table->decimal('promo_price_gross', 10, 2)->nullable();
            $table->string('price_label', 64)->default('1 000 zł');
            $table->string('image')->default('/operator-wozki-widlowe.webp');
            $table->boolean('is_popular')->default(false)->index();
            $table->boolean('has_online')->default(false);
            $table->boolean('has_stationary')->default(true);
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->json('syllabus')->nullable();
            $table->string('exam_body', 120)->nullable();
            $table->string('validity_period', 64)->nullable();
            $table->integer('sort_order')->default(10)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('code', 64)->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(10);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_module_id')->constrained('course_modules')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('code', 64)->unique();
            $table->string('title');
            $table->string('type', 32)->default('video'); // video, text, test, quiz
            $table->string('duration', 64)->default('15:00');
            $table->string('video_url')->nullable();
            $table->string('digital_file_path')->nullable(); // Private storage path
            $table->longText('content')->nullable();
            $table->json('questions')->nullable();
            $table->boolean('is_locked')->default(false);
            $table->integer('sort_order')->default(10);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('course_module_id')->nullable()->constrained('course_modules')->nullOnDelete();
            $table->string('code', 64)->nullable()->index();
            $table->text('question');
            $table->string('type', 32)->default('SINGLE_CHOICE'); // SINGLE_CHOICE, MULTIPLE_CHOICE, OPEN
            $table->string('difficulty', 32)->default('MEDIUM'); // EASY, MEDIUM, HARD
            $table->json('options')->nullable();
            $table->json('correct_answer')->nullable();
            $table->text('explanation')->nullable();
            $table->integer('sort_order')->default(10);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique(); // m1..m3
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('type');
            $table->string('height', 64)->nullable();
            $table->string('capacity', 64)->nullable();
            $table->string('weight', 64)->nullable();
            $table->decimal('daily_price_net', 10, 2)->nullable();
            $table->string('image')->default('/manitou-mrt-2150.webp');
            $table->text('description')->nullable();
            $table->json('specs')->nullable();
            $table->integer('sort_order')->default(10)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Orders: strictly NO cascadeOnDelete on historical orders!
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_token')->unique();
            $table->string('order_number', 64)->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->string('course_code', 32)->nullable();
            $table->string('course_name');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone', 64)->nullable();
            $table->string('company_name')->nullable();
            $table->string('company_nip', 32)->nullable();
            $table->decimal('unit_price_gross', 10, 2)->default(0);
            $table->string('vat_rate', 16)->default('zw');
            $table->decimal('amount_gross', 10, 2)->default(0);
            $table->string('currency', 8)->default('PLN');
            $table->string('provider', 64)->nullable()->default('przelew');
            $table->string('status', 32)->default('PENDING_PAYMENT')->index(); // DRAFT, PENDING_PAYMENT, PAID, CANCELLED, FAILED
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id', 64)->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('status', 32)->default('ACTIVE')->index(); // ACTIVE, COMPLETED, PAUSED, EXPIRED
            $table->integer('progress')->default(0);
            $table->string('next_lesson')->nullable();
            $table->json('completed_lessons')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('certificate_number', 64)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });

        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_lesson_id')->nullable()->constrained('course_lessons')->nullOnDelete();
            $table->string('lesson_code', 64)->index();
            $table->boolean('completed')->default(false);
            $table->integer('score')->nullable();
            $table->integer('stopped_at')->default(0);
            $table->integer('watch_time')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'lesson_code']);
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 64)->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('subject');
            $table->string('category', 32)->default('GENERAL'); // TECH, GENERAL, BILLING
            $table->string('status', 32)->default('OPEN')->index(); // OPEN, IN_PROGRESS, CLOSED
            $table->timestamps();
        });

        Schema::create('ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('sender_name')->nullable();
            $table->text('content');
            $table->boolean('is_internal')->default(false);
            $table->timestamps();
        });

        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id', 64)->nullable();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 64)->nullable();
            $table->string('company')->nullable();
            $table->string('nip', 32)->nullable();
            $table->string('subject')->nullable();
            $table->string('course_name')->nullable();
            $table->string('inquiry_type', 32)->default('KONTAKT')->index(); // INDYWIDUALNY, B2B, WYNAJEM, SERWIS, KONTAKT
            $table->text('message')->nullable();
            $table->string('status', 32)->default('NEW')->index(); // NEW, IN_PROGRESS, DONE, ARCHIVED
            $table->text('admin_notes')->nullable();
            $table->boolean('is_spam')->default(false)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('ticket_messages');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('machines');
        Schema::dropIfExists('exam_questions');
        Schema::dropIfExists('course_lessons');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('site_settings');
    }
};
