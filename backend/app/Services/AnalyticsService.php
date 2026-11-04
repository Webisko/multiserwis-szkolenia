<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Inquiry;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AnalyticsService
{
    protected string $websiteId;

    public function __construct()
    {
        $this->websiteId = env('UMAMI_WEBSITE_ID', 'fffb3ad4-dc24-48dc-b99f-6263eb60a221');
    }

    public function isAvailable(): bool
    {
        return Schema::hasTable('website_event') && Schema::hasTable('session');
    }

    public function getSummaryMetrics(): array
    {
        if (! $this->isAvailable()) {
            return [
                'visitsToday' => 0,
                'visitsWeek' => 0,
                'visitsMonth' => 0,
                'pageviewsToday' => 0,
                'pageviewsWeek' => 0,
                'pageviewsTotal' => 0,
                'inquiriesWeek' => 0,
                'conversionRate' => 0.0,
            ];
        }

        $now = Carbon::now();
        $todayStart = $now->copy()->startOfDay();
        $weekAgo = $now->copy()->subDays(7)->startOfDay();
        $monthAgo = $now->copy()->subDays(30)->startOfDay();

        $visitsToday = DB::table('session')
            ->where('created_at', '>=', $todayStart)
            ->count();

        $visitsWeek = DB::table('session')
            ->where('created_at', '>=', $weekAgo)
            ->count();

        $visitsMonth = DB::table('session')
            ->where('created_at', '>=', $monthAgo)
            ->count();

        $pageviewsToday = DB::table('website_event')
            ->where('created_at', '>=', $todayStart)
            ->count();

        $pageviewsWeek = DB::table('website_event')
            ->where('created_at', '>=', $weekAgo)
            ->count();

        $pageviewsTotal = DB::table('website_event')
            ->count();

        $inquiriesWeek = Inquiry::query()
            ->where('created_at', '>=', $weekAgo)
            ->where('is_spam', false)
            ->count();

        $conversionRate = $visitsWeek > 0
            ? round(($inquiriesWeek / $visitsWeek) * 100, 1)
            : 0.0;

        return [
            'visitsToday' => $visitsToday,
            'visitsWeek' => $visitsWeek,
            'visitsMonth' => $visitsMonth,
            'pageviewsToday' => $pageviewsToday,
            'pageviewsWeek' => $pageviewsWeek,
            'pageviewsTotal' => $pageviewsTotal,
            'inquiriesWeek' => $inquiriesWeek,
            'conversionRate' => $conversionRate,
        ];
    }

    public function getDailyTrend(int $days = 14): array
    {
        if (! $this->isAvailable()) {
            return [];
        }

        $daysData = [];
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        $eventsByDay = DB::table('website_event')
            ->selectRaw('DATE(created_at) as event_date, COUNT(*) as pageviews')
            ->where('created_at', '>=', $startDate)
            ->groupBy('event_date')
            ->pluck('pageviews', 'event_date')
            ->toArray();

        $sessionsByDay = DB::table('session')
            ->selectRaw('DATE(created_at) as session_date, COUNT(*) as visits')
            ->where('created_at', '>=', $startDate)
            ->groupBy('session_date')
            ->pluck('visits', 'session_date')
            ->toArray();

        $maxVisits = 1;
        for ($i = 0; $i < $days; $i++) {
            $currentDay = $startDate->copy()->addDays($i);
            $dateKey = $currentDay->format('Y-m-d');
            $visits = (int) ($sessionsByDay[$dateKey] ?? 0);
            $pageviews = (int) ($eventsByDay[$dateKey] ?? 0);

            if ($visits > $maxVisits) {
                $maxVisits = $visits;
            }

            $daysData[] = [
                'date' => $currentDay->format('d.m'),
                'dayName' => $this->getPolishDayName($currentDay->dayOfWeek),
                'visits' => $visits,
                'pageviews' => $pageviews,
            ];
        }

        foreach ($daysData as &$d) {
            $d['heightPercent'] = $maxVisits > 0 ? max(10, min(100, round(($d['visits'] / $maxVisits) * 100))) : 10;
        }

        return $daysData;
    }

    public function getTopCourses(int $limit = 6): array
    {
        if (! $this->isAvailable()) {
            return [];
        }

        $records = DB::table('website_event')
            ->selectRaw('url_path, page_title, COUNT(*) as total_views')
            ->where('url_path', 'LIKE', '/szkolenia/%')
            ->groupBy('url_path', 'page_title')
            ->orderByDesc('total_views')
            ->limit($limit)
            ->get();

        $results = [];
        foreach ($records as $rec) {
            $slug = trim(str_replace('/szkolenia/', '', $rec->url_path), '/');
            $course = Course::query()->where('slug', $slug)->first();

            $results[] = [
                'title' => $course ? $course->title : ($rec->page_title ?: $rec->url_path),
                'category' => $course ? $course->category : 'Szkolenia',
                'url' => $rec->url_path,
                'views' => (int) $rec->total_views,
                'courseId' => $course?->id,
            ];
        }

        return $results;
    }

    public function getTrafficSources(int $limit = 5): array
    {
        if (! $this->isAvailable()) {
            return [];
        }

        $records = DB::table('website_event')
            ->selectRaw('referrer_domain, COUNT(*) as total_visits')
            ->where('referrer_domain', 'NOT LIKE', '%multiserwis.edu.pl%')
            ->groupBy('referrer_domain')
            ->orderByDesc('total_visits')
            ->limit($limit)
            ->get();

        $totalCount = 0;
        $formatted = [];

        foreach ($records as $r) {
            $domain = trim((string) $r->referrer_domain);
            $label = match (true) {
                empty($domain) => 'Wejścia bezpośrednie / Zakładki',
                str_contains($domain, 'google') => 'Wyszukiwarka Google',
                str_contains($domain, 'facebook') || str_contains($domain, 'fb.com') => 'Facebook',
                str_contains($domain, 'instagram') => 'Instagram',
                str_contains($domain, 'olx') => 'Portal OLX',
                default => $domain,
            };

            $formatted[] = [
                'label' => $label,
                'count' => (int) $r->total_visits,
            ];
            $totalCount += (int) $r->total_visits;
        }

        if (empty($formatted)) {
            $formatted[] = [
                'label' => 'Wejścia bezpośrednie',
                'count' => 1,
            ];
            $totalCount = 1;
        }

        foreach ($formatted as &$item) {
            $item['percentage'] = $totalCount > 0 ? round(($item['count'] / $totalCount) * 100) : 0;
        }

        return $formatted;
    }

    public function getDeviceBreakdown(): array
    {
        if (! $this->isAvailable()) {
            return [
                'mobile' => 0,
                'desktop' => 0,
                'tablet' => 0,
            ];
        }

        $devices = DB::table('session')
            ->selectRaw('device, COUNT(*) as total')
            ->groupBy('device')
            ->pluck('total', 'device')
            ->toArray();

        $mobile = (int) ($devices['mobile'] ?? 0);
        $desktop = (int) ($devices['desktop'] ?? 0);
        $tablet = (int) ($devices['tablet'] ?? 0);
        $sum = $mobile + $desktop + $tablet;

        return [
            'mobile' => $sum > 0 ? round(($mobile / $sum) * 100) : 0,
            'desktop' => $sum > 0 ? round(($desktop / $sum) * 100) : 0,
            'tablet' => $sum > 0 ? round(($tablet / $sum) * 100) : 0,
            'rawMobile' => $mobile,
            'rawDesktop' => $desktop,
            'rawTablet' => $tablet,
        ];
    }

    protected function getPolishDayName(int $dayOfWeek): string
    {
        return match ($dayOfWeek) {
            0 => 'Nd',
            1 => 'Pn',
            2 => 'Wt',
            3 => 'Śr',
            4 => 'Cz',
            5 => 'Pt',
            6 => 'Sb',
            default => '',
        };
    }
}
