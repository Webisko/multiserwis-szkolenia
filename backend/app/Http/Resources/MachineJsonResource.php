<?php

namespace App\Http\Resources;

use App\Support\MediaOptimizer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MachineJsonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->code ?: (string) $this->id,
            'code' => $this->code,
            'slug' => $this->slug,
            'name' => $this->name,
            'type' => $this->type,
            'image' => MediaOptimizer::publicUrl($this->image, '/manitou-mrt-2150.webp'),
            'dailyPriceNet' => $this->daily_price_net !== null ? (float) $this->daily_price_net : null,
            'description' => $this->description ?? '',
            'specs' => [
                'height' => $this->height ?? ($this->specs['height'] ?? ''),
                'capacity' => $this->capacity ?? ($this->specs['capacity'] ?? ''),
                'weight' => $this->weight ?? ($this->specs['weight'] ?? ''),
            ],
            'seo' => [
                'metaTitle' => $this->meta_title ?: ($this->name.' – Wynajem | MultiSerwis Kutno'),
                'metaDescription' => $this->meta_description ?: ($this->description ?? ''),
                'ogImage' => MediaOptimizer::publicUrl($this->og_image ?: $this->image, '/manitou-mrt-2150.webp'),
            ],
        ];
    }
}
