<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\RoomController; // ✅ Thêm \Api


Route::apiResource('rooms', RoomController::class);
Route::get('/room-types', [RoomController::class, 'getRoomTypes']);
Route::get('/amenities', [RoomController::class, 'getAmenities']);
Route::apiResource('services', ServiceController::class);
// RoomType routes
Route::apiResource('room-types', RoomTypeController::class);
// Amenity routes
Route::apiResource('amenities', AmenityController::class);




// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Các route yêu cầu đăng nhập
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});