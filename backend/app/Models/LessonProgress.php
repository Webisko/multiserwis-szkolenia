<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonProgress extends Model
{
    protected $table = 'lesson_progress';

    protected $fillable = [
        'user_id',
        'course_lesson_id',
        'lesson_code',
        'completed',
        'score',
        'stopped_at',
        'watch_time',
    ];

    protected function casts(): array
    {
        return [
            'completed' => 'boolean',
            'score' => 'integer',
            'stopped_at' => 'integer',
            'watch_time' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(CourseLesson::class, 'course_lesson_id');
    }
}
