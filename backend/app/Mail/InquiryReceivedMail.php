<?php

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Inquiry $inquiry,
    ) {}

    public function envelope(): Envelope
    {
        $cleanName = str_replace(["\r", "\n"], ' ', (string) $this->inquiry->name);
        $cleanEmail = str_replace(["\r", "\n"], '', (string) $this->inquiry->email);

        $replyTo = filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)
            ? [new Address($cleanEmail, $cleanName)]
            : [];

        return new Envelope(
            subject: 'Nowe zgłoszenie MultiSerwis Szkolenia: '.$cleanName,
            replyTo: $replyTo,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    protected function buildHtml(): string
    {
        $name = e($this->inquiry->name);
        $email = e($this->inquiry->email);
        $phone = e($this->inquiry->phone ?? 'Brak');
        $company = e($this->inquiry->company ?? 'Osoba prywatna');
        $type = e($this->inquiry->inquiry_type);
        $subject = e($this->inquiry->subject ?? 'Zgłoszenie ze strony');
        $message = nl2br(e($this->inquiry->message ?? ''));

        return <<<HTML
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#0f172a;color:#ffffff;padding:20px 24px;border-bottom:4px solid #ea580c;">
            <h2 style="margin:0;font-size:18px;">Ośrodek Szkolenia Kadr MultiSerwis Kutno</h2>
            <p style="margin:4px 0 0;font-size:12px;color:#cbd5e1;">Nowe zgłoszenie z formularza na multiserwis.edu.pl</p>
        </div>
        <div style="padding:24px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:8px 0;color:#64748b;width:160px;"><strong>Zgłaszający:</strong></td><td style="padding:8px 0;font-weight:bold;">{$name}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;"><strong>Typ zgłoszenia:</strong></td><td style="padding:8px 0;">{$type} ({$company})</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;"><strong>Telefon:</strong></td><td style="padding:8px 0;"><a href="tel:{$phone}" style="color:#ea580c;font-weight:bold;text-decoration:none;">{$phone}</a></td></tr>
                <tr><td style="padding:8px 0;color:#64748b;"><strong>Adres e-mail:</strong></td><td style="padding:8px 0;"><a href="mailto:{$email}" style="color:#0284c7;text-decoration:none;">{$email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#64748b;"><strong>Temat:</strong></td><td style="padding:8px 0;">{$subject}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#f1f5f9;border-radius:8px;font-size:14px;line-height:1.6;">
                <strong>Treść zgłoszenia:</strong><br>{$message}
            </div>
            <div style="margin-top:20px;display:flex;gap:12px;">
                <a href="tel:{$phone}" style="display:inline-block;padding:10px 18px;background:#ea580c;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:13px;">Zadzwoń do klienta</a>
                <a href="mailto:{$email}" style="display:inline-block;padding:10px 18px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:13px;margin-left:8px;">Odpowiedz e-mailem</a>
            </div>
        </div>
    </div>
</body>
</html>
HTML;
    }
}
