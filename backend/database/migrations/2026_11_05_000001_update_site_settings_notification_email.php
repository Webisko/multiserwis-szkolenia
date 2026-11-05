<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('site_settings')
            ->where('email_notifications', 'multiserwis.kutno@gmail.com')
            ->update(['email_notifications' => 'szkolenia@multiserwis.tech']);
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->where('email_notifications', 'szkolenia@multiserwis.tech')
            ->update(['email_notifications' => 'multiserwis.kutno@gmail.com']);
    }
};
