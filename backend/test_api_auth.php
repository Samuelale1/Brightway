<?php

use Illuminate\Http\Request;
use Illuminate\Contracts\Http\Kernel;

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$app->make(Kernel::class)->bootstrap();

// Simulate a request to a protected API route without a token
$request = Request::create('/api/profile', 'GET');
$request->headers->set('Accept', 'application/json');

$response = $app->handle($request);

echo "Status Code: " . $response->getStatusCode() . PHP_EOL;
echo "Content: " . $response->getContent() . PHP_EOL;

if ($response->getStatusCode() === 401 && str_contains($response->getContent(), 'Unauthenticated')) {
    echo "SUCCESS: API returned 401 JSON as expected." . PHP_EOL;
} else {
    echo "FAILURE: API did not return expected 401 JSON." . PHP_EOL;
}
