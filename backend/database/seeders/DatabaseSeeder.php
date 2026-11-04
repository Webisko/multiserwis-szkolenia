<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\ExamQuestion;
use App\Models\Machine;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::current();

        // 1. Konta systemowe i demonstracyjne B2B (hasła konfigurowalne przez .env z bezpiecznym fallbackiem)
        $adminPass = env('ADMIN_INITIAL_PASSWORD', 'MS#Admin2026!');
        $managerPass = env('MANAGER_INITIAL_PASSWORD', 'MS#Menedzer2026!');
        $studentPass = env('STUDENT_INITIAL_PASSWORD', 'MS#Kursant2026!');
        $guardianPass = env('GUARDIAN_INITIAL_PASSWORD', 'MS#Opiekun2026!');

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@webisko.pl'],
            [
                'legacy_id' => 'u_admin_webisko',
                'name' => 'Administrator MultiSerwis',
                'phone' => '+48 730 101 000',
                'role' => 'ADMIN',
                'company_name' => 'MultiSerwis Kutno Sp. z o.o.',
                'job_title' => 'Administrator systemu',
                'is_active' => true,
                'password' => Hash::make($adminPass),
            ]
        );

        User::query()->firstOrCreate(
            ['email' => 'menedzer@multiserwis.edu.pl'],
            [
                'legacy_id' => 'u2',
                'name' => 'Menedżer Szkoleń',
                'phone' => '+48 570 403 806',
                'role' => 'MANAGER',
                'company_name' => 'MultiSerwis Kutno Sp. z o.o.',
                'job_title' => 'Koordynator ośrodka szkoleniowego',
                'is_active' => true,
                'password' => Hash::make($managerPass),
            ]
        );

        $student = User::query()->firstOrCreate(
            ['email' => 'kursant@multiserwis.edu.pl'],
            [
                'legacy_id' => 'u3',
                'name' => 'Jan Kowalski',
                'phone' => '+48 730 101 000',
                'role' => 'STUDENT',
                'company_name' => 'ABC Transport Sp. z o.o.',
                'job_title' => 'Operator logistyki',
                'is_active' => true,
                'password' => Hash::make($studentPass),
            ]
        );

        User::query()->firstOrCreate(
            ['email' => 'opiekun@multiserwis.edu.pl'],
            [
                'legacy_id' => 'u4',
                'name' => 'Marek Wiśniewski (Opiekun B2B)',
                'phone' => '+48 500 100 200',
                'role' => 'COMPANY_GUARDIAN',
                'company_name' => 'ABC Transport Sp. z o.o.',
                'company_nip' => '7750001122',
                'job_title' => 'Kierownik Działu BHP i Kadr',
                'is_active' => true,
                'password' => Hash::make($guardianPass),
            ]
        );

        $emp2 = User::query()->firstOrCreate(
            ['email' => 'p.nowak@abctransport.pl'],
            [
                'legacy_id' => 'u5',
                'name' => 'Piotr Nowak',
                'phone' => '+48 601 234 567',
                'role' => 'STUDENT',
                'company_name' => 'ABC Transport Sp. z o.o.',
                'job_title' => 'Magazynier – operator UTB',
                'is_active' => true,
                'password' => Hash::make($studentPass),
            ]
        );

        // 2. Programy ramowe dla kategorii
        $syllabusByCat = [
            'UDT' => [
                'Wiadomości o dozorze technicznym i obowiązujące przepisy prawne',
                'Budowa i parametry techniczne urządzeń transportu bliskiego',
                'Czynności operatora przed rozpoczęciem, w trakcie i po zakończeniu pracy',
                'Stateczność urządzenia, diagramy udźwigu i środki ciężkości ładunku',
                'Mechanizmy napędowe, układy hydrauliczne i instalacje elektryczne',
                'Bezpieczna wymiana butli gazowych LPG (wózki jezdniowe)',
                'Praktyczna obsługa maszyny na placu manewrowym w Kutnie',
                'Symulacja egzaminu państwowego UDT pod okiem instruktora',
            ],
            'IMBiGS' => [
                'Ogólna budowa i zasada działania maszyn do robót ziemnych i drogowych',
                'Technologia wykonywania wykopów, nasypów i plantowania terenu',
                'Układy hydrauliczne wysokociśnieniowe i sterowanie wieloczynnościowe',
                'Bezpieczeństwo pracy przy eksploatacji maszyn w pobliżu instalacji podziemnych',
                'Obsługa codzienna (OTC), smarowanie i bezpieczna wymiana osprzętu roboczego',
                'Jazdy praktyczne i manewrowanie maszyną na poligonie przy ul. Przemysłowej 2',
                'Przygotowanie do egzaminu państwowego przed komisją ŚBŁ-WIT (dawniej IMBiGS)',
            ],
            'SEP' => [
                'Podstawowe pojęcia elektrotechniki i przepisy prawa energetycznego',
                'Ochrona przeciwporażeniowa: środki ochrony podstawowej i przy uszkodzeniu',
                'Budowa, zasada działania i eksploatacja urządzeń do i powyżej 1 kV',
                'Aparatura łączeniowa, zabezpieczająca i pomiarowo-kontrolna',
                'Zasady organizacji bezpiecznej pracy przy urządzeniach energetycznych',
                'Postępowanie w razie porażenia prądem elektrycznym i zasady pierwszej pomocy',
                'Egzamin kwalifikacyjny przed Państwową Komisją Kwalifikacyjną',
            ],
            'Spawalnictwo' => [
                'Zasady BHP i ochrony przeciwpożarowej przy pracach spawalniczych',
                'Dobór parametrów spawania, gazów osłonowych oraz materiałów dodatkowych',
                'Przygotowanie krawędzi blach i rur do spawania pachwinowego i doczołowego',
                'Praktyczne spawanie w pozycjach podolnych, naściennych i pionowych (PA, PB, PC, PF)',
                'Identyfikacja niezgodności spawalniczych i metody zapobiegania odkształceniom',
                'Badania wizualne (VT) i łamanie wykonanych złączy próbnych',
                'Egzamin końcowy i certyfikacja spawalnicza wg PN-EN ISO 9606-1 (SGS)',
            ],
            'Inne' => [
                'Przepisy BHP i normy techniczne obowiązujące na stanowisku pracy',
                'Budowa, zasada działania i kryteria bezpiecznej eksploatacji sprzętu',
                'Identyfikacja zużycia eksploatacyjnego, uszkodzeń mechanicznych i kryteriów brakowania',
                'Zasady bezpiecznego wykonywania czynności roboczych i stosowania ŚOI',
                'Czynności konserwacyjne i kontrolne przed rozpoczęciem oraz po zakończeniu pracy',
                'Ćwiczenia praktyczne na stanowisku szkoleniowym pod nadzorem instruktora',
                'Sprawdzenie wiedzy i wydanie imiennego zaświadczenia kwalifikacyjnego',
            ],
        ];

        // 3. Pełny katalog 25 szkoleń
        $coursesData = [
            ['c1', 'wozki-widlowe', 'Operator wózków widłowych (UDT)', 'UDT', '35 godz.', 1000, '1 000 zł', '/operator-wozki-widlowe.webp', true, true, true, 'Komisja UDT', '10 lat', 'Kompleksowy kurs na wózki jezdniowe podnośnikowe z napędem silnikowym. Wykłady w sali szkoleniowej oraz intensywna praktyka na placu manewrowym w Kutnie. Egzamin państwowy przed komisją UDT, uprawnienia ważne 10 lat.'],
            ['c2', 'ladowarki-teleskopowe', 'Ładowarki teleskopowe i wózki z podnoszoną kabiną', 'UDT', '40 godz.', 1500, '1 500 zł', '/ladowarki-teleskopowe.webp', true, true, true, 'Komisja UDT', '5 lat', 'Uprawnienia na wózki jezdniowe ze zmiennym wysięgiem oraz z osobą obsługującą podnoszoną wraz z ładunkiem. Najwyższa kategoria UDT. Szkolenie praktyczne na maszynie Manitou w Kutnie. Ważność uprawnień: 5 lat.'],
            ['c3', 'koparko-ladowarki', 'Koparko-ładowarki (kl. III – wszystkie typy)', 'IMBiGS', '60 godz.', 2350, '2 350 zł', '/koparki.webp', true, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Obsługa maszyn do robót ziemnych wszystkich typów. Zajęcia praktyczne na poligonie ziemnym przy ul. Przemysłowej 2 w Kutnie. Państwowa certyfikacja Sieci Badawczej Łukasiewicz – WIT (dawniej IMBiGS) i bezterminowa książka operatora.'],
            ['c4', 'suwnice', 'Suwnice, wciągniki i wciągarki (UDT)', 'UDT', '24 godz.', 1130, '1 130 zł', '/suwnice-wciagniki.webp', false, true, true, 'Komisja UDT', '10 lat / 5 lat', 'Obsługa suwnic sterowanych z poziomu roboczego (radiowo/przewodowo) oraz z kabiny. Uprawnienia ogólnego przeznaczenia (1 130 zł, 10 lat) lub specjalnego (1 380 zł, 5 lat). Praktyka na hali w Kutnie i egzamin państwowy UDT.'],
            ['c5', 'podesty-ruchome', 'Podesty ruchome przejezdne – zwyżki (UDT)', 'UDT', '24 godz.', 1130, '1 130 zł', '/genie-z-4525j.webp', true, true, true, 'Komisja UDT', '5 lat', 'Szkolenie na podesty nożycowe, przegubowe i teleskopowe do bezpiecznych prac na wysokościach. Zajęcia praktyczne na podnośnikach Genie w Kutnie. Egzamin państwowy UDT na miejscu. Ważność uprawnień: 5 lat.'],
            ['c6', 'zurawie', 'Żurawie przenośne HDS, stacjonarne i samojezdne', 'UDT', '35 godz.', 1130, '1 130 zł', '/manitou-mrt-2150.webp', false, false, true, 'Komisja UDT', '10 lat / 5 lat', 'Uprawnienia UDT na żurawie przewoźne i przenośne HDS (1 130 zł, 10 lat), stacjonarne (1 080 zł, 10 lat) oraz samojezdne i wieżowe (2 480 zł, 5 lat). Zajęcia praktyczne z operowania wysięgnikiem i osprzętem.'],
            ['c7', 'sep-g1', 'Uprawnienia elektryczne SEP G1 (E + D)', 'SEP', '1 dzień', 860, '860 zł', '/uprawnienia-energetyczne-g1.webp', true, true, true, 'Komisja Kwalifikacyjna SEP', '5 lat', 'Szkolenie stacjonarne i egzamin przed Państwową Komisją Kwalifikacyjną w grupie G1 (Eksploatacja 860 zł / Dozór 860 zł). Urządzenia, instalacje i sieci do i powyżej 1 kV oraz pomiary ochronne. Ważność: 5 lat.'],
            ['c8', 'spawanie', 'Kurs spawania (MIG/MAG, TIG, MMA)', 'Spawalnictwo', '32 godz.', 2400, '2 400 zł', '/serwis-i-koserwacja.webp', true, false, true, 'Jednostka Certyfikująca SGS', '3 lata (PN-EN ISO 9606-1)', 'Praktyczny kurs spawalniczy w atestowanej spawalni w Kutnie. Moduły: spoiny pachwinowe, doczołowe blach i rury. Stal czarna od 2 400 zł, nierdzewna 2 700 zł, aluminium 2 900 zł. Certyfikat SGS wg PN-EN ISO 9606-1 i Książeczka Spawacza.'],
            ['c9', 'koparki-jednonaczyniowe', 'Koparki jednonaczyniowe (kl. III – do 25 ton)', 'IMBiGS', '60 godz.', 2350, '2 350 zł', '/jcb-3cx.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Uprawnienia operatora koparek jednonaczyniowych do 25 ton masy całkowitej. Praktyka na poligonie ziemnym w Kutnie, egzamin państwowy ŚBŁ-WIT (IMBiGS) i wydanie państwowej książki operatora.'],
            ['c10', 'walce-drogowe', 'Walce drogowe (kl. II – wszystkie typy)', 'IMBiGS', '50 godz.', 2500, '2 500 zł', '/koparki.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Obsługa wszystkich typów walców drogowych do zagęszczania gruntu i nawierzchni bitumicznych. Zajęcia praktyczne w Kutnie i egzamin państwowy ŚBŁ-WIT (IMBiGS).'],
            ['c11', 'spycharki', 'Spycharki (kl. III – do 110 kW)', 'IMBiGS', '50 godz.', 2500, '2 500 zł', '/koparki.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Szkolenie na spycharki gąsienicowe i kołowe do 110 kW mocy silnika. Niwelacja terenu, skarpowanie i roboty ziemne na poligonie w Kutnie. Egzamin państwowy ŚBŁ-WIT (IMBiGS).'],
            ['c12', 'sep-g2', 'Uprawnienia cieplne i energetyczne SEP G2 (E + D)', 'SEP', '1 dzień', 860, '860 zł', '/uprawnienia-energetyczne-g1.webp', false, false, true, 'Komisja Kwalifikacyjna SEP', '5 lat', 'Eksploatacja (860 zł) i dozór (860 zł) urządzeń wytwarzających, przetwarzających i zużywających ciepło: kotłów parowych i wodnych, turbin, wymienników, pomp ciepła i sieci cieplnych. Ważność: 5 lat.'],
            ['c13', 'sep-g3', 'Uprawnienia gazowe SEP G3 (E + D)', 'SEP', '1 dzień', 860, '860 zł', '/uprawnienia-energetyczne-g1.webp', false, false, true, 'Komisja Kwalifikacyjna SEP', '5 lat', 'Obsługa, konserwacja, montaż i dozór urządzeń, instalacji oraz sieci gazowych przemysłowych i domowych. Eksploatacja (860 zł) / Dozór (860 zł). Państwowe świadectwo kwalifikacyjne ważne 5 lat.'],
            ['c14', 'kontrola-zawiesi', 'Specjalista ds. kontroli zawiesi', 'Inne', '1 dzień', 600, '600 zł', '/suwnice-wciagniki.webp', false, false, true, 'Komisja Ośrodka MultiSerwis', 'Bezterminowo', 'Szkolenie z zakresu bieżącej i okresowej kontroli stanu technicznego zawiesi linowych, pasowych i łańcuchowych, kryteriów brakowania oraz prowadzenia ewidencji zgodnie z przepisami BHP.'],
            ['c15', 'pilarki-mechaniczne', 'Operator pilarek mechanicznych', 'Inne', '1 dzień', 550, '550 zł', '/operator-wozki-widlowe.webp', false, false, true, 'Komisja Ośrodka MultiSerwis', 'Bezterminowo', 'Bezpieczna obsługa pilarek łańcuchowych spalinowych i elektrycznych, techniki ścinki i okrzesywania drzew, wymiana łańcucha oraz konserwacja układu tnącego.'],
            ['c16', 'ladowarki-jednonaczyniowe', 'Ładowarki jednonaczyniowe (kl. III – do 20 ton)', 'IMBiGS', '60 godz.', 2350, '2 350 zł', '/jcb-3cx.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Obsługa ładowarek jednonaczyniowych kołowych do 20 ton masy całkowitej przy załadunku urobku, kruszyw i pracach ziemnych. Poligon manewrowy w Kutnie, państwowy egzamin ŚBŁ-WIT (IMBiGS).'],
            ['c17', 'rowniarki-drogowe', 'Równiarki drogowe (wszystkie typy)', 'IMBiGS', '50 godz.', 2500, '2 500 zł', '/koparki.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Szkolenie na równiarki drogowe wykorzystywane do precyzyjnego profilowania podłoża, skarp, nasypów i dróg. Egzamin państwowy ŚBŁ-WIT i bezterminowa książka operatora.'],
            ['c18', 'frezarki-do-nawierzchni', 'Frezarki do nawierzchni dróg', 'IMBiGS', '50 godz.', 2500, '2 500 zł', '/koparki.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Obsługa samojezdnych frezarek do nawierzchni drogowej przy remontach dróg, usuwaniu warstw ścieralnych asfaltu i frezowaniu pasowym. Egzamin państwowy ŚBŁ-WIT.'],
            ['c19', 'rozkladarki-mas-bitumicznych', 'Rozkładarki mas bitumicznych (asfaltu)', 'IMBiGS', '50 godz.', 2600, '2 600 zł', '/koparki.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Układanie mieszanek mineralno-asfaltowych przy budowie dróg, placów manewrowych i autostrad. Technologia rozściełania, kontrola grubości warstwy i egzamin ŚBŁ-WIT.'],
            ['c20', 'pompy-do-betonu', 'Pompy do mieszanki betonowej', 'IMBiGS', '50 godz.', 2600, '2 600 zł', '/koparki.webp', false, false, true, 'Komisja ŚBŁ-WIT (IMBiGS)', 'Bezterminowo', 'Obsługa stacjonarnych oraz samochodowych pomp wysięgnikowych do podawania mieszanki betonowej na placach budów. Zasady BHP, mycie rurociągów i egzamin ŚBŁ-WIT.'],
            ['c21', 'wciagarki-i-wciagniki', 'Wciągarki i wciągniki mechaniczne (UDT)', 'UDT', '20 godz.', 930, '930 zł', '/suwnice-wciagniki.webp', false, false, true, 'Komisja UDT', '10 lat / 5 lat', 'Uprawnienia UDT na wciągniki i wciągarki mechaniczne z napędem silnikowym ogólnego oraz specjalnego przeznaczenia. Budowa lin, hamulców i bezpieczna obsługa poddozorowa.'],
            ['c22', 'podesty-zaladowcze', 'Podesty ruchome załadowcze (windy samochodowe)', 'Inne', '1 dzień', 500, '500 zł', '/operator-wozki-widlowe.webp', false, false, true, 'Komisja UDT / Ośrodka', '10 lat', 'Obsługa hydraulicznych burt załadowczych i wind montowanych na pojazdach ciężarowych i dostawczych. Kluczowe szkolenie dla kierowców, kurierów i zaopatrzeniowców.'],
            ['c23', 'urzadzenia-hakowe', 'Urządzenia załadowcze hakowe i bramowe', 'Inne', '1 dzień', 550, '550 zł', '/operator-wozki-widlowe.webp', false, false, true, 'Komisja Ośrodka MultiSerwis', 'Bezterminowo', 'Szkolenie z obsługi systemów załadunku kontenerów hakowych i bramowych na pojazdach ciężarowych w gospodarce komunalnej, odpadach i budownictwie.'],
            ['c24', 'hakowy-sygnalista', 'Hakowy – sygnalista przy urządzeniach UTB', 'Inne', '1 dzień', 400, '400 zł', '/suwnice-wciagniki.webp', false, false, true, 'Komisja Ośrodka MultiSerwis', 'Bezterminowo', 'Uprawnienia hakowego-sygnalisty współpracującego z operatorami żurawi, suwnic i dźwigów. Dobór zawiesi, mocowanie ładunku oraz sygnalizacja ręczna i radiowa.'],
            ['c25', 'kosy-spalinowe', 'Operator kos spalinowych i wykaszarek', 'Inne', '1 dzień', 600, '600 zł', '/operator-wozki-widlowe.webp', false, false, true, 'Komisja Ośrodka MultiSerwis', 'Bezterminowo', 'Bezpieczna obsługa, dobór głowic żyłkowych i tarcz tnących, konserwacja oraz przepisy BHP przy pracy kosami mechanicznymi w pracach drogowych i komunalnych.'],
        ];

        $courseMap = [];
        foreach ($coursesData as $idx => $c) {
            $course = Course::query()->firstOrCreate(
                ['code' => $c[0]],
                [
                    'slug' => $c[1],
                    'title' => $c[2],
                    'category' => $c[3],
                    'duration' => $c[4],
                    'price_gross' => $c[5],
                    'price_label' => $c[6],
                    'image' => $c[7],
                    'is_popular' => $c[8],
                    'has_online' => $c[9],
                    'has_stationary' => $c[10],
                    'exam_body' => $c[11],
                    'validity_period' => $c[12],
                    'short_description' => $c[13],
                    'description' => $c[13],
                    'syllabus' => $syllabusByCat[$c[3]] ?? $syllabusByCat['UDT'],
                    'sort_order' => ($idx + 1) * 10,
                    'is_active' => true,
                    'meta_title' => $c[2].' – Kurs i Egzamin w Kutnie | MultiSerwis',
                    'meta_description' => $c[13],
                    'og_image' => $c[7],
                ]
            );
            $courseMap[$c[0]] = $course;
        }

        // 4. Maszyny na wynajem
        $machinesData = [
            ['m1', 'manitou-mrt-2150-privilege', 'Manitou MRT 2150 Privilege', 'Ładowarka teleskopowa obrotowa', '21 m', '5 000 kg', '16 400 kg', 950, '/manitou-mrt-2150.webp', 'Wszechstronna ładowarka teleskopowa obrotowa 360° z osprzętem widłowym, wciągarką hydrauliczną oraz koszem osobowym.'],
            ['m2', 'genie-z-45-25j-rt', 'Genie Z-45/25J RT', 'Podnośnik przegubowo-teleskopowy', '16 m', '227 kg', '6 500 kg', 450, '/genie-z-4525j.webp', 'Terenowy podest ruchomy spalinowy z napędem 4x4 do prac montażowych, dekarskich i konserwacyjnych na wysokości do 16 metrów.'],
            ['m3', 'jcb-3cx-eco', 'JCB 3CX Eco', 'Koparko-ładowarka', '5,4 m', '1,2 m³', '8 100 kg', 650, '/jcb-3cx.webp', 'Niezawodna koparko-ładowarka z łyżką wieloczynnościową 4w1 oraz ramieniem teleskopowym Extradig do wykopów i załadunku.'],
        ];

        foreach ($machinesData as $idx => $m) {
            Machine::query()->firstOrCreate(
                ['code' => $m[0]],
                [
                    'slug' => $m[1],
                    'name' => $m[2],
                    'type' => $m[3],
                    'height' => $m[4],
                    'capacity' => $m[5],
                    'weight' => $m[6],
                    'daily_price_net' => $m[7],
                    'image' => $m[8],
                    'description' => $m[9],
                    'specs' => [
                        'height' => $m[4],
                        'capacity' => $m[5],
                        'weight' => $m[6],
                    ],
                    'sort_order' => ($idx + 1) * 10,
                    'is_active' => true,
                    'meta_title' => $m[2].' – Wynajem Kutno | MultiSerwis',
                    'meta_description' => $m[9],
                    'og_image' => $m[8],
                ]
            );
        }

        // 5. Moduły, lekcje i pytania egzaminacyjne dla flagowych kursów (c1, c2, c7/c3, c4)
        $c1 = $courseMap['c1'];
        $m1 = CourseModule::query()->firstOrCreate(
            ['code' => 'c1m1'],
            [
                'course_id' => $c1->id,
                'title' => 'Moduł 1: Budowa i zasady pracy wózków jezdniowych',
                'description' => 'Klasyfikacja UDT, budowa układów napędowych, hydraulicznych i elektrycznych wózków widłowych.',
                'sort_order' => 10,
                'is_active' => true,
            ]
        );
        $m2 = CourseModule::query()->firstOrCreate(
            ['code' => 'c1m2'],
            [
                'course_id' => $c1->id,
                'title' => 'Moduł 2: Eksploatacja, diagramy udźwigu i butle LPG',
                'description' => 'Czynności przed rozpoczęciem pracy, odczyt diagramów udźwigu, stateczność oraz bezpieczna wymiana butli gazowych.',
                'sort_order' => 20,
                'is_active' => true,
            ]
        );
        $m3 = CourseModule::query()->firstOrCreate(
            ['code' => 'c1m3'],
            [
                'course_id' => $c1->id,
                'title' => 'Moduł 3: Dozór techniczny UDT i egzamin końcowy',
                'description' => 'Książka rewizyjna UDT, badania okresowe i doraźne oraz pełna symulacja egzaminu państwowego.',
                'sort_order' => 30,
                'is_active' => true,
            ]
        );

        $lessonsC1 = [
            [$m1->id, 'c1l1', 'Wprowadzenie i typy wózków widłowych', 'video', '15:00', '<p>Klasyfikacja wózków jezdniowych podnośnikowych według wytycznych Urzędu Dozoru Technicznego. Różnice pomiędzy wózkami czołowymi, bocznymi, prowadzonymi i ze zmiennym wysięgiem.</p>'],
            [$m1->id, 'c1l2', 'Układ napędowy i mechanizm podnoszenia', 'video', '22:30', '<p>Budowa masztu (duplex, triplex), łańcuchów nośnych, siłowników pochyłu i podnoszenia oraz karetki z widłami.</p>'],
            [$m1->id, 'c1l6a', 'Przepisy BHP i normy bezpieczeństwa', 'text', '08:00', '<h3>Zasady bezpiecznej eksploatacji wózków jezdniowych</h3><p>Operator przed przystąpieniem do pracy zobowiązany jest do zapoznania się z instrukcją eksploatacji wózka oraz wpisami w dzienniku konserwacji.</p><ul><li>Sprawdzenie układu hamulcowego (zasadniczego i postojowego).</li><li>Kontrola stanu wideł (zużycie grubości max 10%, lecz nie więcej niż 5 mm).</li><li>Sprawdzenie szczelności układu hydraulicznego i ogumienia.</li></ul>'],
            [$m1->id, 'c1l7', 'Test wiedzy – Moduł 1', 'test', '8 pytań', '<p>Sprawdź swoją wiedzę z zakresu budowy i przepisów BHP przed przejściem do kolejnego modułu.</p>'],
            [$m2->id, 'c1l4', 'Czynności przed rozpoczęciem pracy (OTC)', 'video', '12:00', '<p>Praktyczna procedura kontroli codziennej wózka widłowego na placu manewrowym MultiSerwis w Kutnie.</p>'],
            [$m2->id, 'c1l5', 'Bezpieczeństwo wymiany butli LPG', 'video', '25:00', '<p>Kolejność czynności przy wymianie 11 kg butli gazowej propan-butan: zakręcenie zaworu, wypalenie gazu z przewodów, użycie rękawic ochronnych i kontrola szczelności detektorem lub wodą mydlaną.</p>'],
            [$m2->id, 'c1l6', 'Diagram udźwigu – czytanie wykresów i środek ciężkości', 'video', '30:00', '<p>Wyznaczanie maksymalnej masy ładunku na podstawie odległości środka ciężkości (c) oraz wysokości podnoszenia (H).</p>'],
            [$m3->id, 'c1l8', 'Przepisy prawne UDT i dokumentacja techniczno-ruchowa', 'video', '20:00', '<p>Terminy badań okresowych (co 12 lub 24 miesiące), decyzja zezwalająca na eksploatację i obowiązki operatora podczas egzaminu UDT.</p>'],
            [$m3->id, 'c1l10', 'Egzamin końcowy UDT (Symulacja)', 'test', '12 pytań', '<p>Oficjalna baza pytań testowych przygotowujących do egzaminu teoretycznego przed komisją Urzędu Dozoru Technicznego.</p>'],
        ];

        foreach ($lessonsC1 as $idx => $l) {
            CourseLesson::query()->firstOrCreate(
                ['code' => $l[1]],
                [
                    'course_module_id' => $l[0],
                    'course_id' => $c1->id,
                    'title' => $l[2],
                    'type' => $l[3],
                    'duration' => $l[4],
                    'content' => $l[5],
                    'is_locked' => false,
                    'sort_order' => ($idx + 1) * 10,
                    'is_active' => true,
                ]
            );
        }

        // Pytania egzaminacyjne dla kursu c1
        $questionsC1 = [
            ['q1', $m1->id, 'Jakie środki ochrony i zasady bezpieczeństwa obowiązują podczas wymiany butli LPG w wózku jezdniowym?', 'SINGLE_CHOICE', 'MEDIUM', ['Praca wyłącznie przy włączonym silniku', 'Zakręcenie zaworu, wypalenie gazu z instalacji, wyłączenie zapłonu i użycie rękawic ochronnych', 'Sprawdzenie szczelności otwartym płomieniem', 'Wymiana butli bez rękawic na pochyłym terenie'], [1], 'Przed odkręceniem butli należy zakręcić jej zawór, zaczekać aż silnik samoczynnie zgaśnie po wypaleniu gazu z przewodów, wyłączyć zapłon i zastosować rękawice ochronne.'],
            ['q2', $m1->id, 'Które czynności należą do codziennej obsługi technicznej (OTC) przed rozpoczęciem pracy wózkiem widłowym?', 'MULTIPLE_CHOICE', 'EASY', ['Sprawdzenie działania hamulca zasadniczego i postojowego', 'Regulacja ciśnienia zaworu bezpieczeństwa rozdzielacza hydraulicznego', 'Kontrola stanu wideł i zamków zabezpieczających na karetce', 'Sprawdzenie oświetlenia, sygnału dźwiękowego i ogumienia'], [0, 2, 3], 'Operator sprawdza hamulce, stan wideł oraz oświetlenie i sygnał dźwiękowy. Regulacja zaworów hydraulicznych należy wyłącznie do uprawnionego konserwatora UDT.'],
            ['q3', $m2->id, 'Jaki jest maksymalny dopuszczalny stopień zużycia grubości zęba widły na zgięciu (pięcie)?', 'SINGLE_CHOICE', 'HARD', ['20% grubości nominalnej', '10% grubości nominalnej, lecz nie więcej niż 5 mm', '15% grubości nominalnej, lecz nie więcej niż 10 mm', 'Zużycie grubości nie podlega pomiarowi'], [1], 'Zgodnie z normą ISO 5057 widła podlega wycofaniu z eksploatacji, gdy jej grubość zmniejszy się o 10% wartości nominalnej (lub o 5 mm).'],
            ['q4', $m2->id, 'Co się dzieje z udźwigiem nominalnym wózka widłowego, gdy środek ciężkości ładunku oddala się od czoła wideł (np. z 500 mm na 800 mm)?', 'SINGLE_CHOICE', 'MEDIUM', ['Udźwig wózka wzrasta proporcjonalnie', 'Udźwig wózka maleje zgodnie z diagramem udźwigu', 'Udźwig pozostaje bez zmian do wysokości 3 metrów', 'Ciśnienie w układzie hydraulicznym automatycznie zwiększa udźwig'], [1], 'Wraz ze wzrostem odległości środka ciężkości ładunku od czoła wideł rośnie moment wywracający, dlatego dopuszczalny udźwig maleje zgodnie z diagramem udźwigu.'],
            ['q5', $m3->id, 'W jakim położeniu powinny znajdować się widły podczas jazdy wózkiem jezdniowym z ładunkiem po poziomej nawierzchni?', 'SINGLE_CHOICE', 'EASY', ['Na wysokości ok. 1,5 metra dla lepszej widoczności', 'Na wysokości ok. 15–30 cm nad podłożem z masztem odchylonym na siebie (do tyłu)', 'Maksymalnie opuszczone, tak aby szorowały po posadzce', 'Z masztem pochylonym maksymalnie do przodu'], [1], 'Podczas jazdy transportowej widły powinny znajdować się ok. 15–30 cm nad nawierzchnią, a maszt musi być odchylony do tyłu (na siebie), co stabilizuje ładunek.'],
            ['q6', $m3->id, 'Co ile miesięcy przeprowadza się badania okresowe UDT dla wózków jezdniowych podnośnikowych z mechanicznym napędem podnoszenia (objętych pełnym dozorem)?', 'SINGLE_CHOICE', 'MEDIUM', ['Co 6 miesięcy', 'Co 12 miesięcy', 'Co 24 miesiące', 'Co 36 miesięcy'], [1], 'Wózki objęte pełnym dozorem technicznym (np. z kabiną podnoszoną z operatorem lub ze zmiennym wysięgiem) podlegają badaniom okresowym UDT co 12 miesięcy.'],
        ];

        foreach ($questionsC1 as $idx => $q) {
            ExamQuestion::query()->firstOrCreate(
                ['code' => $q[0]],
                [
                    'course_id' => $c1->id,
                    'course_module_id' => $q[1],
                    'question' => $q[2],
                    'type' => $q[3],
                    'difficulty' => $q[4],
                    'options' => $q[5],
                    'correct_answer' => $q[6],
                    'explanation' => $q[7],
                    'sort_order' => ($idx + 1) * 10,
                    'is_active' => true,
                ]
            );
        }

        // Moduł i lekcje dla c2 (Ładowarki teleskopowe)
        $c2 = $courseMap['c2'];
        $c2m1 = CourseModule::query()->firstOrCreate(
            ['code' => 'c2m1'],
            [
                'course_id' => $c2->id,
                'title' => 'Moduł 1: Budowa i stateczność ładowarek teleskopowych',
                'description' => 'Wysięgnik teleskopowy, podpory stabilizujące, poziomowanie ramy i wymienne osprzęty robocze.',
                'sort_order' => 10,
                'is_active' => true,
            ]
        );
        CourseLesson::query()->firstOrCreate(
            ['code' => 'c2l1'],
            [
                'course_module_id' => $c2m1->id,
                'course_id' => $c2->id,
                'title' => 'Budowa i systemy bezpieczeństwa ładowarki Manitou MRT',
                'type' => 'video',
                'duration' => '20:00',
                'content' => '<p>Omówienie ogranicznika momentu obciążenia (CEC), pracy na kołach oraz na podporach hydraulicznych.</p>',
                'sort_order' => 10,
                'is_active' => true,
            ]
        );
        CourseLesson::query()->firstOrCreate(
            ['code' => 'c2l2'],
            [
                'course_module_id' => $c2m1->id,
                'course_id' => $c2->id,
                'title' => 'Odczyt diagramów udźwigu dla wysięgnika teleskopowego',
                'type' => 'text',
                'duration' => '15:00',
                'content' => '<p>Zasady korzystania z wykresów obciążenia w zależności od kąta uniesienia i długości wysunięcia teleskopu.</p>',
                'sort_order' => 20,
                'is_active' => true,
            ]
        );

        // 6. Przypisania (Enrollments) dla kursanta i pracowników B2B
        Enrollment::query()->firstOrCreate(
            ['user_id' => $student->id, 'course_id' => $c1->id],
            [
                'legacy_id' => 'enr_1',
                'status' => 'ACTIVE',
                'progress' => 45,
                'next_lesson' => 'Bezpieczeństwo wymiany butli LPG',
                'completed_lessons' => ['c1l1', 'c1l2', 'c1l6a', 'c1l4'],
                'expires_at' => now()->addMonths(6),
            ]
        );

        Enrollment::query()->firstOrCreate(
            ['user_id' => $student->id, 'course_id' => $c2->id],
            [
                'legacy_id' => 'enr_2',
                'status' => 'ACTIVE',
                'progress' => 20,
                'next_lesson' => 'Budowa i systemy bezpieczeństwa ładowarki Manitou MRT',
                'completed_lessons' => [],
                'expires_at' => now()->addMonths(6),
            ]
        );

        Enrollment::query()->firstOrCreate(
            ['user_id' => $emp2->id, 'course_id' => $c1->id],
            [
                'status' => 'COMPLETED',
                'progress' => 100,
                'next_lesson' => 'Egzamin zakończony',
                'completed_lessons' => ['c1l1', 'c1l2', 'c1l6a', 'c1l7', 'c1l4', 'c1l5', 'c1l6', 'c1l8', 'c1l10'],
                'completed_at' => now()->subDays(5),
                'certificate_number' => 'MS/UDT/2026/0104',
                'expires_at' => now()->addYears(10),
            ]
        );
    }
}
