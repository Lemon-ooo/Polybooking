<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomImageController; // thêm controller ảnh phòng

// 🔐 Public Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 👀 Public routes (read-only)
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

Route::get('/room-types', [RoomTypeController::class, 'index']);
Route::get('/room-types/{room_type}', [RoomTypeController::class, 'show']);

Route::get('/amenities', [AmenityController::class, 'index']);
Route::get('/amenities/{amenity}', [AmenityController::class, 'show']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);

// 👤 Authenticated routes (Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-role', [AuthController::class, 'checkRole']);

    // 🔒 Client-only routes (guard sanctum)
    Route::middleware('role:client,sanctum')->group(function () {
        Route::post('/rooms/{room}/book', [RoomController::class, 'book']);
        Route::get('/my-bookings', [RoomController::class, 'myBookings']);
        Route::post('/services/{service}/order', [ServiceController::class, 'order']);
    });

    // 👑 Admin-only routes (guard sanctum)
    Route::middleware('role:admin,sanctum')->group(function () {
        // Quản lý phòng
        Route::apiResource('rooms', RoomController::class)->except(['index', 'show']);

        // Quản lý loại phòng
        Route::apiResource('room-types', RoomTypeController::class)->except(['index', 'show']);

        // Quản lý tiện nghi
        Route::apiResource('amenities', AmenityController::class)->except(['index', 'show']);

        // Quản lý dịch vụ
        Route::apiResource('services', ServiceController::class)->except(['index', 'show']);

        // 📷 Quản lý ảnh phòng (index/store/destroy/destroyAll)
        Route::get   ('/rooms/{room}/images',                [RoomImageController::class, 'index']);
        Route::post  ('/rooms/{room}/images',                [RoomImageController::class, 'store']);
        Route::delete('/rooms/{room}/images/{image}',        [RoomImageController::class, 'destroy']);     // xoá 1 ảnh
        Route::delete('/rooms/{room}/images',                [RoomImageController::class, 'destroyAll']);  // xoá tất cả ảnh

        // Thống kê admin
        Route::get('/admin/stats', [AuthController::class, 'getAdminStats']);
    });
});
