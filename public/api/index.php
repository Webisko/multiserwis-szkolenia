<?php
declare(strict_types=1);

/**
 * MultiSerwis Szkolenia - Production REST API (PHP 8.4 + PDO SQLite + SSL SMTP)
 * Shared across multiserwis.edu.pl, szkolenia.multiserwis.edu.pl, and panel.multiserwis.edu.pl
 */

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (preg_match('/^https?:\/\/([a-z0-9-]+\.)?multiserwis\.(edu\.pl|tech)(:\d+)?$/i', $origin) || str_starts_with($origin, 'http://localhost')) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 1. Load external environment file (outside public_html)
$sharedDataDir = '/home/srv127364/domains/multiserwis.edu.pl/data';
if (!is_dir('/home/srv127364/domains/multiserwis.edu.pl')) {
    $sharedDataDir = sys_get_temp_dir() . '/multiserwis_data';
}
if (!is_dir($sharedDataDir)) {
    @mkdir($sharedDataDir, 0700, true);
}

$envFile = $sharedDataDir . '/api.env';
$env = [];
if (is_file($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $env[trim($parts[0])] = trim($parts[1], " \t\n\r\0\x0B\"'");
        }
    }
}

$jwtSecret = $env['JWT_SECRET'] ?? 'multiserwis_prod_jwt_secret_2026_edu_pl';
$dbPath = $sharedDataDir . '/multiserwis.sqlite';

// 2. Connect to SQLite & Auto-Migrate/Seed
try {
    $pdo = new PDO('sqlite:' . $dbPath, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA journal_mode = WAL;');
    $pdo->exec('PRAGMA foreign_keys = ON;');
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'message' => $e->getMessage()]);
    exit;
}

function initDatabase(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT,
            role TEXT NOT NULL DEFAULT 'STUDENT',
            company TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            duration TEXT NOT NULL,
            price TEXT NOT NULL,
            promoPrice TEXT,
            image TEXT NOT NULL,
            isPopular INTEGER NOT NULL DEFAULT 0,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'published',
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            courseId TEXT NOT NULL,
            amount INTEGER NOT NULL,
            currency TEXT NOT NULL DEFAULT 'PLN',
            provider TEXT,
            status TEXT NOT NULL DEFAULT 'PAID',
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS enrollments (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            courseId TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'ACTIVE',
            progress INTEGER NOT NULL DEFAULT 0,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            UNIQUE(userId, courseId)
        );
        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            courseId TEXT NOT NULL,
            moduleId TEXT,
            content TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'SINGLE_CHOICE',
            difficulty TEXT NOT NULL DEFAULT 'MEDIUM',
            answersJson TEXT NOT NULL DEFAULT '[]',
            createdAt TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS lesson_progress (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            lessonId TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            score INTEGER,
            stoppedAt INTEGER NOT NULL DEFAULT 0,
            watchTime INTEGER NOT NULL DEFAULT 0,
            updatedAt TEXT NOT NULL,
            UNIQUE(userId, lessonId)
        );
        CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            subject TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'GENERAL',
            status TEXT NOT NULL DEFAULT 'OPEN',
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS ticket_messages (
            id TEXT PRIMARY KEY,
            ticketId TEXT NOT NULL,
            senderId TEXT NOT NULL,
            content TEXT NOT NULL,
            isInternal INTEGER NOT NULL DEFAULT 0,
            createdAt TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS inquiries (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            subject TEXT,
            message TEXT,
            status TEXT NOT NULL DEFAULT 'NEW',
            createdAt TEXT NOT NULL
        );
    ");

    $hasProdAccounts = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE email = 'kursant@multiserwis.edu.pl'")->fetchColumn();
    if ($hasProdAccounts === 0) {
        $now = gmdate('c');
        $pdo->exec("DELETE FROM users WHERE email LIKE '%@test.com'");
        $seedUsers = [
            ['u_admin_webisko', 'admin@webisko.pl', password_hash('MS#Admin2026!', PASSWORD_BCRYPT), 'Administrator (admin@webisko.pl)', '+48 730 101 000', 'ADMIN', 'MultiSerwis'],
            ['u2', 'menedzer@multiserwis.edu.pl', password_hash('MS#Menedzer2026!', PASSWORD_BCRYPT), 'Menedżer Szkoleń', '+48 570 403 806', 'MANAGER', 'MultiSerwis'],
            ['u3', 'kursant@multiserwis.edu.pl', password_hash('MS#Kursant2026!', PASSWORD_BCRYPT), 'Jan Kowalski', '+48 730 101 000', 'STUDENT', 'ABC Transport Sp. z o.o.'],
            ['u4', 'opiekun@multiserwis.edu.pl', password_hash('MS#Opiekun2026!', PASSWORD_BCRYPT), 'Opiekun Firmy ABC', '+48 500 100 200', 'COMPANY_GUARDIAN', 'ABC Transport Sp. z o.o.'],
        ];
        $stmtU = $pdo->prepare("INSERT OR REPLACE INTO users (id, email, passwordHash, name, phone, role, company, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($seedUsers as $u) {
            $stmtU->execute([$u[0], $u[1], $u[2], $u[3], $u[4], $u[5], $u[6], $now, $now]);
        }
        $stmtE = $pdo->prepare("INSERT OR IGNORE INTO enrollments (id, userId, courseId, status, progress, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmtE->execute(['enr_1', 'u3', 'c1', 'ACTIVE', 45, $now, $now]);
        $stmtE->execute(['enr_2', 'u3', 'c2', 'ACTIVE', 20, $now, $now]);
    }

    $courseCount = (int)$pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn();
    if ($courseCount === 0) {
        $now = gmdate('c');
        $seedCourses = [
            ['c1', 'Operator Wózków Jezdniowych (Widłowych) - UDT', 'UDT', '35h', '1000 PLN', null, '/operator-wozki-widlowe.webp', 1, 'Kompleksowe szkolenie przygotowujące do egzaminu państwowego UDT na wózki jezdniowe podnośnikowe. Teoria online + praktyka na placu manewrowym w Kutnie.', 'published'],
            ['c2', 'Ładowarki Teleskopowe i Wózki Specjalizowane (I WJO) - UDT', 'UDT', '40h', '1500 PLN', null, '/ladowarki-teleskopowe.webp', 1, 'Uprawnienia najwyższej kategorii UDT obejmujące wózki ze zmiennym wysięgiem (ładowarki teleskopowe) oraz wózki z podnoszonym operatorem.', 'published'],
            ['c3', 'Podesty Ruchome Przejezdne (Zwyżki) - UDT', 'UDT', '24h', '1130 PLN', null, '/podesty-ruchome.webp', 1, 'Szkolenie na podesty ruchome wolnobieżne (nożycowe, teleskopowe) oraz samojezdne montowane na pojeździe.', 'published'],
            ['c4', 'Suwnice, Wciągniki i Wciągarki - UDT', 'UDT', '28h', '1130 PLN', null, '/suwnice-wciagniki.webp', 0, 'Kurs obsługi suwnic ogólnego oraz specjalnego przeznaczenia sterowanych z poziomu roboczego lub z kabiny.', 'published'],
            ['c5', 'Żurawie Przewoźne i Przenośne HDS - UDT', 'UDT', '30h', '1130 PLN', null, '/zurawie-hds.webp', 1, 'Praktyczne i teoretyczne przygotowanie do egzaminu UDT na żurawie przeładunkowe HDS.', 'published'],
            ['c6', 'Koparkoładowarki (wszystkie typy) - ŚBŁ-WIT / IMBiGS', 'IMBiGS', '52h', '2350 PLN', null, '/koparko-ladowarki.webp', 1, 'Państwowe uprawnienia operatora koparkoładowarek wszystkich typów wydawane przez Sieć Badawczą Łukasiewicz – WIT.', 'published'],
            ['c7', 'Koparki Jednonaczyniowe kl. III i I - ŚBŁ-WIT / IMBiGS', 'IMBiGS', '52h', '2350 PLN', null, '/koparki-jednonaczyniowe.webp', 1, 'Szkolenie na koparki jednonaczyniowe do 25 ton (kl. III) oraz bez ograniczeń tonażowych (kl. I).', 'published'],
            ['c8', 'Uprawnienia Energetyczne SEP G1, G2, G3 (Eksploatacja / Dozór)', 'SEP', '8h', '860 PLN', null, '/uprawnienia-energetyczne-g1.webp', 1, 'Szkolenie jednodniowe z egzaminem komisji kwalifikacyjnej: G1 (elektryczne), G2 (cieplne), G3 (gazowe).', 'published'],
            ['c9', 'Kursy Spawania MIG/MAG (135), TIG (141), MMA (111) - PN-EN ISO 9606-1', 'Spawalnictwo', '32h', '2400 PLN', null, '/spawanie-mig-mag.webp', 1, 'Praktyczne szkolenie spawalnicze zakończone egzaminem i wydaniem certyfikatu spawacza SGS oraz Książki Spawacza.', 'published'],
        ];
        $stmtC = $pdo->prepare("INSERT OR IGNORE INTO courses (id, title, category, duration, price, promoPrice, image, isPopular, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($seedCourses as $c) {
            $stmtC->execute([$c[0], $c[1], $c[2], $c[3], $c[4], $c[5], $c[6], $c[7], $c[8], $c[9], $now, $now]);
        }

        // Seed initial enrollment for student@test.com
        $stmtE = $pdo->prepare("INSERT OR IGNORE INTO enrollments (id, userId, courseId, status, progress, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmtE->execute(['enr_1', 'u3', 'c1', 'ACTIVE', 45, $now, $now]);
        $stmtE->execute(['enr_2', 'u3', 'c2', 'ACTIVE', 20, $now, $now]);
    }
}

initDatabase($pdo);

// 3. JWT Helper functions
function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}
function createJwt(array $payload, string $secret): string {
    $header = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + (86400 * 14);
    $body = base64UrlEncode(json_encode($payload));
    $sig = base64UrlEncode(hash_hmac('sha256', "$header.$body", $secret, true));
    return "$header.$body.$sig";
}
function verifyJwt(string $token, string $secret): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $sig] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', "$header.$body", $secret, true));
    if (!hash_equals($expected, $sig)) return null;
    $data = json_decode(base64UrlDecode($body), true);
    if (!is_array($data) || (isset($data['exp']) && $data['exp'] < time())) return null;
    return $data;
}
function getAuthUser(PDO $pdo, string $secret): ?array {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)$/i', $authHeader, $m)) return null;
    $payload = verifyJwt(trim($m[1]), $secret);
    if (!$payload || empty($payload['sub'])) return null;
    $stmt = $pdo->prepare("SELECT id, email, name, phone, role, company, createdAt, updatedAt FROM users WHERE id = ?");
    $stmt->execute([$payload['sub']]);
    $user = $stmt->fetch();
    return $user ?: null;
}

// 4. SSL SMTP Mailer Helper (h108.seohost.pl:465)
function sendSmtpMail(array $env, string $to, string $subject, string $htmlBody): bool {
    $host = $env['SMTP_HOST'] ?? 'h108.seohost.pl';
    $port = (int)($env['SMTP_PORT'] ?? 465);
    $user = $env['SMTP_USER'] ?? 'biuro@multiserwis.edu.pl';
    $pass = $env['SMTP_PASS'] ?? '';
    if ($pass === '') return false;

    $fp = @stream_socket_client("ssl://{$host}:{$port}", $errno, $errstr, 8);
    if (!$fp) return false;

    $read = function() use ($fp): string {
        $out = '';
        while ($str = fgets($fp, 515)) {
            $out .= $str;
            if (substr($str, 3, 1) === ' ') break;
        }
        return $out;
    };
    $write = function(string $cmd) use ($fp): void {
        fwrite($fp, $cmd . "\r\n");
    };

    $read();
    $write("EHLO multiserwis.edu.pl");
    $read();
    $write("AUTH LOGIN");
    $read();
    $write(base64_encode($user));
    $read();
    $write(base64_encode($pass));
    $authResp = $read();
    if (!str_starts_with($authResp, '235')) {
        fclose($fp);
        return false;
    }

    $write("MAIL FROM:<{$user}>");
    $read();
    $write("RCPT TO:<{$to}>");
    $read();
    $write("DATA");
    $read();

    $headers = [
        "Date: " . date('r'),
        "From: MultiSerwis Szkolenia <{$user}>",
        "To: <{$to}>",
        "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
    ];
    $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($htmlBody)) . "\r\n.";
    $write($message);
    $read();
    $write("QUIT");
    fclose($fp);
    return true;
}

// 5. Parse Request URI and Body
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = preg_replace('#^/api/?#', '/', $uri);
$path = '/' . trim($path, '/');

$rawBody = file_get_contents('php://input') ?: '';
$body = json_decode($rawBody, true);
if (!is_array($body) || empty($body)) {
    $body = !empty($_POST) ? $_POST : [];
}

function jsonResponse(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function uuid4(): string {
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

// --- ROUTES ---

// Health
if ($path === '/' || $path === '/health') {
    jsonResponse([
        'status' => 'ok',
        'service' => 'multiserwis-szkolenia-api',
        'database' => 'sqlite',
        'smtpConfigured' => !empty($env['SMTP_PASS']),
        'timestamp' => gmdate('c'),
    ]);
}

// Auth: Login / Session
if (($path === '/auth/login' || $path === '/auth/session') && $method === 'POST') {
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $password = (string)($body['password'] ?? '');
    if ($email === '' || $password === '') {
        jsonResponse(['message' => 'Email i hasło są wymagane.'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || (!password_verify($password, $user['passwordHash']) && $password !== $user['passwordHash'])) {
        jsonResponse(['message' => 'Nieprawidłowy email lub hasło.'], 401);
    }

    unset($user['passwordHash']);
    $token = createJwt(['sub' => $user['id'], 'email' => $user['email'], 'role' => $user['role']], $jwtSecret);
    jsonResponse(['token' => $token, 'user' => $user]);
}

// Auth: Register (Strictly restricted to STUDENT and COMPANY_GUARDIAN)
if ($path === '/auth/register' && $method === 'POST') {
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $password = (string)($body['password'] ?? '');
    $name = trim((string)($body['name'] ?? $email));
    $phone = trim((string)($body['phone'] ?? ''));
    $company = trim((string)($body['company'] ?? ''));
    $requestedRole = strtoupper(trim((string)($body['role'] ?? 'STUDENT')));

    if ($requestedRole === 'ADMIN' || $requestedRole === 'MANAGER') {
        jsonResponse(['message' => 'Rejestracja kont administracyjnych i menedżerskich jest zablokowana.'], 403);
    }
    $role = ($requestedRole === 'COMPANY_GUARDIAN') ? 'COMPANY_GUARDIAN' : 'STUDENT';

    if ($email === '' || $password === '') {
        jsonResponse(['message' => 'Adres e-mail i hasło są wymagane.'], 400);
    }
    if (strlen($password) < 6) {
        jsonResponse(['message' => 'Hasło musi mieć co najmniej 6 znaków.'], 400);
    }
    if ($role === 'COMPANY_GUARDIAN' && $company === '') {
        jsonResponse(['message' => 'Nazwa firmy jest wymagana dla konta Opiekuna Firmy.'], 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['message' => 'Użytkownik o podanym adresie e-mail już istnieje.'], 409);
    }

    $id = uuid4();
    $now = gmdate('c');
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $companyVal = $company !== '' ? $company : null;

    $pdo->prepare("INSERT INTO users (id, email, passwordHash, name, phone, role, company, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        ->execute([$id, $email, $hash, $name, $phone, $role, $companyVal, $now, $now]);

    $user = [
        'id' => $id,
        'email' => $email,
        'name' => $name,
        'phone' => $phone,
        'role' => $role,
        'company' => $companyVal,
    ];
    $token = createJwt(['sub' => $id, 'email' => $email, 'role' => $role], $jwtSecret);

    $roleLabel = $role === 'COMPANY_GUARDIAN' ? 'Opiekun Firmy B2B' : 'Kursant';
    @sendSmtpMail(
        $env,
        $email,
        'Witamy na platformie szkoleniowej MultiSerwis',
        "<p>Dzień dobry <b>" . htmlspecialchars($name) . "</b>,</p>" .
        "<p>Twoje konto (rola: <b>{$roleLabel}</b>) na platformie szkoleniowej MultiSerwis zostało utworzone.</p>" .
        "<p>Przejdź do platformy: <a href='https://szkolenia.multiserwis.edu.pl'>https://szkolenia.multiserwis.edu.pl</a></p>"
    );

    jsonResponse(['token' => $token, 'user' => $user], 201);
}

// Auth: Me
if ($path === '/auth/me' && $method === 'GET') {
    $user = getAuthUser($pdo, $jwtSecret);
    if (!$user) jsonResponse(['message' => 'Unauthorized'], 401);
    jsonResponse(['user' => $user]);
}

// Courses: List & Create
if ($path === '/courses') {
    if ($method === 'GET') {
        $rows = $pdo->query("SELECT * FROM courses ORDER BY isPopular DESC, createdAt ASC")->fetchAll();
        foreach ($rows as &$r) {
            $r['isPopular'] = (bool)$r['isPopular'];
        }
        jsonResponse($rows);
    }
    if ($method === 'POST') {
        $id = $body['id'] ?? ('c_' . substr(uuid4(), 0, 8));
        $now = gmdate('c');
        $title = (string)($body['title'] ?? 'Nowe szkolenie');
        $category = (string)($body['category'] ?? 'UDT');
        $duration = (string)($body['duration'] ?? '24h');
        $price = (string)($body['price'] ?? '1000 PLN');
        $promoPrice = $body['promoPrice'] ?? null;
        $image = (string)($body['image'] ?? '/operator-wozki-widlowe.webp');
        $description = (string)($body['description'] ?? '');
        $status = (string)($body['status'] ?? 'published');

        $pdo->prepare("INSERT INTO courses (id, title, category, duration, price, promoPrice, image, isPopular, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)")
            ->execute([$id, $title, $category, $duration, $price, $promoPrice, $image, $description, $status, $now, $now]);

        $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch(), 201);
    }
}

// Courses: Single GET / PUT / DELETE
if (preg_match('#^/courses/([^/]+)$#', $path, $m)) {
    $courseId = urldecode($m[1]);
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
        $stmt->execute([$courseId]);
        $course = $stmt->fetch();
        if (!$course) jsonResponse(['message' => 'Course not found'], 404);
        $course['isPopular'] = (bool)$course['isPopular'];
        jsonResponse($course);
    }
    if ($method === 'PUT') {
        $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
        $stmt->execute([$courseId]);
        $existing = $stmt->fetch();
        $now = gmdate('c');
        if (!$existing) {
            $pdo->prepare("INSERT INTO courses (id, title, category, duration, price, promoPrice, image, isPopular, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)")
                ->execute([
                    $courseId,
                    $body['title'] ?? 'Szkolenie',
                    $body['category'] ?? 'UDT',
                    $body['duration'] ?? '24h',
                    $body['price'] ?? '1000 PLN',
                    $body['promoPrice'] ?? null,
                    $body['image'] ?? '/operator-wozki-widlowe.webp',
                    $body['description'] ?? '',
                    $body['status'] ?? 'published',
                    $now,
                    $now
                ]);
        } else {
            $pdo->prepare("UPDATE courses SET title = ?, category = ?, duration = ?, price = ?, promoPrice = ?, image = ?, description = ?, status = ?, updatedAt = ? WHERE id = ?")
                ->execute([
                    $body['title'] ?? $existing['title'],
                    $body['category'] ?? $existing['category'],
                    $body['duration'] ?? $existing['duration'],
                    $body['price'] ?? $existing['price'],
                    array_key_exists('promoPrice', $body) ? $body['promoPrice'] : $existing['promoPrice'],
                    $body['image'] ?? $existing['image'],
                    $body['description'] ?? $existing['description'],
                    $body['status'] ?? $existing['status'],
                    $now,
                    $courseId
                ]);
        }
        $stmt->execute([$courseId]);
        jsonResponse($stmt->fetch());
    }
    if ($method === 'DELETE') {
        $pdo->prepare("DELETE FROM courses WHERE id = ?")->execute([$courseId]);
        jsonResponse(['ok' => true]);
    }
}

// Users: List & Create
if ($path === '/users') {
    if ($method === 'GET') {
        $users = $pdo->query("SELECT id, email, name, phone, role, company, createdAt, updatedAt FROM users ORDER BY createdAt DESC")->fetchAll();
        $enrollments = $pdo->query("SELECT * FROM enrollments")->fetchAll();
        $enrByUser = [];
        foreach ($enrollments as $enr) {
            $enr['active'] = ($enr['status'] === 'ACTIVE');
            $enrByUser[$enr['userId']][] = $enr;
        }
        foreach ($users as &$u) {
            $u['enrollments'] = $enrByUser[$u['id']] ?? [];
        }
        jsonResponse($users);
    }
    if ($method === 'POST') {
        $email = strtolower(trim((string)($body['email'] ?? '')));
        if ($email === '') jsonResponse(['error' => 'Email jest wymagany'], 400);
        $id = uuid4();
        $now = gmdate('c');
        $name = trim((string)($body['name'] ?? $email));
        $phone = $body['phone'] ?? null;
        $role = $body['role'] ?? 'STUDENT';
        $company = $body['company'] ?? $body['companyId'] ?? null;
        $pass = password_hash((string)($body['password'] ?? $email), PASSWORD_BCRYPT);

        $pdo->prepare("INSERT INTO users (id, email, passwordHash, name, phone, role, company, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
            ->execute([$id, $email, $pass, $name, $phone, $role, $company, $now, $now]);

        jsonResponse(['id' => $id, 'email' => $email, 'name' => $name, 'phone' => $phone, 'role' => $role, 'company' => $company], 201);
    }
}

// Users: Enroll
if (preg_match('#^/users/([^/]+)/enroll$#', $path, $m) && $method === 'POST') {
    $userId = urldecode($m[1]);
    $courseId = (string)($body['courseId'] ?? 'c1');
    $id = uuid4();
    $now = gmdate('c');
    $pdo->prepare("INSERT OR REPLACE INTO enrollments (id, userId, courseId, status, progress, createdAt, updatedAt) VALUES (?, ?, ?, 'ACTIVE', 0, ?, ?)")
        ->execute([$id, $userId, $courseId, $now, $now]);
    jsonResponse(['id' => $id, 'userId' => $userId, 'courseId' => $courseId, 'status' => 'ACTIVE', 'progress' => 0], 201);
}

// Users: Single GET / PUT / DELETE
if (preg_match('#^/users/([^/]+)$#', $path, $m)) {
    $userId = urldecode($m[1]);
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT id, email, name, phone, role, company, createdAt, updatedAt FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $u = $stmt->fetch();
        if (!$u) jsonResponse(['message' => 'Not found'], 404);
        jsonResponse($u);
    }
    if ($method === 'PUT') {
        $now = gmdate('c');
        $pdo->prepare("UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), role = COALESCE(?, role), company = COALESCE(?, company), updatedAt = ? WHERE id = ?")
            ->execute([$body['name'] ?? null, $body['phone'] ?? null, $body['role'] ?? null, $body['company'] ?? null, $now, $userId]);
        $stmt = $pdo->prepare("SELECT id, email, name, phone, role, company, createdAt, updatedAt FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        jsonResponse($stmt->fetch());
    }
    if ($method === 'DELETE') {
        $pdo->prepare("DELETE FROM enrollments WHERE userId = ?")->execute([$userId]);
        $pdo->prepare("DELETE FROM users WHERE id = ? OR LOWER(email) = LOWER(?)")->execute([$userId, $userId]);
        jsonResponse(['ok' => true]);
    }
}

// Orders
if ($path === '/orders' || $path === '/orders/me') {
    if ($method === 'GET') {
        $rows = $pdo->query("SELECT * FROM orders ORDER BY createdAt DESC")->fetchAll();
        jsonResponse($rows);
    }
    if ($method === 'POST') {
        $id = 'ord_' . substr(uuid4(), 0, 8);
        $now = gmdate('c');
        $userId = (string)($body['userId'] ?? 'u3');
        $courseId = (string)($body['courseId'] ?? 'c1');
        $amount = (int)($body['amount'] ?? 1000);
        $provider = (string)($body['provider'] ?? 'online');
        $pdo->prepare("INSERT INTO orders (id, userId, courseId, amount, currency, provider, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'PLN', ?, 'PENDING_PAYMENT', ?, ?)")
            ->execute([$id, $userId, $courseId, $amount, $provider, $now, $now]);
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch(), 201);
    }
}

if (preg_match('#^/orders/([^/]+)/status$#', $path, $m) && $method === 'PATCH') {
    $orderId = urldecode($m[1]);
    $status = (string)($body['status'] ?? 'PAID');
    $pdo->prepare("UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?")->execute([$status, gmdate('c'), $orderId]);
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    jsonResponse($stmt->fetch());
}

// Progress
if ($path === '/progress') {
    $user = getAuthUser($pdo, $jwtSecret);
    $userId = $user['id'] ?? 'u3';
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT * FROM lesson_progress WHERE userId = ?");
        $stmt->execute([$userId]);
        jsonResponse($stmt->fetchAll());
    }
    if ($method === 'POST') {
        $lessonId = (string)($body['lessonId'] ?? 'l1');
        $completed = !empty($body['completed']) ? 1 : 0;
        $score = isset($body['score']) ? (int)$body['score'] : null;
        $stoppedAt = (int)($body['stoppedAt'] ?? 0);
        $watchTime = (int)($body['watchTime'] ?? 0);
        $now = gmdate('c');
        $id = uuid4();
        $pdo->prepare("INSERT OR REPLACE INTO lesson_progress (id, userId, lessonId, completed, score, stoppedAt, watchTime, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
            ->execute([$id, $userId, $lessonId, $completed, $score, $stoppedAt, $watchTime, $now]);
        jsonResponse(['id' => $id, 'userId' => $userId, 'lessonId' => $lessonId, 'completed' => (bool)$completed]);
    }
}

// Questions
if ($path === '/questions') {
    if ($method === 'GET') {
        $courseId = $_GET['courseId'] ?? null;
        if ($courseId) {
            $stmt = $pdo->prepare("SELECT * FROM questions WHERE courseId = ?");
            $stmt->execute([$courseId]);
            $rows = $stmt->fetchAll();
        } else {
            $rows = $pdo->query("SELECT * FROM questions")->fetchAll();
        }
        foreach ($rows as &$r) {
            $r['answers'] = json_decode($r['answersJson'] ?? '[]', true);
        }
        jsonResponse($rows);
    }
    if ($method === 'POST') {
        $id = uuid4();
        $now = gmdate('c');
        $pdo->prepare("INSERT INTO questions (id, courseId, moduleId, content, type, difficulty, answersJson, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
            ->execute([
                $id,
                $body['courseId'] ?? 'c1',
                $body['moduleId'] ?? null,
                $body['content'] ?? '',
                $body['type'] ?? 'SINGLE_CHOICE',
                $body['difficulty'] ?? 'MEDIUM',
                json_encode($body['answers'] ?? []),
                $now,
            ]);
        jsonResponse(['id' => $id] + $body, 201);
    }
}

if ($path === '/questions/generate' && $method === 'POST') {
    jsonResponse([]);
}

// Analytics
if ($path === '/analytics' && $method === 'GET') {
    jsonResponse([
        'totalStudents' => (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'STUDENT'")->fetchColumn(),
        'totalCourses' => (int)$pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn(),
        'activeEnrollments' => (int)$pdo->query("SELECT COUNT(*) FROM enrollments WHERE status = 'ACTIVE'")->fetchColumn(),
        'completionRate' => 98,
    ]);
}

// Tickets
if ($path === '/tickets') {
    if ($method === 'GET') {
        $rows = $pdo->query("SELECT * FROM tickets ORDER BY createdAt DESC")->fetchAll();
        jsonResponse($rows);
    }
    if ($method === 'POST') {
        $user = getAuthUser($pdo, $jwtSecret);
        $userId = $user['id'] ?? 'u3';
        $id = 'tck_' . substr(uuid4(), 0, 8);
        $now = gmdate('c');
        $subject = (string)($body['subject'] ?? 'Zgłoszenie');
        $category = (string)($body['category'] ?? 'GENERAL');
        $content = (string)($body['content'] ?? '');
        $pdo->prepare("INSERT INTO tickets (id, userId, subject, category, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'OPEN', ?, ?)")
            ->execute([$id, $userId, $subject, $category, $now, $now]);
        if ($content !== '') {
            $pdo->prepare("INSERT INTO ticket_messages (id, ticketId, senderId, content, isInternal, createdAt) VALUES (?, ?, ?, ?, 0, ?)")
                ->execute([uuid4(), $id, $userId, $content, $now]);
            @sendSmtpMail($env, 'biuro@multiserwis.edu.pl', "Nowe zgłoszenie: {$subject}", "<p>Kategoria: {$category}</p><p>" . nl2br(htmlspecialchars($content)) . "</p>");
        }
        jsonResponse(['id' => $id, 'subject' => $subject, 'category' => $category, 'status' => 'OPEN', 'createdAt' => $now], 201);
    }
}

// Contact / Lead endpoint (saves to SQLite inquiries + sends email via biuro@multiserwis.edu.pl)
if ($path === '/contact' && $method === 'POST') {
    $name = trim((string)($body['name'] ?? 'Klient'));
    $email = trim((string)($body['email'] ?? ''));
    $phone = trim((string)($body['phone'] ?? ''));
    $message = trim((string)($body['message'] ?? ''));
    $subject = "Zapytanie ze strony multiserwis.edu.pl od: {$name}";

    // 1. Save lead into SQLite database so no submission is ever lost
    $inqId = 'inq_' . substr(uuid4(), 0, 8);
    $now = gmdate('c');
    try {
        $stmtInq = $pdo->prepare("INSERT INTO inquiries (id, name, email, phone, subject, message, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, 'NEW', ?)");
        $stmtInq->execute([$inqId, $name, $email, $phone, $subject, $message, $now]);
    } catch (Throwable) {
        // Silently continue if DB write fails
    }

    // 2. Send email notification via SMTP to client's primary inbox & domain mailbox
    $html = "<h3>Nowe zapytanie ze strony MultiSerwis Szkolenia</h3>"
          . "<p><b>Imię i nazwisko / Firma:</b> " . htmlspecialchars($name) . "</p>"
          . "<p><b>Telefon:</b> " . htmlspecialchars($phone) . "</p>"
          . "<p><b>E-mail:</b> " . htmlspecialchars($email) . "</p>"
          . "<p><b>Treść wiadomości:</b><br>" . nl2br(htmlspecialchars($message)) . "</p>";
    $targetEmail = $env['NOTIFICATION_EMAIL'] ?? 'multiserwis.kutno@gmail.com';
    $sent = @sendSmtpMail($env, $targetEmail, $subject, $html);
    if ($targetEmail !== 'biuro@multiserwis.edu.pl') {
        @sendSmtpMail($env, 'biuro@multiserwis.edu.pl', $subject, $html);
    }
    jsonResponse(['ok' => true, 'id' => $inqId, 'sent' => $sent]);
}

if ($path === '/inquiries' && $method === 'GET') {
    $rows = $pdo->query("SELECT * FROM inquiries ORDER BY createdAt DESC")->fetchAll();
    jsonResponse($rows);
}

jsonResponse(['error' => 'Not found', 'path' => $path], 404);
