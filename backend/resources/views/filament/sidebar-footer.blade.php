<div class="ms-sidebar-footer">
    <a href="https://multiserwis.edu.pl" target="_blank" rel="noopener noreferrer" class="ms-portal-btn" title="Otwórz portal ofertowy multiserwis.edu.pl w nowej karcie">
        <span class="ms-portal-btn-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:16px;height:16px;color:#f59e0b;">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>multiserwis.edu.pl</span>
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;opacity:0.65;">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
    </a>

    @php
        $user = filament()->auth()->user();
        $displayName = filled($user?->name) ? $user->name : ($user?->email ?? 'admin@webisko.pl');
        $subtitle = filled($user?->job_title)
            ? $user->job_title
            : match (strtoupper((string) $user?->role)) {
                'ADMIN' => 'Administrator • Szkolenia',
                'MANAGER' => 'Menedżer • Szkolenia',
                default => 'Zespół • Szkolenia',
            };
        $initial = mb_strtoupper(mb_substr($displayName, 0, 1));
        $isAdmin = strtoupper((string) $user?->role) === 'ADMIN';
        $profileUrl = ($user && $isAdmin) ? \App\Filament\Resources\Users\UserResource::getUrl('edit', ['record' => $user]) : \App\Filament\Pages\Dashboard::getUrl();
    @endphp

    <div class="ms-user-row">
        <a href="{{ $profileUrl }}" class="ms-user-profile-link" title="{{ $isAdmin ? 'Mój profil — kliknij, aby edytować swoje dane' : 'Kokpit zarządzania' }}">
            <div class="ms-user-avatar">{{ $initial }}</div>
            <div class="ms-user-info">
                <div class="ms-user-email">{{ $displayName }}</div>
                <div class="ms-user-role">{{ $subtitle }}</div>
            </div>
        </a>
        <form action="{{ filament()->getLogoutUrl() }}" method="post" style="margin:0;">
            @csrf
            <button type="submit" title="Wyloguj się" class="ms-logout-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px;">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
            </button>
        </form>
    </div>
</div>
