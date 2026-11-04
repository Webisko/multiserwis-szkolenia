<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseLesson extends Model
{
    protected $fillable = [
        'course_module_id',
        'course_id',
        'code',
        'title',
        'type',
        'duration',
        'video_url',
        'digital_file_path',
        'content',
        'questions',
        'is_locked',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'questions' => 'array',
            'is_locked' => 'boolean',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (CourseLesson $lesson): void {
            if (empty($lesson->code)) {
                $lesson->code = 'les_'.substr(uniqid(), -6);
            }
            if (empty($lesson->course_id) && $lesson->course_module_id) {
                $lesson->course_id = CourseModule::query()->whereKey($lesson->course_module_id)->value('course_id');
            }
        });
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
