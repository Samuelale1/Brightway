<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SalespersonController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DeliveryPersonController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ------------- PUBLIC ROUTES ------------------
Route::get('/products', [ProductController::class, 'index']);
 // Publicly create show route just in case


// Paystack Webhook (must be public, no auth)
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);


// ------------- PROTECTED ROUTES ------------------
Route::middleware('auth:api')->group(function () {

    // PROFILE
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    // ADMIN USER MANAGEMENT
    Route::get('/admin/dashboard', [AdminController::class, 'dashboardStats']);
    Route::get('/admin/users', [UserController::class, 'allUsers']);
    Route::get('/admin/users-count', [UserController::class, 'userCounts']);
    Route::put('/admin/users/{id}/role', [UserController::class, 'updateRole']);
    Route::put('/admin/users/{id}/toggle', [UserController::class, 'toggleStatus']);
    Route::put('/admin/users/{id}/reset-password', [UserController::class, 'resetPassword']);
    Route::delete('/admin/users/{id}', [UserController::class, 'deleteUser']);

    // SALES
    Route::get('/sales/orders', [SalespersonController::class, 'getOrders']);
    Route::post('/sales/order/{id}', [SalespersonController::class, 'treatOrder']);

    // ORDERS
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{id}/assign-delivery', [OrderController::class, 'assignDelivery']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::put('/orders/{id}/confirm-payment', [OrderController::class, 'confirmPayment']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // DELIVERY
    Route::get('/delivery-persons', [DeliveryPersonController::class, 'index']);   
    Route::post('/delivery-persons', [DeliveryPersonController::class, 'store']);

    // PAYMENTS
    Route::prefix('payments')->group(function () {
        Route::post('/initialize', [PaymentController::class, 'initialize']);
        Route::get('/verify', [PaymentController::class, 'verify']);
    });

    // REPORTS
    Route::prefix('reports')->group(function () {
        Route::get('/overview', [ReportsController::class, 'overview']);
        Route::get('/top-products', [ReportsController::class, 'topProducts']);
        Route::get('/daily-revenue', [ReportsController::class, 'dailyRevenue']);
        Route::get('/staff-performance', [ReportsController::class, 'staffPerformance']);
    });

    // PRODUCTS
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/{id}', [ProductController::class, 'update']); // Fix for 405 on multipart/form-data update
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});


