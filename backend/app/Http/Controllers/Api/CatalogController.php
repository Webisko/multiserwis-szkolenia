<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseJsonResource;
use App\Http\Resources\MachineJsonResource;
use App\Models\Course;
use App\Models\Machine;
use App\Models\SiteSetting;
use App\Support\MediaOptimizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CatalogController extends Controller
{
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'multiserwis-szkolenia-api',
            'framework' => 'laravel-13',
            'database' => DB::connection()->getDriverName(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function settings(): JsonResponse
    {
        $s = SiteSetting::current();

        return response()->json([
            'siteName' => $s->site_name,
            'companyLegalName' => $s->company_legal_name,
            'companyNip' => $s->company_nip,
            'phoneTraining' => $s->phone_training,
            'phoneTrainingSecondary' => $s->phone_training_secondary ?? '',
            'phoneRental' => $s->phone_rental ?? '',
            'emailOffice' => $s->email_office,
            'emailNotifications' => $s->email_notifications,
            'officeAddress' => $s->office_address,
            'trainingGroundAddress' => $s->training_ground_address,
            'openingHours' => $s->opening_hours ?? '',
            'facebookUrl' => $s->facebook_url ?? '',
            'topBarBadge' => $s->top_bar_badge ?? '',
            'seo' => [
                'metaTitle' => $s->meta_title ?? '',
                'metaDescription' => $s->meta_description ?? '',
                'defaultOgImage' => MediaOptimizer::publicUrl($s->default_og_image, '/og-image.jpg'),
            ],
        ]);
    }

    public function courses(): JsonResponse
    {
        $courses = Course::query()
            ->with('modules')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json(CourseJsonResource::collection($courses)->resolve());
    }

    public function course(string $slugOrCode): JsonResponse
    {
        $course = Course::query()
            ->with('modules')
            ->where('is_active', true)
            ->where(fn ($q) => $q->where('slug', $slugOrCode)->orWhere('code', $slugOrCode))
            ->first();

        if (! $course) {
            return response()->json(['message' => 'Szkolenie nie zostało znalezione.'], 404);
        }

        return response()->json((new CourseJsonResource($course))->resolve());
    }

    public function machines(): JsonResponse
    {
        $machines = Machine::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json(MachineJsonResource::collection($machines)->resolve());
    }
}
