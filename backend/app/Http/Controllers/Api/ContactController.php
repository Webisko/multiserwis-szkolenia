<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\InquiryReceivedMail;
use App\Models\Inquiry;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Anti-spam honeypot check
        if ($request->filled('website_url') || $request->filled('fax_number')) {
            return response()->json(['ok' => true]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email:rfc', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'company' => ['nullable', 'string', 'max:255'],
            'nip' => ['nullable', 'string', 'max:32'],
            'subject' => ['nullable', 'string', 'max:255'],
            'course' => ['nullable', 'string', 'max:255'],
            'courseTitle' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:64'],
            'message' => ['nullable', 'string', 'max:3000'],
        ]);

        $cleanName = str_replace(["\r", "\n"], ' ', trim($validated['name']));
        $cleanEmail = str_replace(["\r", "\n"], '', trim((string) ($validated['email'] ?? 'biuro@multiserwis.edu.pl')));
        $cleanPhone = str_replace(["\r", "\n"], ' ', trim((string) ($validated['phone'] ?? '')));
        $cleanSubject = str_replace(["\r", "\n"], ' ', trim((string) ($validated['subject'] ?? 'Zapytanie ze strony multiserwis.edu.pl')));
        $courseName = str_replace(["\r", "\n"], ' ', trim((string) ($validated['course'] ?? $validated['courseTitle'] ?? '')));

        $type = 'KONTAKT';
        $rawMsg = (string) ($validated['message'] ?? '');
        if (($validated['role'] ?? '') === 'B2B' || str_contains($rawMsg, 'Firma (B2B)')) {
            $type = 'B2B';
        } elseif ($courseName !== '' || str_contains($rawMsg, 'ZAPIS NA SZKOLENIE')) {
            $type = 'INDYWIDUALNY';
        } elseif (str_contains(strtolower($cleanSubject), 'wynajem')) {
            $type = 'WYNAJEM';
        } elseif (str_contains(strtolower($cleanSubject), 'serwis')) {
            $type = 'SERWIS';
        }

        $inquiry = Inquiry::query()->create([
            'name' => $cleanName,
            'email' => $cleanEmail ?: 'biuro@multiserwis.edu.pl',
            'phone' => $cleanPhone ?: null,
            'company' => $validated['company'] ?? null,
            'nip' => $validated['nip'] ?? null,
            'subject' => $cleanSubject,
            'course_name' => $courseName !== '' ? $courseName : null,
            'inquiry_type' => $type,
            'message' => $rawMsg,
            'status' => 'NEW',
            'is_spam' => false,
        ]);

        $sent = false;
        try {
            $settings = SiteSetting::current();
            $notificationTarget = $settings->email_notifications ?: config('services.multiserwis.mail_notification_to', 'szkolenia@multiserwis.tech');

            // Zgłoszenia i zapytania szkoleniowe trafiają bezpośrednio na dedykowaną skrzynkę szkoleniową
            if ($type === 'INDYWIDUALNY' || $type === 'B2B' || !empty($courseName)) {
                $recipients = [$notificationTarget];
            } else {
                $recipients = array_unique(array_filter([$notificationTarget, $settings->email_office]));
            }

            foreach ($recipients as $to) {
                Mail::to($to)->send(new InquiryReceivedMail($inquiry));
            }
            $sent = true;
        } catch (\Throwable $e) {
            Log::error('Błąd wysyłki powiadomienia SMTP dla zapytania #'.$inquiry->id.': '.$e->getMessage());
            $sent = false;
        }

        return response()->json([
            'ok' => true,
            'id' => $inquiry->id,
            'sent' => $sent,
        ], 201);
    }
}
