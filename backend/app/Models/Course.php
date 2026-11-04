<?php

namespace App\Models;

use App\Support\MediaOptimizer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'slug',
        'title',
        'category',
        'duration',
        'price_gross',
        'promo_price_gross',
        'price_label',
        'image',
        'is_popular',
        'has_online',
        'has_stationary',
        'short_description',
        'description',
        'syllabus',
        'exam_body',
        'validity_period',
        'sort_order',
        'is_active',
        'meta_title',
        'meta_description',
        'og_image',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'price_gross' => 'decimal:2',
            'promo_price_gross' => 'decimal:2',
            'is_popular' => 'boolean',
            'has_online' => 'boolean',
            'has_stationary' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'syllabus' => 'array',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Course $course): void {
            if (empty($course->slug)) {
                $course->slug = Str::slug($course->title);
            }
            if (empty($course->code)) {
                $course->code = 'c_'.substr(md5($course->slug), 0, 6);
            }
            if (empty($course->price_label) && $course->price_gross !== null) {
                $course->price_label = number_format((float) $course->price_gross, 0, ',', ' ').' zł';
            }

            static::onlyTrashed()
                ->where(fn ($q) => $q->where('slug', $course->slug)->orWhere('code', $course->code))
                ->get()
                ->each(function (Course $trashed): void {
                    $trashed->updateQuietly([
                        'slug' => $trashed->slug.'__trashed_'.$trashed->id,
                        'code' => $trashed->code.'_t'.$trashed->id,
                    ]);
                });

            $course->image = MediaOptimizer::ensureWebp($course->image) ?? '/operator-wozki-widlowe.webp';
            $course->og_image = MediaOptimizer::ensureWebp($course->og_image, 1200);

            $originalMeta = is_array($course->getOriginal('metadata')) ? $course->getOriginal('metadata') : [];
            $newMeta = is_array($course->metadata) ? $course->metadata : [];
            $course->metadata = array_replace($originalMeta, $newMeta);
        });
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('sort_order');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(CourseLesson::class)->orderBy('sort_order');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ExamQuestion::class)->orderBy('sort_order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
