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

// 👀 Public routes xem dữ liệu
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);
Route::get('/room-types', [RoomTypeController::class, 'index']); // ✅ Sửa thành RoomTypeController
Route::get('/amenities', [AmenityController::class, 'index']); // ✅ Sửa thành AmenityController
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/room-types/{room_type}', [RoomTypeController::class, 'show']);
Route::get('/amenities/{amenity}', [AmenityController::class, 'show']);

// ❌ REMOVE các route trùng lặp
// Route::get('/room-types', [RoomController::class, 'getRoomTypes']); // ❌ Trùng
// Route::get('/amenities', [RoomController::class, 'getAmenities']); // ❌ Trùng

// 👤 Common authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-role', [AuthController::class, 'checkRole']);
    
    // 🔒 Client-only routes
    Route::middleware('role:client')->group(function () {
        Route::post('/rooms/{room}/book', [RoomController::class, 'book']);
        Route::get('/my-bookings', [RoomController::class, 'myBookings']);
        Route::post('/services/{service}/order', [ServiceController::class, 'order']);
    });

    // 👑 Admin-only routes
    Route::middleware('role:admin')->group(function () {
        // Quản lý phòng
        Route::apiResource('rooms', RoomController::class)->except(['index', 'show']); // ✅ Dùng apiResource
        
        // Quản lý dịch vụ
        Route::apiResource('services', ServiceController::class)->except(['index', 'show']);
        
        // Quản lý loại phòng
        Route::apiResource('room-types', RoomTypeController::class)->except(['index', 'show']);
        
        // Quản lý tiện nghi
        Route::apiResource('amenities', AmenityController::class)->except(['index', 'show']);
        
        // Thống kê admin
        Route::get('/admin/stats', [AuthController::class, 'getAdminStats']);
    });
});