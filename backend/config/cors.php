<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'https://nv3lvt5j-5173.uks1.devtunnels.ms/',
        'http://127.0.0.1:5173', 
        'http://localhost:8000',
        'https://nv3lvt5j-8000.uks1.devtunnels.ms/',
        'http://127.0.0.1:8000', 
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
