DELETE FROM "Enrollment";
DELETE FROM "Order";
DELETE FROM "Course";

INSERT INTO "Course" (
  "id",
  "title",
  "category",
  "duration",
  "price",
  "image",
  "isPopular",
  "description",
  "status",
  "createdAt",
  "updatedAt"
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Operator Wózków Widłowych (I WJO)',
    'UDT',
    '35h',
    '650 PLN',
    'operator-wozki-widlowe.webp',
    true,
    'Ucz się teorii w domu, przyjedź tylko na egzamin praktyczny. Oszczędź czas i pieniądze dzięki naszej platformie e-learningowej. Gwarantujemy materiały wideo 4K, testy próbne identyczne z państwowymi oraz 100% wsparcia instruktora.',
    'published',
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Ładowarki Teleskopowe - Pełne Uprawnienia',
    'UDT',
    '40h',
    '850 PLN',
    'ladowarki-teleskopowe.webp',
    true,
    'Szkolenie na wielozadaniowe nośniki osprzętu. Najbardziej poszukiwane uprawnienia w budownictwie.',
    'published',
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Uprawnienia Energetyczne G1 (Eksploatacja)',
    'SEP',
    '8h',
    '400 PLN',
    'uprawnienia-energetyczne-g1.webp',
    false,
    'Kurs przygotowawczy do egzaminu kwalifikacyjnego na stanowisku Eksploatacji.',
    'published',
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Suwnice i Wciągniki',
    'UDT',
    '24h',
    '600 PLN',
    'suwnice-wciagniki.webp',
    false,
    'Obsługa suwnic sterowanych z poziomu roboczego oraz kabiny.',
    'published',
    NOW(),
    NOW()
  );
