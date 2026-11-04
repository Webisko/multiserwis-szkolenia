<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'public_token',
        'order_number',
        'user_id',
        'course_id',
        'course_code',
        'course_name',
        'customer_name',
        'customer_email',
        'customer_phone',
        'company_name',
        'company_nip',
        'unit_price_gross',
        'vat_rate',
        'amount_gross',
        'currency',
        'provider',
        'status',
        'paid_at',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'unit_price_gross' => 'decimal:2',
            'amount_gross' => 'decimal:2',
            'paid_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order): void {
            if (empty($order->public_token)) {
                $order->public_token = (string) Str::uuid();
            }
            if (empty($order->order_number)) {
                $year = now()->format('Y');
                $next = (int) static::query()->max('id') + 1;
                do {
                    $candidate = sprintf('ZAM/%s/%04d', $year, $next);
                    $next++;
                } while (static::query()->where('order_number', $candidate)->exists());
                $order->order_number = $candidate;
            }
        });

        static::saving(function (Order $order): void {
            $originalMeta = is_array($order->getOriginal('metadata')) ? $order->getOriginal('metadata') : [];
            $newMeta = is_array($order->metadata) ? $order->metadata : [];
            $order->metadata = array_replace($originalMeta, $newMeta);

            if ($order->status === 'PAID' && $order->paid_at === null) {
                $order->paid_at = now();
            }
        });

        static::saved(function (Order $order): void {
            if ($order->status === 'PAID' && $order->user_id && $order->course_id) {
                Enrollment::query()->updateOrCreate(
                    ['user_id' => $order->user_id, 'course_id' => $order->course_id],
                    [
                        'status' => 'ACTIVE',
                        'expires_at' => now()->addMonths(6),
                    ]
                );
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
