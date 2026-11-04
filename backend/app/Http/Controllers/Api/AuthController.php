<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::query()->where('email', $email)->where('is_active', true)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Nieprawidłowy adres e-mail lub hasło.'], 401);
        }

        $token = $user->createToken('lms-session')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUser($user),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $requestedRole = strtoupper(trim((string) $request->input('role', 'STUDENT')));
        if (in_array($requestedRole, ['ADMIN', 'MANAGER'], true)) {
            return response()->json([
                'message' => 'Rejestracja kont administracyjnych i menedżerskich jest zablokowana.',
            ], 403);
        }

        $role = $requestedRole === 'COMPANY_GUARDIAN' ? 'COMPANY_GUARDIAN' : 'STUDENT';

        $fullName = trim((string) $request->input('name', ''));
        if ($fullName === '') {
            $first = trim((string) $request->input('firstName', ''));
            $last = trim((string) $request->input('lastName', ''));
            $fullName = trim($first.' '.$last);
        }

        $companyName = trim((string) ($request->input('company') ?? $request->input('companyName') ?? ''));
        $nip = trim((string) ($request->input('nip') ?? $request->input('companyNip') ?? ''));

        $request->merge([
            'name' => $fullName,
            'company' => $companyName !== '' ? $companyName : null,
            'nip' => $nip !== '' ? $nip : null,
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'company' => $role === 'COMPANY_GUARDIAN' ? ['required', 'string', 'max:255'] : ['nullable', 'string', 'max:255'],
            'nip' => ['nullable', 'string', 'max:32'],
        ]);

        $user = User::query()->create([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? null,
            'role' => $role,
            'company_name' => $validated['company'] ?? null,
            'company_nip' => $validated['nip'] ?? null,
            'is_active' => true,
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('lms-session')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUser($user),
        ], 201);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'authenticated' => true,
            'user' => $this->formatUser($user),
        ]);
    }

    public function session(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'authenticated' => true,
            'user' => $this->formatUser($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['ok' => true]);
    }

    protected function formatUser(User $user): array
    {
        $parts = preg_split('/\s+/', trim((string) $user->name), 2) ?: [];
        $firstName = $parts[0] ?? $user->name;
        $lastName = $parts[1] ?? '';

        return [
            'id' => $user->legacy_id ?: (string) $user->id,
            'dbId' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'phone' => $user->phone ?? '',
            'role' => strtoupper($user->role),
            'company' => $user->company_name ?? '',
            'companyName' => $user->company_name ?? '',
            'nip' => $user->company_nip ?? '',
            'jobTitle' => $user->job_title ?? '',
            'panelUrl' => in_array(strtoupper($user->role), ['ADMIN', 'MANAGER'], true)
                ? 'https://panel.multiserwis.edu.pl/admin/kokpit'
                : null,
        ];
    }
}
