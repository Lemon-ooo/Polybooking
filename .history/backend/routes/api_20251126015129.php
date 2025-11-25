<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;

// /api/user (mặc định của Laravel nếu dùng Sanctum)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Prefix v1 cho API
    // Catalog: room types, rooms, amenities, services
    Route::get('/room-types',        [RoomTypeController::class, 'index']);
    Route::get('/room-types/{id}',   [RoomTypeController::class, 'show']);

    Route::get('/rooms',             [RoomController::class, 'index']);
    Route::get('/rooms/{id}',        [RoomController::class, 'show']);

    Route::get('/amenities',         [AmenityController::class, 'index']);
    Route::get('/amenities/{id}',    [AmenityController::class, 'show']);

    Route::get('/services',          [ServiceController::class, 'index']);
    Route::get('/services/{id}',     [ServiceController::class, 'show']);

    // Các route quản trị (có thể gắn middleware is_admin sau này)

    Route::post('/room-types',           [RoomTypeController::class, 'store']);
    Route::put('/room-types/{id}',       [RoomTypeController::class, 'update']);
    Route::patch('/room-types/{id}',     [RoomTypeController::class, 'update']);
    Route::delete('/room-types/{id}',    [RoomTypeController::class, 'destroy']);

    Route::post('/rooms',                [RoomController::class, 'store']);
    Route::put('/rooms/{id}',            [RoomController::class, 'update']);
    Route::patch('/rooms/{id}',          [RoomController::class, 'update']);
    Route::delete('/rooms/{id}',         [RoomController::class, 'destroy']);

    Route::post('/amenities',            [AmenityController::class, 'store']);
    Route::put('/amenities/{id}',        [AmenityController::class, 'update']);
    Route::patch('/amenities/{id}',      [AmenityController::class, 'update']);
    Route::delete('/amenities/{id}',     [AmenityController::class, 'destroy']);

    Route::post('/services',             [ServiceController::class, 'store']);
    Route::put('/services/{id}',         [ServiceController::class, 'update']);
    Route::patch('/services/{id}',       [ServiceController::class, 'update']);
    Route::delete('/services/{id}',      [ServiceController::class, 'destroy']);

    // Booking API cho customer (cần đăng nhập)
    Route::get('/bookings',              [BookingController::class, 'index']);
    Route::post('/bookings',             [BookingController::class, 'store']);
    Route::get('/bookings/{id}',         [BookingController::class, 'show']);
Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);


    // không cần login
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/forgot-password',    [AuthController::class, 'handleForgot']);


    // cần token Sanctum

    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get('/me',               [AuthController::class, 'me']);
    Route::put('/me',               [AuthController::class, 'updateProfile']);
    Route::patch('/me',             [AuthController::class, 'updateProfile']);
    // Route::post('/change-password', [AuthController::class, 'changePassword'])