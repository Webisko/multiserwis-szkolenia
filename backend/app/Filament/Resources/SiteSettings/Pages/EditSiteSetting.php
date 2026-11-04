<?php

namespace App\Filament\Resources\SiteSettings\Pages;

use App\Filament\Resources\SiteSettings\SiteSettingResource;
use App\Models\SiteSetting;
use Filament\Resources\Pages\EditRecord;

class EditSiteSetting extends EditRecord
{
    protected static string $resource = SiteSettingResource::class;

    public function mount(int|string|null $record = null): void
    {
        $setting = SiteSetting::current();
        parent::mount($setting->getKey());
    }

    protected function getHeaderActions(): array
    {
        return [];
    }
}
