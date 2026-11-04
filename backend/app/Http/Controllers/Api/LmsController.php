<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\Enrollment;
use App\Models\ExamQuestion;
use App\Models\LessonProgress;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\User;
use App\Support\MediaOptimizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LmsController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $enrollments = Enrollment::query()
            ->with(['course.modules.lessons', 'course.questions'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['ACTIVE', 'COMPLETED'])
            ->get()
            ->filter(fn (Enrollment $enr) => $enr->expires_at === null || $enr->expires_at->isFuture() || $enr->status === 'COMPLETED')
            ->values();

        $progressRows = LessonProgress::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_code');

        $myCourses = $enrollments->map(function (Enrollment $enr) use ($progressRows) {
            $course = $enr->course;
            $completedList = is_array($enr->completed_lessons) ? $enr->completed_lessons : [];
            foreach ($progressRows as $code => $pr) {
                if ($pr->completed && ! in_array($code, $completedList, true)) {
                    $completedList[] = $code;
                }
            }

            $modules = ($course?->modules ?? collect())->where('is_active', true)->values()->map(function ($m) use ($completedList, $course) {
                $moduleQuestions = ($course?->questions ?? collect())
                    ->where('is_active', true)
                    ->where('course_module_id', $m->id)
                    ->values()
                    ->map(fn (ExamQuestion $q) => [
                        'id' => $q->code ?: 'q_'.$q->id,
                        'question' => $q->question,
                        'type' => strtolower($q->type) === 'multiple_choice' ? 'multiple' : 'single',
                        'options' => is_array($q->options) ? $q->options : [],
                        'correctAnswer' => is_array($q->correct_answer) ? $q->correct_answer : [],
                        'explanation' => $q->explanation ?? '',
                    ]);

                return [
                    'id' => $m->code,
                    'title' => $m->title,
                    'description' => $m->description ?? '',
                    'lessons' => $m->lessons->where('is_active', true)->values()->map(fn (CourseLesson $l) => [
                        'id' => $l->code,
                        'title' => $l->title,
                        'type' => $l->type,
                        'duration' => $l->duration,
                        'content' => $l->content ?? '',
                        'videoUrl' => $l->video_url,
                        'hasPrivateFile' => filled($l->digital_file_path),
                        'isCompleted' => in_array($l->code, $completedList, true),
                        'completed' => in_array($l->code, $completedList, true),
                        'isLocked' => (bool) $l->is_locked,
                        'questions' => in_array($l->type, ['test', 'quiz'], true) ? $moduleQuestions : [],
                    ]),
                ];
            });

            $totalLessons = ($course?->modules ?? collect())
                ->where('is_active', true)
                ->sum(fn ($m) => $m->lessons->where('is_active', true)->count());

            return [
                'enrollmentId' => (string) $enr->id,
                'id' => $course?->code ?? (string) $enr->course_id,
                'courseId' => $course?->code ?? (string) $enr->course_id,
                'slug' => $course?->slug ?? '',
                'title' => $course?->title ?? 'Szkolenie',
                'category' => $course?->category ?? 'UDT',
                'duration' => $course?->duration ?? '',
                'image' => MediaOptimizer::publicUrl($course?->image),
                'description' => $course?->short_description ?? $course?->description ?? '',
                'status' => strtolower($enr->status),
                'progress' => (int) $enr->progress,
                'nextLesson' => $enr->next_lesson ?? '',
                'completedLessons' => array_values($completedList),
                'completedLessonsCount' => count($completedList),
                'totalLessons' => max(1, (int) $totalLessons),
                'certificateNumber' => $enr->certificate_number,
                'expiresAt' => $enr->expires_at?->format('Y-m-d'),
                'completedAt' => $enr->completed_at?->format('Y-m-d'),
                'modules' => $modules,
            ];
        });

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'role' => $user->role,
                'company' => $user->company_name ?? '',
            ],
            'myCourses' => $myCourses,
        ]);
    }

    public function courses(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $enrollments = Enrollment::query()
            ->with(['course.modules.lessons'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['ACTIVE', 'COMPLETED'])
            ->get()
            ->filter(fn (Enrollment $enr) => $enr->expires_at === null || $enr->expires_at->isFuture() || $enr->status === 'COMPLETED')
            ->values();

        $progressRows = LessonProgress::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_code');

        $list = $enrollments->map(function (Enrollment $enr) use ($progressRows) {
            $course = $enr->course;
            $completedList = is_array($enr->completed_lessons) ? $enr->completed_lessons : [];
            foreach ($progressRows as $code => $pr) {
                if ($pr->completed && ! in_array($code, $completedList, true)) {
                    $completedList[] = $code;
                }
            }

            $activeLessons = ($course?->modules ?? collect())
                ->where('is_active', true)
                ->flatMap(fn ($m) => $m->lessons->where('is_active', true));

            $totalLessons = max(1, $activeLessons->count());
            $doneCount = $activeLessons->filter(fn ($l) => in_array($l->code, $completedList, true))->count();

            return [
                'enrollmentId' => (string) $enr->id,
                'id' => $course?->code ?? (string) $enr->course_id,
                'courseId' => $course?->code ?? (string) $enr->course_id,
                'slug' => $course?->slug ?? '',
                'title' => $course?->title ?? 'Szkolenie',
                'category' => $course?->category ?? 'UDT',
                'duration' => $course?->duration ?? '',
                'image' => MediaOptimizer::publicUrl($course?->image),
                'description' => $course?->short_description ?? $course?->description ?? '',
                'progress' => (int) $enr->progress,
                'status' => strtolower($enr->status),
                'completedLessons' => $doneCount,
                'totalLessons' => $totalLessons,
                'certificateNumber' => $enr->certificate_number,
                'expiresAt' => $enr->expires_at?->format('Y-m-d'),
                'completedAt' => $enr->completed_at?->format('Y-m-d'),
            ];
        });

        return response()->json($list);
    }

    public function courseDetail(Request $request, string $courseId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $course = Course::query()
            ->with(['modules.lessons', 'questions'])
            ->where('code', $courseId)
            ->orWhere('slug', $courseId)
            ->firstOrFail();

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['ACTIVE', 'COMPLETED'])
            ->first();

        $isExpired = $enrollment && $enrollment->expires_at !== null && $enrollment->expires_at->isPast() && $enrollment->status !== 'COMPLETED';

        if ((! $enrollment || $isExpired) && ! in_array(strtoupper($user->role), ['ADMIN', 'MANAGER'], true)) {
            return response()->json(['message' => 'Brak aktywnego uprawnienia do tego kursu.'], 403);
        }

        $progressRows = LessonProgress::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_code');

        $completedList = is_array($enrollment?->completed_lessons) ? $enrollment->completed_lessons : [];
        foreach ($progressRows as $code => $pr) {
            if ($pr->completed && ! in_array($code, $completedList, true)) {
                $completedList[] = $code;
            }
        }

        $modules = $course->modules->where('is_active', true)->values()->map(function ($m, int $mIdx) use ($completedList, $course) {
            return [
                'id' => $m->code,
                'courseId' => $course->code,
                'title' => $m->title,
                'description' => $m->description ?? '',
                'order' => $m->sort_order ?: ($mIdx + 1) * 10,
                'lessons' => $m->lessons->where('is_active', true)->values()->map(fn (CourseLesson $l, int $lIdx) => [
                    'id' => $l->code,
                    'moduleId' => $m->code,
                    'title' => $l->title,
                    'type' => $l->type === 'quiz' ? 'test' : $l->type,
                    'duration' => $l->duration,
                    'content' => $l->content ?? '',
                    'videoUrl' => $l->video_url,
                    'order' => $l->sort_order ?: ($lIdx + 1) * 10,
                    'completed' => in_array($l->code, $completedList, true),
                    'isCompleted' => in_array($l->code, $completedList, true),
                    'hasPrivateFile' => filled($l->digital_file_path),
                ]),
            ];
        });

        $examQuestions = $course->questions->where('is_active', true)->values()->map(function (ExamQuestion $q) {
            $correctArr = is_array($q->correct_answer) ? $q->correct_answer : [0];
            $firstCorrect = isset($correctArr[0]) ? (int) $correctArr[0] : 0;

            return [
                'id' => $q->code ?: 'q_'.$q->id,
                'question' => $q->question,
                'options' => is_array($q->options) ? $q->options : [],
                'correctAnswerIndex' => $firstCorrect,
                'correctAnswer' => $correctArr,
                'explanation' => $q->explanation ?? '',
            ];
        });

        return response()->json([
            'id' => $course->code,
            'slug' => $course->slug,
            'title' => $course->title,
            'category' => $course->category,
            'duration' => $course->duration,
            'image' => MediaOptimizer::publicUrl($course->image),
            'description' => $course->short_description ?? $course->description ?? '',
            'progress' => (int) ($enrollment?->progress ?? 0),
            'status' => strtolower((string) ($enrollment?->status ?? 'active')),
            'modules' => $modules,
            'examQuestions' => $examQuestions,
        ]);
    }

    public function updateProgress(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'courseId' => ['required', 'string', 'max:64'],
            'lessonId' => ['required', 'string', 'max:64'],
            'completed' => ['required', 'boolean'],
            'score' => ['nullable', 'integer', 'min:0', 'max:100'],
            'stoppedAt' => ['nullable', 'integer', 'min:0'],
            'watchTime' => ['nullable', 'integer', 'min:0'],
        ]);

        $course = Course::query()
            ->with('lessons')
            ->where('code', $validated['courseId'])
            ->orWhere('slug', $validated['courseId'])
            ->firstOrFail();

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['ACTIVE', 'COMPLETED'])
            ->first();

        if (! $enrollment) {
            return response()->json(['message' => 'Brak aktywnego uprawnienia do tego kursu.'], 403);
        }

        $lesson = CourseLesson::query()->where('code', $validated['lessonId'])->first();

        LessonProgress::query()->updateOrCreate(
            ['user_id' => $user->id, 'lesson_code' => $validated['lessonId']],
            [
                'course_lesson_id' => $lesson?->id,
                'completed' => (bool) $validated['completed'],
                'score' => $validated['score'] ?? null,
                'stopped_at' => $validated['stoppedAt'] ?? 0,
                'watch_time' => $validated['watchTime'] ?? 0,
            ]
        );

        $completedLessons = is_array($enrollment->completed_lessons) ? $enrollment->completed_lessons : [];
        if ($validated['completed'] && ! in_array($validated['lessonId'], $completedLessons, true)) {
            $completedLessons[] = $validated['lessonId'];
        }

        $activeLessons = $course->lessons->where('is_active', true)->values();
        $totalCount = max(1, $activeLessons->count());
        $doneCount = $activeLessons->filter(fn ($l) => in_array($l->code, $completedLessons, true))->count();
        $newProgress = min(100, (int) round(($doneCount / $totalCount) * 100));

        $nextLessonTitle = $activeLessons->first(fn ($l) => ! in_array($l->code, $completedLessons, true))?->title ?? 'Egzamin zakończony';

        $isCompleted = $newProgress >= 100;
        $enrollment->update([
            'completed_lessons' => array_values($completedLessons),
            'progress' => $newProgress,
            'next_lesson' => $nextLessonTitle,
            'status' => $isCompleted ? 'COMPLETED' : $enrollment->status,
            'completed_at' => $isCompleted && ! $enrollment->completed_at ? now() : $enrollment->completed_at,
            'certificate_number' => $isCompleted && ! $enrollment->certificate_number
                ? sprintf('MS/%s/%s/%04d', strtoupper($course->category), now()->format('Y'), $enrollment->id + 100)
                : $enrollment->certificate_number,
        ]);

        return response()->json([
            'ok' => true,
            'progress' => $enrollment->progress,
            'status' => strtolower($enrollment->status),
            'certificateNumber' => $enrollment->certificate_number,
            'completedLessons' => $doneCount,
            'completedLessonCodes' => $enrollment->completed_lessons,
        ]);
    }

    public function downloadLessonMaterial(Request $request, string $lessonCode): StreamedResponse|JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $lesson = CourseLesson::query()->where('code', $lessonCode)->firstOrFail();

        $hasAccess = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->whereIn('status', ['ACTIVE', 'COMPLETED'])
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->exists();

        if (! $hasAccess && ! in_array(strtoupper($user->role), ['ADMIN', 'MANAGER'], true)) {
            return response()->json(['message' => 'Brak uprawnień do pobrania materiału szkoleniowego.'], 403);
        }

        if (! $lesson->digital_file_path || ! Storage::disk('local')->exists($lesson->digital_file_path)) {
            return response()->json(['message' => 'Plik cyfrowy nie istnieje.'], 404);
        }

        return Storage::disk('local')->download($lesson->digital_file_path);
    }

    public function guardianDashboard(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! in_array(strtoupper($user->role), ['COMPANY_GUARDIAN', 'ADMIN', 'MANAGER'], true)) {
            return response()->json(['message' => 'Brak uprawnień Opiekuna Firmy B2B.'], 403);
        }

        $companyName = $user->company_name ?: 'ABC Transport Sp. z o.o.';
        $employeeRows = $this->buildGuardianEmployeeList($user, $companyName);

        return response()->json([
            'companyName' => $companyName,
            'guardian' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
            ],
            'employees' => $employeeRows,
        ]);
    }

    public function guardianEmployees(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! in_array(strtoupper($user->role), ['COMPANY_GUARDIAN', 'ADMIN', 'MANAGER'], true)) {
            return response()->json(['message' => 'Brak uprawnień Opiekuna Firmy B2B.'], 403);
        }

        $companyName = $user->company_name ?: 'ABC Transport Sp. z o.o.';

        return response()->json($this->buildGuardianEmployeeList($user, $companyName));
    }

    protected function buildGuardianEmployeeList(User $user, string $companyName): array
    {
        $employees = User::query()
            ->with(['enrollments.course'])
            ->where('role', 'STUDENT')
            ->when(strtoupper($user->role) === 'COMPANY_GUARDIAN', fn ($q) => $q->where('company_name', $companyName))
            ->orderBy('name')
            ->get();

        return $employees->map(function (User $emp) use ($companyName) {
            $parts = preg_split('/\s+/', trim((string) $emp->name), 2) ?: [];
            $firstName = $parts[0] ?? $emp->name;
            $lastName = $parts[1] ?? '';

            return [
                'id' => (string) $emp->id,
                'name' => $emp->name,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'email' => $emp->email,
                'phone' => $emp->phone ?? '',
                'company' => $emp->company_name ?? $companyName,
                'companyName' => $emp->company_name ?? $companyName,
                'jobTitle' => $emp->job_title ?? 'Pracownik',
                'enrollments' => $emp->enrollments->map(fn (Enrollment $enr) => [
                    'id' => (string) $enr->id,
                    'courseId' => $enr->course?->code ?? '',
                    'courseCode' => $enr->course?->code ?? '',
                    'courseTitle' => $enr->course?->title ?? 'Szkolenie',
                    'category' => $enr->course?->category ?? 'UDT',
                    'progress' => (int) $enr->progress,
                    'status' => strtolower($enr->status),
                    'certificateNumber' => $enr->certificate_number,
                    'completedAt' => $enr->completed_at?->format('Y-m-d'),
                    'expiresAt' => $enr->expires_at?->format('Y-m-d'),
                ])->values()->all(),
            ];
        })->values()->all();
    }

    public function storeGuardianEmployee(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! in_array(strtoupper($user->role), ['COMPANY_GUARDIAN', 'ADMIN', 'MANAGER'], true)) {
            return response()->json(['message' => 'Brak uprawnień Opiekuna Firmy B2B.'], 403);
        }

        $fullName = trim((string) $request->input('name', ''));
        if ($fullName === '') {
            $first = trim((string) $request->input('firstName', ''));
            $last = trim((string) $request->input('lastName', ''));
            $fullName = trim($first.' '.$last);
        }

        $courseCode = trim((string) ($request->input('courseCode') ?? $request->input('courseId') ?? ''));

        $request->merge([
            'name' => $fullName,
            'courseCode' => $courseCode,
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'jobTitle' => ['nullable', 'string', 'max:255'],
            'courseCode' => ['required', 'string', 'max:64'],
            'password' => ['nullable', 'string', 'max:255'],
        ]);

        $companyName = $user->company_name ?: 'ABC Transport Sp. z o.o.';
        $email = strtolower(trim($validated['email']));
        $plainPass = filled($validated['password'] ?? null) ? (string) $validated['password'] : 'MS#Kursant2026!';

        $employee = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => trim($validated['name']),
                'phone' => $validated['phone'] ?? null,
                'role' => 'STUDENT',
                'company_name' => $companyName,
                'job_title' => $validated['jobTitle'] ?? 'Operator',
                'is_active' => true,
                'password' => Hash::make($plainPass),
            ]
        );

        $course = Course::query()
            ->where('code', $validated['courseCode'])
            ->orWhere('slug', $validated['courseCode'])
            ->firstOrFail();

        $enrollment = Enrollment::query()->firstOrCreate(
            ['user_id' => $employee->id, 'course_id' => $course->id],
            [
                'status' => 'ACTIVE',
                'progress' => 0,
                'expires_at' => now()->addMonths(6),
            ]
        );

        return response()->json([
            'ok' => true,
            'employeeId' => $employee->id,
            'enrollmentId' => $enrollment->id,
        ], 201);
    }

    public function tickets(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $tickets = Ticket::query()
            ->with('messages')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn (Ticket $t) => $this->formatTicket($t, $user));

        return response()->json($tickets);
    }

    public function storeTicket(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $rawContent = trim((string) ($request->input('content') ?? $request->input('message') ?? ''));
        $rawCategory = strtoupper(trim((string) $request->input('category', 'GENERAL')));
        $normalizedCategory = match ($rawCategory) {
            'TECH', 'TECHNICZNE' => 'TECH',
            'BILLING', 'ROZLICZENIA' => 'BILLING',
            default => 'GENERAL',
        };

        $request->merge([
            'content' => $rawContent,
            'category' => $normalizedCategory,
        ]);

        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'in:TECH,GENERAL,BILLING'],
            'content' => ['required', 'string', 'max:3000'],
        ]);

        $ticket = Ticket::query()->create([
            'user_id' => $user->id,
            'subject' => trim($validated['subject']),
            'category' => $validated['category'] ?? 'GENERAL',
            'status' => 'OPEN',
        ]);

        TicketMessage::query()->create([
            'ticket_id' => $ticket->id,
            'sender_id' => $user->id,
            'sender_name' => $user->name,
            'content' => trim($validated['content']),
            'is_internal' => false,
        ]);

        $ticket->load('messages');

        return response()->json($this->formatTicket($ticket, $user), 201);
    }

    public function storeTicketMessage(Request $request, string $ticketId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $rawContent = trim((string) ($request->input('message') ?? $request->input('content') ?? ''));
        $request->merge(['message' => $rawContent]);

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:3000'],
        ]);

        $ticket = Ticket::query()
            ->where('user_id', $user->id)
            ->where(fn ($q) => $q->where('ticket_number', $ticketId)->orWhere('id', $ticketId))
            ->firstOrFail();

        $msg = TicketMessage::query()->create([
            'ticket_id' => $ticket->id,
            'sender_id' => $user->id,
            'sender_name' => $user->name,
            'content' => trim($validated['message']),
            'is_internal' => false,
        ]);

        $ticket->touch();

        return response()->json([
            'ok' => true,
            'id' => (string) $msg->id,
            'senderId' => $user->legacy_id ?: (string) $user->id,
            'senderName' => $msg->sender_name ?? $user->name,
            'senderRole' => $user->role,
            'message' => $msg->content,
            'content' => $msg->content,
            'createdAt' => $msg->created_at?->toIso8601String() ?? now()->toIso8601String(),
        ], 201);
    }

    protected function formatTicket(Ticket $t, User $user): array
    {
        $userFrontId = $user->legacy_id ?: (string) $user->id;

        return [
            'id' => $t->ticket_number,
            'userId' => $userFrontId,
            'userName' => $user->name,
            'subject' => $t->subject,
            'category' => $t->category,
            'status' => strtolower($t->status),
            'priority' => 'normal',
            'createdAt' => $t->created_at?->toIso8601String() ?? now()->toIso8601String(),
            'updatedAt' => $t->updated_at?->toIso8601String() ?? now()->toIso8601String(),
            'messages' => $t->messages->where('is_internal', false)->values()->map(fn (TicketMessage $m) => [
                'id' => (string) $m->id,
                'senderId' => $m->sender_id === $user->id ? $userFrontId : (string) ($m->sender_id ?? 'staff'),
                'senderName' => $m->sender_name ?? 'Użytkownik',
                'senderRole' => $m->sender_id === $user->id ? $user->role : 'MANAGER',
                'message' => $m->content,
                'content' => $m->content,
                'createdAt' => $m->created_at?->toIso8601String() ?? now()->toIso8601String(),
            ])->all(),
        ];
    }
}
