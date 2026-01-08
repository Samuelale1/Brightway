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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ------------- PUBLIC ROUTES ------------------
Route::get('/products', [ProductController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
  


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

    // DELIVERY
    Route::get('/delivery-persons', [DeliveryPersonController::class, 'index']);   
    Route::post('/delivery-persons', [DeliveryPersonController::class, 'store']);

    // REPORTS
    Route::prefix('reports')->group(function () {
        Route::get('/overview', [ReportsController::class, 'overview']);
        Route::get('/top-products', [ReportsController::class, 'topProducts']);
        Route::get('/daily-revenue', [ReportsController::class, 'dailyRevenue']);
        Route::get('/staff-performance', [ReportsController::class, 'staffPerformance']);
    });
});


