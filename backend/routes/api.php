<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\LmsController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\Route;

// Health & Public Catalog
Route::get('/health', [CatalogController::class, 'health']);
Route::get('/settings', [CatalogController::class, 'settings']);
Route::get('/courses', [CatalogController::class, 'courses']);
Route::get('/courses/{slugOrCode}', [CatalogController::class, 'course']);
Route::get('/machines', [CatalogController::class, 'machines']);

// Public Forms & Orders (Throttled)
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:15,10');
Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:8,10');
Route::get('/orders/{publicToken}/status', [OrderController::class, 'status'])->middleware('throttle:20,1');
Route::post('/webhooks/payment', [OrderController::class, 'webhook']);

// Auth Endpoints (Throttled)
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/auth/session', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:8,10');

// Authenticated LMS & B2B Guardian Endpoints (Sanctum)
Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/auth/session', [AuthController::class, 'session']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::delete('/auth/session', [AuthController::class, 'logout']);

    Route::get('/lms/dashboard', [LmsController::class, 'dashboard']);
    Route::get('/lms/courses', [LmsController::class, 'courses']);
    Route::get('/lms/courses/{courseId}', [LmsController::class, 'courseDetail']);
    Route::post('/lms/progress', [LmsController::class, 'updateProgress']);
    Route::get('/lms/lessons/{lessonCode}/download', [LmsController::class, 'downloadLessonMaterial']);

    Route::get('/guardian/dashboard', [LmsController::class, 'guardianDashboard']);
    Route::get('/guardian/employees', [LmsController::class, 'guardianEmployees']);
    Route::post('/guardian/employees', [LmsController::class, 'storeGuardianEmployee'])->middleware('throttle:15,10');

    Route::get('/tickets', [LmsController::class, 'tickets']);
    Route::post('/tickets', [LmsController::class, 'storeTicket'])->middleware('throttle:10,10');
    Route::post('/tickets/{ticketId}/messages', [LmsController::class, 'storeTicketMessage'])->middleware('throttle:15,10');
});
