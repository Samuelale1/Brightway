<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalespersonController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DeliveryPersonController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\ProfileController;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/sales/orders', [SalespersonController::class, 'getOrders']);
Route::post('/sales/order/{id}', [SalespersonController::class, 'treatOrder']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/sales/notifications', [SalespersonController::class, 'getNotifications']);
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}/assign-delivery', [OrderController::class, 'assignDelivery']);
Route::get('/user/{id}/orders', [OrderController::class, 'userOrders']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::get('/delivery-persons', [DeliveryPersonController::class, 'index']);
Route::post('/delivery-persons', [DeliveryPersonController::class, 'store']);
Route::put('/orders/{id}/confirm-payment', [OrderController::class, 'confirmPayment']);
Route::put('/orders/{id}/assign-delivery', [OrderController::class, 'assignDelivery']);
Route::prefix('reports')->group(function () {
    Route::get('/overview', [ReportsController::class, 'overview']);
    Route::get('/top-products', [ReportsController::class, 'topProducts']);
    Route::get('/daily-revenue', [ReportsController::class, 'dailyRevenue']);
    Route::get('/staff-performance', [ReportsController::class, 'staffPerformance']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);
});


