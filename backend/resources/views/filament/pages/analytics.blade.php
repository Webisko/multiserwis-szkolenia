<x-filament-panels::page>
    <div style="display:flex;flex-direction:column;gap:24px;">
        {{-- Górne karty KPI --}}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
            <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Odwiedzający dzisiaj</div>
                <div style="font-size:32px;font-weight:900;color:#0f172a;margin-top:6px;">{{ $metrics['visitsToday'] }}</div>
                <div style="font-size:12px;color:#0d9488;margin-top:4px;font-weight:600;">W ostatnich 7 dniach: {{ $metrics['visitsWeek'] }} wizyt</div>
            </div>

            <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Wyświetlenia stron (7 dni)</div>
                <div style="font-size:32px;font-weight:900;color:#2563eb;margin-top:6px;">{{ $metrics['pageviewsWeek'] }}</div>
                <div style="font-size:12px;color:#64748b;margin-top:4px;font-weight:600;">Odsłony łącznie: {{ $metrics['pageviewsTotal'] }}</div>
            </div>

            <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Nowe zapytania z www (7 dni)</div>
                <div style="font-size:32px;font-weight:900;color:#ea580c;margin-top:6px;">{{ $metrics['inquiriesWeek'] }}</div>
                <div style="font-size:12px;color:#ea580c;margin-top:4px;font-weight:600;">Zapisy na kursy i formularze kontaktowe</div>
            </div>

            <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Szacowana konwersja</div>
                <div style="font-size:32px;font-weight:900;color:#10b981;margin-top:6px;">{{ $metrics['conversionRate'] }}%</div>
                <div style="font-size:12px;color:#059669;margin-top:4px;font-weight:600;">Stosunek zapytań do unikalnych odwiedzin</div>
            </div>
        </div>

        {{-- Wykres dynamiki odwiedzin z ostatnich 14 dni --}}
        <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:24px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
                <div>
                    <h3 style="font-size:16px;font-weight:800;color:#0f172a;margin:0;">Dynamika odwiedzin w ostatnich 14 dniach</h3>
                    <p style="font-size:13px;color:#64748b;margin:4px 0 0 0;">Unikalne sesje odwiedzających rejestrowane w standardzie Cookieless</p>
                </div>
                <div style="display:flex;align-items:center;gap:16px;font-size:12px;font-weight:600;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="display:inline-block;width:12px;height:12px;background:#ea580c;border-radius:3px;"></span>
                        <span>Unikalne wizyty</span>
                    </div>
                </div>
            </div>

            @if(empty($dailyTrend))
                <div style="padding:40px;text-align:center;color:#64748b;font-size:13px;">
                    Trwa zbieranie pierwszych statystyk ruchu. Wykres zaktualizuje się automatycznie po odnotowaniu wizyt.
                </div>
            @else
                <div style="display:flex;align-items:flex-end;gap:10px;height:200px;padding:10px 0;border-bottom:1px solid #e2e8f0;">
                    @foreach($dailyTrend as $day)
                        <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:6px;">
                            <span style="font-size:11px;font-weight:700;color:#475569;">{{ $day['visits'] }}</span>
                            <div style="width:100%;max-width:28px;background:linear-gradient(180deg,#ea580c 0%,#c2410c 100%);border-radius:4px 4px 0 0;height:{{ $day['heightPercent'] }}%;min-height:4px;transition:height 0.3s ease;" title="{{ $day['date'] }} ({{ $day['dayName'] }}): {{ $day['visits'] }} wizyt, {{ $day['pageviews'] }} odsłon"></div>
                        </div>
                    @endforeach
                </div>
                <div style="display:flex;gap:10px;padding-top:8px;">
                    @foreach($dailyTrend as $day)
                        <div style="flex:1;text-align:center;">
                            <div style="font-size:11px;font-weight:700;color:#0f172a;">{{ $day['date'] }}</div>
                            <div style="font-size:10px;color:#94a3b8;">{{ $day['dayName'] }}</div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Dwie kolumny: Najpopularniejsze szkolenia + Źródła ruchu i urządzenia --}}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:20px;">
            {{-- Kolumna 1: Najpopularniejsze kursy --}}
            <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:24px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="font-size:15px;font-weight:800;color:#0f172a;margin:0;">Najczęściej przeglądane szkolenia</h3>
                    <span style="font-size:12px;color:#64748b;">Według odsłon</span>
                </div>

                @if(empty($topCourses))
                    <p style="font-size:13px;color:#64748b;margin:0;">Brak zarejestrowanych odsłon podstron szkoleń w wybranym okresie.</p>
                @else
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        @foreach($topCourses as $idx => $course)
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:10px;background:rgba(248,250,252,0.85);border:1px solid rgba(226,232,240,0.9);">
                                <div style="display:flex;align-items:center;gap:12px;overflow:hidden;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:#0f172a;color:#ffffff;font-size:11px;font-weight:800;shrink-0;">
                                        {{ $idx + 1 }}
                                    </span>
                                    <div style="overflow:hidden;text-overflow:ellipsis;">
                                        <div style="font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                            {{ $course['title'] }}
                                        </div>
                                        <div style="font-size:11px;color:#64748b;">
                                            {{ $course['category'] }} &bull; <span style="font-family:monospace;">{{ $course['url'] }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style="display:flex;align-items:center;gap:12px;shrink-0;">
                                    <span style="font-size:14px;font-weight:800;color:#ea580c;">{{ $course['views'] }} odsłon</span>
                                    @if($course['editUrl'])
                                        <a href="{{ $course['editUrl'] }}" style="font-size:12px;font-weight:700;color:#2563eb;text-decoration:none;" title="Edytuj to szkolenie w panelu CMS">Edytuj &rarr;</a>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

            {{-- Kolumna 2: Źródła ruchu i urządzenia --}}
            <div style="display:flex;flex-direction:column;gap:20px;">
                {{-- Źródła wejść --}}
                <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:24px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                    <h3 style="font-size:15px;font-weight:800;color:#0f172a;margin:0 0 16px 0;">Główne źródła wizyt</h3>
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        @foreach($sources as $source)
                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-bottom:4px;">
                                    <span>{{ $source['label'] }}</span>
                                    <span style="color:#64748b;">{{ $source['count'] }} ({{ $source['percentage'] }}%)</span>
                                </div>
                                <div style="width:100%;height:6px;background:#f1f5f9;border-radius:999px;overflow:hidden;">
                                    <div style="height:100%;background:#0d9488;border-radius:999px;width:{{ max(4, $source['percentage']) }}%;"></div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- Podział na urządzenia --}}
                <div style="background:var(--ms-surface,#ffffff);border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.04);">
                    <h3 style="font-size:14px;font-weight:800;color:#0f172a;margin:0 0 12px 0;">Urządzenia odwiedzających</h3>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">
                        <div style="padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                            <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Komputery</div>
                            <div style="font-size:22px;font-weight:900;color:#0f172a;margin-top:4px;">{{ $devices['desktop'] }}%</div>
                        </div>
                        <div style="padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                            <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Smartfony</div>
                            <div style="font-size:22px;font-weight:900;color:#0f172a;margin-top:4px;">{{ $devices['mobile'] }}%</div>
                        </div>
                        <div style="padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                            <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Tablety</div>
                            <div style="font-size:22px;font-weight:900;color:#0f172a;margin-top:4px;">{{ $devices['tablet'] }}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Baner przejścia do zaawansowanego panelu Umami --}}
        <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 24px;border-radius:14px;background:linear-gradient(135deg,#003d4d 0%,#0f172a 100%);color:#ffffff;flex-wrap:wrap;gap:16px;">
            <div>
                <div style="font-size:14px;font-weight:800;">Zaawansowane raporty telemetryczne (Umami v2)</div>
                <div style="font-size:12px;color:#94a3b8;margin-top:3px;">
                    Dostęp do analizy ścieżek konwersji, geolokalizacji miast oraz raportów w czasie rzeczywistym.
                </div>
            </div>
            <a
                href="{{ $umamiUrl }}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:#ea580c;color:#ffffff;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;transition:background 0.2s;"
            >
                Otwórz pełny panel Umami &rarr;
            </a>
        </div>
    </div>
</x-filament-panels::page>
