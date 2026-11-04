<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/**
 * MultiSerwis Kutno — Laravel 13 API Gateway Wrapper
 * Bootstraps the central Laravel 13 + Filament 5 backend for /api/* requests
 * on multiserwis.edu.pl and szkolenia.multiserwis.edu.pl (shared SEOHost filesystem).
 */
$candidates = [
    '/home/srv127364/domains/panel.multiserwis.edu.pl/backend',
    dirname(__DIR__, 2) . '/backend',
    dirname(__DIR__, 3) . '/backend',
];

$backendBase = null;
foreach ($candidates as $candidate) {
    if (is_file($candidate . '/bootstrap/app.php') && is_file($candidate . '/vendor/autoload.php')) {
        $backendBase = $candidate;
        break;
    }
}

if ($backendBase === null) {
    http_response_code(503);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['message' => 'Backend Laravel 13 jest chwilowo niedostępny.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (file_exists($maintenance = $backendBase . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Normalize SCRIPT_NAME and PHP_SELF so Symfony Request does not strip `/api` as basePath
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
if (isset($_SERVER['SCRIPT_FILENAME'])) {
    $_SERVER['SCRIPT_FILENAME'] = dirname(__DIR__) . '/index.php';
}

require $backendBase . '/vendor/autoload.php';

/** @var Application $app */
$app = require_once $backendBase . '/bootstrap/app.php';

$app->handleRequest(Request::capture());
