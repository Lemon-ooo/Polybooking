<?php

use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
// use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomImageController;
use App\Http\Controllers\Api\RoomTypeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RoomTypeImageController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;

Route::get('/bookings/my', [BookingController::class, 'myBookings'])->middleware('auth:sanctum');

Route::apiResource('amenities', AmenityController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('roomtypeimages', RoomTypeImageController::class);
Route::apiResource('users', UserController::class);
// USER
Route::post('/chat/send', [ChatController::class, 'sendMessage']);
// ADMIN
Route::get('/chat', [ChatController::class, 'list']);
Route::get('/chat/{id}', [ChatController::class, 'show']);
Route::post('/chat/{id}/reply', [ChatController::class, 'reply']);
Route::post('room-types/{id}/images', [RoomTypeImageController::class, 'store']);
Route::delete('room-types/{roomTypeId}/images/{imageId}', [RoomTypeImageController::class, 'destroy']);
Route::delete('/room-types/{roomTypeId}/main-image', [RoomTypeImageController::class, 'destroyMainImage']);

// Route::apiResource('roomtype-images/{roomType}', RoomTypeImageController::class);
Route::apiResource('services', ServiceController::class);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
// Quên mật khẩu
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Profile routes
// routes/api.php
Route::middleware('auth:sanctum')->prefix('client')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']); // quan trọng
    Route::delete('/profile', [ProfileController::class, 'destroy']);
});


Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::put('/bookings/{booking}/assign-rooms', [BookingController::class, 'assignRooms']);
Route::put('/bookings/{booking}/add-services', [BookingController::class, 'addServices']);
Route::put('/bookings/{booking}/add-penalties', [BookingController::class, 'addPenalties']);
Route::put('/bookings/{booking}/confirm-payment', [BookingController::class, 'confirmPayment']);

//chatbot
Route::post('/chatbot', [ChatbotController::class, 'handle']);

Route::get('/admin/dashboard', [DashboardController::class, 'stats']);