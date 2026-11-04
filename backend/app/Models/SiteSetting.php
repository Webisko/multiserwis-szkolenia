<?php

namespace App\Models;

use App\Support\MediaOptimizer;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'company_legal_name',
        'company_nip',
        'phone_training',
        'phone_training_secondary',
        'phone_rental',
        'email_office',
        'email_notifications',
        'office_address',
        'training_ground_address',
        'opening_hours',
        'facebook_url',
        'top_bar_badge',
        'meta_title',
        'meta_description',
        'default_og_image',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (SiteSetting $setting): void {
            $originalMeta = is_array($setting->getOriginal('metadata')) ? $setting->getOriginal('metadata') : [];
            $newMeta = is_array($setting->metadata) ? $setting->metadata : [];
            $setting->metadata = array_replace($originalMeta, $newMeta);

            if ($setting->isDirty('default_og_image') && filled($setting->default_og_image)) {
                $setting->default_og_image = MediaOptimizer::ensureWebp($setting->default_og_image);
            }
        });
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'site_name' => 'Ośrodek Szkolenia Kadr MultiSerwis Kutno',
                'company_legal_name' => 'MULTISERWIS KUTNO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
                'company_nip' => '7752676330',
                'phone_training' => '+48 730 101 000',
                'phone_training_secondary' => '+48 570 403 806',
                'phone_rental' => '+48 730 202 000',
                'email_office' => 'biuro@multiserwis.edu.pl',
                'email_notifications' => 'multiserwis.kutno@gmail.com',
                'office_address' => 'ul. Henryka Siemiradzkiego 18, 99-300 Kutno',
                'training_ground_address' => 'ul. Przemysłowa 2, 99-300 Kutno',
                'opening_hours' => 'Pon.–Pt.: 8:00 – 16:00',
                'facebook_url' => 'https://www.facebook.com/szkoleniaKutno/',
                'top_bar_badge' => 'Nowe terminy szkoleń UDT, IMBiGS i SEP 2026 w Kutnie',
                'meta_title' => 'MultiSerwis Kutno | Kursy i szkolenia UDT, IMBiGS, SEP • Wynajem maszyn',
                'meta_description' => 'Zdobądź uprawnienia operatora UDT, IMBiGS i SEP w Kutnie. Teoria online 24/7, praktyka na własnym placu manewrowym przy ul. Przemysłowej 2 i egzamin państwowy.',
                'default_og_image' => '/og-image.jpg',
                'metadata' => [],
            ]
        );
    }
}
