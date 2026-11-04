<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Inquiry;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\User;
use Illuminate\Console\Command;
use PDO;

class ImportLegacySqliteCommand extends Command
{
    protected $signature = 'multiserwis:import-legacy {path=/home/srv127364/domains/multiserwis.edu.pl/data/multiserwis.sqlite}';

    protected $description = 'Importuje użytkowników, zapytania, zgłoszenia i zamówienia z dotychczasowej bazy SQLite do MySQL';

    public function handle(): int
    {
        $path = (string) $this->argument('path');
        if (! is_file($path)) {
            $this->info("Plik bazy legacy nie istnieje pod ścieżką: {$path} — pomijam import.");

            return self::SUCCESS;
        }

        try {
            $pdo = new PDO('sqlite:'.$path, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (\Throwable $e) {
            $this->warn('Nie udało się otworzyć bazy SQLite: '.$e->getMessage());

            return self::SUCCESS;
        }

        // 1. Użytkownicy
        foreach ($pdo->query('SELECT * FROM users')->fetchAll() as $u) {
            User::query()->updateOrCreate(
                ['email' => strtolower(trim($u['email']))],
                [
                    'legacy_id' => $u['id'],
                    'name' => $u['name'] ?: $u['email'],
                    'phone' => $u['phone'] ?? null,
                    'role' => strtoupper($u['role'] ?? 'STUDENT'),
                    'company_name' => $u['company'] ?? null,
                    'password' => $u['passwordHash'],
                ]
            );
        }

        // 2. Zapisy (Enrollments)
        foreach ($pdo->query('SELECT * FROM enrollments')->fetchAll() as $enr) {
            $user = User::query()->where('legacy_id', $enr['userId'])->first();
            $course = Course::query()->where('code', $enr['courseId'])->first();
            if ($user && $course) {
                Enrollment::query()->firstOrCreate(
                    ['user_id' => $user->id, 'course_id' => $course->id],
                    [
                        'legacy_id' => $enr['id'],
                        'status' => strtoupper($enr['status'] ?? 'ACTIVE'),
                        'progress' => (int) ($enr['progress'] ?? 0),
                    ]
                );
            }
        }

        // 3. Zapytania ofertowe (Inquiries)
        foreach ($pdo->query('SELECT * FROM inquiries')->fetchAll() as $inq) {
            Inquiry::query()->updateOrCreate(
                ['legacy_id' => $inq['id']],
                [
                    'name' => $inq['name'] ?? 'Klient',
                    'email' => $inq['email'] ?? 'brak@multiserwis.edu.pl',
                    'phone' => $inq['phone'] ?? null,
                    'subject' => $inq['subject'] ?? 'Zapytanie ze strony',
                    'message' => $inq['message'] ?? '',
                    'status' => strtoupper($inq['status'] ?? 'NEW'),
                ]
            );
        }

        // 4. Zamówienia (Orders)
        foreach ($pdo->query('SELECT * FROM orders')->fetchAll() as $ord) {
            $user = User::query()->where('legacy_id', $ord['userId'])->first();
            $course = Course::query()->where('code', $ord['courseId'])->first();
            Order::query()->updateOrCreate(
                ['order_number' => $ord['id']],
                [
                    'user_id' => $user?->id,
                    'course_id' => $course?->id,
                    'course_code' => $course?->code ?? $ord['courseId'],
                    'course_name' => $course?->title ?? 'Szkolenie MultiSerwis',
                    'customer_name' => $user?->name ?? 'Klient',
                    'customer_email' => $user?->email ?? 'biuro@multiserwis.edu.pl',
                    'customer_phone' => $user?->phone,
                    'unit_price_gross' => (float) ($ord['amount'] ?? 0),
                    'amount_gross' => (float) ($ord['amount'] ?? 0),
                    'currency' => $ord['currency'] ?? 'PLN',
                    'provider' => $ord['provider'] ?? 'online',
                    'status' => strtoupper($ord['status'] ?? 'PAID'),
                ]
            );
        }

        // 5. Zgłoszenia (Tickets)
        foreach ($pdo->query('SELECT * FROM tickets')->fetchAll() as $tck) {
            $user = User::query()->where('legacy_id', $tck['userId'])->first();
            $ticket = Ticket::query()->updateOrCreate(
                ['ticket_number' => $tck['id']],
                [
                    'user_id' => $user?->id,
                    'subject' => $tck['subject'] ?? 'Zgłoszenie',
                    'category' => strtoupper($tck['category'] ?? 'GENERAL'),
                    'status' => strtoupper($tck['status'] ?? 'OPEN'),
                ]
            );

            $stmtMsg = $pdo->prepare('SELECT * FROM ticket_messages WHERE ticketId = ?');
            $stmtMsg->execute([$tck['id']]);
            foreach ($stmtMsg->fetchAll() as $msg) {
                $sender = User::query()->where('legacy_id', $msg['senderId'])->first();
                TicketMessage::query()->firstOrCreate(
                    ['ticket_id' => $ticket->id, 'content' => $msg['content']],
                    [
                        'sender_id' => $sender?->id,
                        'sender_name' => $sender?->name ?? 'Użytkownik',
                        'is_internal' => (bool) ($msg['isInternal'] ?? false),
                    ]
                );
            }
        }

        $this->info('Import danych z bazy legacy SQLite zakończony pomyślnie.');

        return self::SUCCESS;
    }
}
