<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalespersonController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DeliveryPersonController;

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
