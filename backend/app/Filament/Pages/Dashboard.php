<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Courses\CourseResource;
use App\Filament\Resources\Enrollments\EnrollmentResource;
use App\Filament\Resources\Inquiries\InquiryResource;
use App\Filament\Resources\Machines\MachineResource;
use App\Filament\Resources\Orders\OrderResource;
use App\Filament\Resources\SiteSettings\SiteSettingResource;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Inquiry;
use App\Models\Machine;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\User;
use BackedEnum;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Icons\Heroicon;

class Dashboard extends BaseDashboard
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static ?string $navigationLabel = 'Kokpit';

    protected static ?string $title = 'Kokpit ośrodka szkoleniowego';

    protected static ?string $slug = 'kokpit';

    protected static string $routePath = 'kokpit';

    protected string $view = 'filament.pages.dashboard';

    public function getViewData(): array
    {
        $newInquiriesCount = Inquiry::query()->where('status', 'NEW')->where('is_spam', false)->count();
        $totalInquiriesCount = Inquiry::query()->where('is_spam', false)->count();

        $activeCoursesCount = Course::query()->where('is_active', true)->count();
        $onlineCoursesCount = Course::query()->where('is_active', true)->where('has_online', true)->count();

        $activeEnrollmentsCount = Enrollment::query()->where('status', 'ACTIVE')->count();
        $completedEnrollmentsCount = Enrollment::query()->where('status', 'COMPLETED')->count();

        $studentsCount = User::query()->where('role', 'STUDENT')->count();
        $guardiansCount = User::query()->where('role', 'COMPANY_GUARDIAN')->count();
        $machinesCount = Machine::query()->where('is_active', true)->count();
        $ordersCount = Order::query()->count();

        $latestInquiries = Inquiry::query()
            ->where('is_spam', false)
            ->latest('created_at')
            ->limit(6)
            ->get();

        $popularCourses = Course::query()
            ->where('is_active', true)
            ->orderByDesc('is_popular')
            ->orderBy('sort_order')
            ->limit(8)
            ->get();

        return [
            'newInquiriesCount' => $newInquiriesCount,
            'totalInquiriesCount' => $totalInquiriesCount,
            'activeCoursesCount' => $activeCoursesCount,
            'onlineCoursesCount' => $onlineCoursesCount,
            'activeEnrollmentsCount' => $activeEnrollmentsCount,
            'completedEnrollmentsCount' => $completedEnrollmentsCount,
            'studentsCount' => $studentsCount,
            'guardiansCount' => $guardiansCount,
            'machinesCount' => $machinesCount,
            'ordersCount' => $ordersCount,
            'settings' => SiteSetting::current(),
            'latestInquiries' => $latestInquiries,
            'popularCourses' => $popularCourses,
            'urls' => [
                'createCourse' => CourseResource::getUrl('create'),
                'listCourses' => CourseResource::getUrl('index'),
                'listEnrollments' => EnrollmentResource::getUrl('index'),
                'listInquiries' => InquiryResource::getUrl('index'),
                'listOrders' => OrderResource::getUrl('index'),
                'listMachines' => MachineResource::getUrl('index'),
                'editSettings' => SiteSettingResource::getNavigationUrl(),
            ],
        ];
    }
}
