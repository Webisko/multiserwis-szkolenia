<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Courses\CourseResource;
use App\Services\AnalyticsService;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;

class AnalyticsPage extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChartBar;

    protected static ?string $navigationLabel = 'Analityka i ruch';

    protected static ?string $title = 'Analityka i ruch na stronie';

    protected static ?string $slug = 'analityka';

    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.pages.analytics';

    public static function canAccess(): bool
    {
        $role = strtoupper((string) auth()->user()?->role);

        return in_array($role, ['ADMIN', 'MANAGER'], true);
    }

    public function getViewData(): array
    {
        $service = app(AnalyticsService::class);

        $metrics = $service->getSummaryMetrics();
        $dailyTrend = $service->getDailyTrend(14);
        $topCourses = $service->getTopCourses(6);
        $sources = $service->getTrafficSources(5);
        $devices = $service->getDeviceBreakdown();

        // Przypisanie linków do edycji kursów
        foreach ($topCourses as &$c) {
            $c['editUrl'] = $c['courseId'] ? CourseResource::getUrl('edit', ['record' => $c['courseId']]) : null;
        }

        return [
            'metrics' => $metrics,
            'dailyTrend' => $dailyTrend,
            'topCourses' => $topCourses,
            'sources' => $sources,
            'devices' => $devices,
            'umamiUrl' => 'https://stats.multiserwis.edu.pl',
            'isAvailable' => $service->isAvailable(),
        ];
    }
}
