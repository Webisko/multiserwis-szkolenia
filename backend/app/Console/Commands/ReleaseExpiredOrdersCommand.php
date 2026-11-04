<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class ReleaseExpiredOrdersCommand extends Command
{
    protected $signature = 'orders:release-expired';

    protected $description = 'Anuluje nieopłacone zamówienia oczekujące dłużej niż 48 godzin';

    public function handle(): int
    {
        $count = Order::query()
            ->where('status', 'PENDING_PAYMENT')
            ->where('created_at', '<', now()->subHours(48))
            ->update(['status' => 'CANCELLED']);

        $this->info("Anulowano przeterminowane zamówienia: {$count}");

        return self::SUCCESS;
    }
}
