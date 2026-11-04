<div class="ms-topbar-pill-wrap" style="display:flex;align-items:center;gap:8px;" x-data="{
    isDark: document.documentElement.classList.contains('dark'),
    init() {
        this.isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
        window.addEventListener('theme-changed', (e) => {
            this.isDark = document.documentElement.classList.contains('dark');
        });
    },
    toggleTheme() {
        const next = this.isDark ? 'light' : 'dark';
        this.isDark = !this.isDark;
        localStorage.setItem('theme', next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        if (window.Alpine && Alpine.store('theme')) {
            Alpine.store('theme', next);
        }
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: next }));
    }
}">
    <a
        href="https://szkolenia.multiserwis.edu.pl"
        target="_blank"
        rel="noopener noreferrer"
        class="ms-theme-toggle-btn"
        title="Otwórz platformę LMS Kursanta i Opiekuna B2B"
        style="text-decoration:none;"
    >
        <span>Strefa LMS</span>
    </a>
    <button
        type="button"
        @click="toggleTheme()"
        class="ms-theme-toggle-btn"
        :title="isDark ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'"
    >
        <svg x-show="isDark" x-cloak viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:#fbbf24;">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg x-show="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:#475569;">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <span x-text="isDark ? 'Tryb jasny' : 'Tryb ciemny'">Tryb ciemny</span>
    </button>
</div>
