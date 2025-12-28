<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AmenityController, AuthController, BookingController, EventController, 
    GalleryController, RoomController, RoomImageController, RoomTypeController,
    RoomTypeImageController, ServiceController, ProfileController,
    ChatbotController, DashboardController
};

Route::middleware('auth:sanctum')->get('/bookings/my', [BookingController::class, 'myBookings']);

// CRUD chính
Route::apiResource('amenities', AmenityController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('roomtypeimages', RoomTypeImageController::class);
Route::apiResource('services', ServiceController::class);

// Room type image custom
Route::post('room-types/{id}/images', [RoomTypeImageController::class, 'store']);
Route::delete('room-types/{roomTypeId}/images/{imageId}', [RoomTypeImageController::class, 'destroy']);
Route::delete('room-types/{roomTypeId}/main-image', [RoomTypeImageController::class, 'destroyMainImage']);

// Auth
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Profile
Route::middleware('auth:sanctum')->prefix('client')->group(function () {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::delete('profile', [ProfileController::class, 'destroy']);
});

// Chatbot
Route::post('chatbot', [ChatbotController::class, 'handle']);

// EVENTS (PUBLIC)
Route::get('public/events', [EventController::class, 'publicIndex']);
Route::get('public/events/{id}', [EventController::class, 'publicShow']);

// EVENTS (ADMIN)
Route::prefix('admin')->group(function () {
    Route::apiResource('events', EventController::class);
    Route::patch('events/{id}/toggle', [EventController::class, 'toggleStatus']);
});

// Dashboard
Route::get('admin/dashboard', [DashboardController::class, 'stats']);
