<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(dirname(__DIR__))
    ->withRouting(
        null,
        __DIR__.'/../routes/web.php',
        __DIR__.'/../routes/api.php',
        __DIR__.'/../routes/console.php',
        '/up'
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();