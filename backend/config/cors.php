<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://multiserwis.edu.pl',
        'https://www.multiserwis.edu.pl',
        'https://szkolenia.multiserwis.edu.pl',
        'https://panel.multiserwis.edu.pl',
        'http://localhost:4321',
        'http://localhost:5173',
        'http://127.0.0.1:4321',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [
        '#^https?://([a-z0-9-]+\.)?multiserwis\.(edu\.pl|tech)(:\d+)?$#i',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,

];
