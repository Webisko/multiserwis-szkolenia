<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'legacy_id',
        'name',
        'email',
        'phone',
        'company',
        'nip',
        'subject',
        'course_name',
        'inquiry_type',
        'message',
        'status',
        'admin_notes',
        'is_spam',
    ];

    protected function casts(): array
    {
        return [
            'is_spam' => 'boolean',
        ];
    }
}
