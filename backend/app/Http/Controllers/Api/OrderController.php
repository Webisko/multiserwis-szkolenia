<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderStatusJsonResource;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'courseId' => ['required', 'string', 'max:120'],
            'customerName' => ['nullable', 'string', 'max:255'],
            'customerEmail' => ['nullable', 'string', 'email:rfc', 'max:255'],
            'customerPhone' => ['nullable', 'string', 'max:64'],
            'companyName' => ['nullable', 'string', 'max:255'],
            'companyNip' => ['nullable', 'string', 'max:32'],
            'provider' => ['nullable', 'string', 'max:64'],
            'notes' => ['nullable', 'string', 'max:1500'],
        ]);

        $user = $request->user('sanctum');

        $order = DB::transaction(function () use ($validated, $user): Order {
            $course = Course::query()
                ->where('is_active', true)
                ->where(fn ($q) => $q->where('code', $validated['courseId'])
                    ->orWhere('slug', $validated['courseId'])
                    ->orWhere('id', is_numeric($validated['courseId']) ? (int) $validated['courseId'] : 0))
                ->lockForUpdate()
                ->firstOrFail();

            // Zero-Trust Frontend: price is calculated strictly from the database record
            $unitPrice = $course->promo_price_gross !== null
                ? (float) $course->promo_price_gross
                : (float) $course->price_gross;

            return Order::query()->create([
                'user_id' => $user?->id,
                'course_id' => $course->id,
                'course_code' => $course->code,
                'course_name' => $course->title,
                'customer_name' => $validated['customerName'] ?? ($user?->name ?? 'Kursant MultiSerwis'),
                'customer_email' => $validated['customerEmail'] ?? ($user?->email ?? 'biuro@multiserwis.edu.pl'),
                'customer_phone' => $validated['customerPhone'] ?? $user?->phone,
                'company_name' => $validated['companyName'] ?? $user?->company_name,
                'company_nip' => $validated['companyNip'] ?? $user?->company_nip,
                'unit_price_gross' => $unitPrice,
                'vat_rate' => 'zw',
                'amount_gross' => $unitPrice,
                'currency' => 'PLN',
                'provider' => $validated['provider'] ?? 'przelew',
                'status' => 'PENDING_PAYMENT',
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json((new OrderStatusJsonResource($order))->resolve(), 201);
    }

    /**
     * Anti-IDOR: Order status can ONLY be queried by unguessable public_token UUID.
     */
    public function status(string $publicToken): JsonResponse
    {
        $order = Order::query()->where('public_token', $publicToken)->first();
        if (! $order) {
            return response()->json(['message' => 'Zamówienie nie zostało znalezione.'], 404);
        }

        return response()->json((new OrderStatusJsonResource($order))->resolve());
    }

    /**
     * Fail-Closed Webhook for payment confirmation (HMAC-SHA256).
     */
    public function webhook(Request $request): JsonResponse
    {
        $signatureKey = (string) config('services.payment.webhook_secret', env('PAYMENT_WEBHOOK_SECRET', ''));
        if ($signatureKey === '') {
            Log::critical('Payment webhook rejected: PAYMENT_WEBHOOK_SECRET is empty (Fail-Closed).');

            return response()->json(['error' => 'Webhook signature key not configured'], 500);
        }

        $receivedSignature = (string) ($request->header('Signature') ?? $request->header('X-Webhook-Signature') ?? '');
        $rawPayload = (string) $request->getContent();
        $expectedSignature = base64_encode(hash_hmac('sha256', $rawPayload, $signatureKey, true));

        if ($receivedSignature === '' || ! hash_equals($expectedSignature, $receivedSignature)) {
            Log::warning('Payment webhook rejected: Invalid HMAC signature.');

            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $publicToken = (string) $request->input('publicToken', '');
        $newStatus = strtoupper((string) $request->input('status', ''));

        DB::transaction(function () use ($publicToken, $newStatus): void {
            $order = Order::query()->where('public_token', $publicToken)->lockForUpdate()->first();
            if (! $order) {
                return;
            }

            if ($newStatus === 'PAID' || $newStatus === 'CONFIRMED') {
                $order->update([
                    'status' => 'PAID',
                    'paid_at' => now(),
                ]);

                if ($order->user_id && $order->course_id) {
                    Enrollment::query()->updateOrCreate(
                        ['user_id' => $order->user_id, 'course_id' => $order->course_id],
                        [
                            'status' => 'ACTIVE',
                            'expires_at' => now()->addMonths(6),
                        ]
                    );
                }
            } elseif (in_array($newStatus, ['FAILED', 'REJECTED', 'ABANDONED'], true)) {
                $order->update(['status' => 'FAILED']);
            }
        });

        return response()->json(['ok' => true]);
    }
}
