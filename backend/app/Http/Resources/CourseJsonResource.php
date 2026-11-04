<?php

namespace App\Http\Resources;

use App\Support\MediaOptimizer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseJsonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $priceGross = (float) $this->price_gross;
        $promoGross = $this->promo_price_gross !== null ? (float) $this->promo_price_gross : null;

        return [
            'id' => $this->code ?: (string) $this->id,
            'dbId' => $this->id,
            'code' => $this->code,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category,
            'duration' => $this->duration,
            'price' => $this->price_label ?: number_format($priceGross, 0, ',', ' ').' zł',
            'priceGross' => $priceGross,
            'promoPriceGross' => $promoGross,
            'image' => MediaOptimizer::publicUrl($this->image),
            'isPopular' => (bool) $this->is_popular,
            'hasOnline' => (bool) $this->has_online,
            'hasStationary' => (bool) $this->has_stationary,
            'shortDescription' => $this->short_description ?? '',
            'description' => $this->description ?? '',
            'syllabus' => is_array($this->syllabus) ? $this->syllabus : [],
            'examBody' => $this->exam_body ?? '',
            'validityPeriod' => $this->validity_period ?? '',
            'status' => $this->is_active ? 'published' : 'draft',
            'seo' => [
                'metaTitle' => $this->meta_title ?: ($this->title.' | MultiSerwis Kutno'),
                'metaDescription' => $this->meta_description ?: ($this->short_description ?? ''),
                'ogImage' => MediaOptimizer::publicUrl($this->og_image ?: $this->image),
            ],
            // Public preview only exposes module titles (never direct lesson video/private files)
            'modulesPreview' => $this->whenLoaded('modules', fn () => $this->modules->where('is_active', true)->values()->map(fn ($m) => [
                'id' => $m->code,
                'title' => $m->title,
                'description' => $m->description ?? '',
            ])),
        ];
    }
}
