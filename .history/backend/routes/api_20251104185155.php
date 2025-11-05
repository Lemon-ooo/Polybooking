<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\RoomController;

// 🔐 Public Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 👀 Public routes xem dữ liệu (cho cả khách chưa đăng nhập)
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);
Route::get('/room-types', [RoomController::class, 'getRoomTypes']);
Route::get('/amenities', [RoomController::class, 'getAmenities']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/room-types', [RoomTypeController::class, 'index']);
Route::get('/room-types/{room_type}', [RoomTypeController::class, 'show']);
Route::get('/amenities', [AmenityController::class, 'index']);
Route::get('/amenities/{amenity}', [AmenityController::class, 'show']);

// 👤 Common authenticated routes (cả admin và client đều dùng được)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-role', [AuthController::class, 'checkRole']);
    
    // 🔒 Client-only routes
    Route::middleware('client')->group(function () {
        // Các route đặt phòng, đặt dịch vụ cho client
        Route::post('/rooms/{room}/book', [RoomController::class, 'book']);
        Route::get('/my-bookings', [RoomController::class, 'myBookings']);
        Route::post('/services/{service}/order', [ServiceController::class, 'order']);
    });

    // 👑 Admin-only routes
    Route::middleware('admin')->group(function () {
        // Quản lý phòng
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{room}', [RoomController::class, 'update']);
        Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);
        
        // Quản lý dịch vụ
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{service}', [ServiceController::class, 'update']);
        Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
        
        // Quản lý loại phòng
        Route::post('/room-types', [RoomTypeController::class, 'store']);
        Route::put('/room-types/{room_type}', [RoomTypeController::class, 'update']);
        Route::delete('/room-types/{room_type}', [RoomTypeController::class, 'destroy']);
        
        // Quản lý tiện nghi
        Route::post('/amenities', [AmenityController::class, 'store']);
        Route::put('/amenities/{amenity}', [AmenityController::class, 'update']);
        Route::delete('/amenities/{amenity}', [AmenityController::class, 'destroy']);
        
        // Thống kê admin
        Route::get('/admin/stats', [AuthController::class, 'getAdminStats']);
    });
});