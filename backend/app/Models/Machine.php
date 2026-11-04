<?php

namespace App\Models;

use App\Support\MediaOptimizer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Machine extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'slug',
        'name',
        'type',
        'height',
        'capacity',
        'weight',
        'daily_price_net',
        'image',
        'description',
        'specs',
        'sort_order',
        'is_active',
        'meta_title',
        'meta_description',
        'og_image',
    ];

    protected function casts(): array
    {
        return [
            'daily_price_net' => 'decimal:2',
            'specs' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Machine $machine): void {
            if (empty($machine->slug)) {
                $machine->slug = Str::slug($machine->name);
            }
            if (empty($machine->code)) {
                $machine->code = 'm_'.substr(md5($machine->slug), 0, 6);
            }

            static::onlyTrashed()
                ->where(fn ($q) => $q->where('slug', $machine->slug)->orWhere('code', $machine->code))
                ->get()
                ->each(function (Machine $trashed): void {
                    $trashed->updateQuietly([
                        'slug' => $trashed->slug.'__trashed_'.$trashed->id,
                        'code' => $trashed->code.'_t'.$trashed->id,
                    ]);
                });

            $machine->image = MediaOptimizer::ensureWebp($machine->image) ?? '/manitou-mrt-2150.webp';
            $machine->og_image = MediaOptimizer::ensureWebp($machine->og_image, 1200);
        });
    }
}
