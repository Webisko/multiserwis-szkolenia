<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'legacy_id',
        'name',
        'email',
        'phone',
        'role',
        'company_name',
        'company_nip',
        'job_title',
        'is_active',
        'password',
        'metadata',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (User $user): void {
            $user->email = strtolower(trim($user->email));
            $user->role = strtoupper(trim($user->role ?: 'STUDENT'));
            static::onlyTrashed()->where('email', $user->email)->get()->each(function (User $trashed): void {
                $trashed->updateQuietly(['email' => $trashed->email.'__trashed_'.$trashed->id]);
            });
        });

        static::saving(function (User $user): void {
            $originalMeta = is_array($user->getOriginal('metadata')) ? $user->getOriginal('metadata') : [];
            $newMeta = is_array($user->metadata) ? $user->metadata : [];
            $user->metadata = array_replace($originalMeta, $newMeta);
        });
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_active && in_array(strtoupper((string) $this->role), ['ADMIN', 'MANAGER'], true);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}
