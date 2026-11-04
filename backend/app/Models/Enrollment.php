<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    protected $fillable = [
        'legacy_id',
        'user_id',
        'course_id',
        'status',
        'progress',
        'next_lesson',
        'completed_lessons',
        'expires_at',
        'completed_at',
        'certificate_number',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'progress' => 'integer',
            'completed_lessons' => 'array',
            'expires_at' => 'datetime',
            'completed_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Enrollment $enrollment): void {
            $originalMeta = is_array($enrollment->getOriginal('metadata')) ? $enrollment->getOriginal('metadata') : [];
            $newMeta = is_array($enrollment->metadata) ? $enrollment->metadata : [];
            $enrollment->metadata = array_replace($originalMeta, $newMeta);
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
