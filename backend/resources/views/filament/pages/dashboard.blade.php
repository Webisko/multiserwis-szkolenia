<x-filament-panels::page>
    <div style="display:flex;flex-direction:column;gap:24px;">
        {{-- Karty KPI --}}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
            <a href="{{ $urls['listCourses'] }}" style="text-decoration:none;background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Aktywne szkolenia</div>
                <div style="font-size:30px;font-weight:900;color:#0f172a;margin-top:6px;">{{ $activeCoursesCount }}</div>
                <div style="font-size:12px;color:#0d9488;margin-top:4px;font-weight:600;">W tym {{ $onlineCoursesCount }} z modułem e-learningowym</div>
            </a>

            <a href="{{ $urls['listEnrollments'] }}" style="text-decoration:none;background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Kursanci i firmy B2B</div>
                <div style="font-size:30px;font-weight:900;color:#0f172a;margin-top:6px;">{{ $studentsCount }}</div>
                <div style="font-size:12px;color:#2563eb;margin-top:4px;font-weight:600;">Aktywne kursy: {{ $activeEnrollmentsCount }} • Opiekunowie B2B: {{ $guardiansCount }}</div>
            </a>

            <a href="{{ $urls['listInquiries'] }}" style="text-decoration:none;background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Zapytania i zapisy ze strony</div>
                <div style="font-size:30px;font-weight:900;color:#ea580c;margin-top:6px;">{{ $newInquiriesCount }} <span style="font-size:14px;font-weight:600;color:#64748b;">nowych ({{ $totalInquiriesCount }} łącznie)</span></div>
                <div style="font-size:12px;color:#ea580c;margin-top:4px;font-weight:600;">Kliknij, aby obsłużyć zgłoszenia</div>
            </a>

            <a href="{{ $urls['listMachines'] }}" style="text-decoration:none;background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Flota maszyn i zamówienia</div>
                <div style="font-size:30px;font-weight:900;color:#0f172a;margin-top:6px;">{{ $machinesCount }} <span style="font-size:14px;font-weight:600;color:#64748b;">maszyny</span></div>
                <div style="font-size:12px;color:#475569;margin-top:4px;font-weight:600;">Zamówienia w systemie: {{ $ordersCount }}</div>
            </a>
        </div>

        {{-- Szybkie akcje --}}
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <a href="{{ $urls['createCourse'] }}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:#ea580c;color:#ffffff;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;">
                + Dodaj nowe szkolenie
            </a>
            <a href="{{ $urls['listEnrollments'] }}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:#0f172a;color:#ffffff;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;">
                Zarządzaj zapisami kursantów
            </a>
            @if(strtoupper((string) auth()->user()?->role) === 'ADMIN')
                <a href="{{ $urls['editSettings'] }}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:#f1f5f9;color:#0f172a;border:1px solid #cbd5e1;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;">
                    Ustawienia ośrodka i SEO
                </a>
            @endif
        </div>

        {{-- Dwie kolumny: Ostatnie zgłoszenia + Flagowe szkolenia --}}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px;">
            <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3 style="font-size:15px;font-weight:800;margin:0;">Ostatnie zgłoszenia z formularzy</h3>
                    <a href="{{ $urls['listInquiries'] }}" style="font-size:12px;font-weight:700;color:#ea580c;text-decoration:none;">Wszystkie &rarr;</a>
                </div>
                @if($latestInquiries->isEmpty())
                    <p style="font-size:13px;color:#64748b;margin:0;">Brak nowych zapytań z formularza kontaktowego i zapisów.</p>
                @else
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        @foreach($latestInquiries as $inq)
                            <div style="padding:12px;border-radius:10px;background:rgba(248,250,252,0.8);border:1px solid rgba(226,232,240,0.9);">
                                <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;">
                                    <span>{{ $inq->name }}</span>
                                    <span style="font-size:11px;color:#64748b;">{{ $inq->created_at?->format('d.m.Y H:i') }}</span>
                                </div>
                                <div style="font-size:12px;color:#475569;margin-top:3px;">{{ $inq->phone }} &bull; {{ $inq->email }}</div>
                                <div style="font-size:12px;color:#0f172a;margin-top:4px;">{{ \Illuminate\Support\Str::limit($inq->message, 110) }}</div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

            <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3 style="font-size:15px;font-weight:800;margin:0;">Najpopularniejsze kursy w katalogu</h3>
                    <a href="{{ $urls['listCourses'] }}" style="font-size:12px;font-weight:700;color:#ea580c;text-decoration:none;">Pełny katalog &rarr;</a>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    @foreach($popularCourses as $course)
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:10px;background:rgba(248,250,252,0.8);border:1px solid rgba(226,232,240,0.9);">
                            <div>
                                <div style="font-size:13px;font-weight:700;">{{ $course->title }}</div>
                                <div style="font-size:11px;color:#64748b;">Kategoria: {{ $course->category }} &bull; Czas: {{ $course->duration }}</div>
                            </div>
                            <span style="font-size:13px;font-weight:800;color:#ea580c;white-space:nowrap;">{{ $course->price_label }}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</x-filament-panels::page>
