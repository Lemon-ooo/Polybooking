<?php

use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomImageController;
use App\Http\Controllers\Api\RoomTypeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ProfileController;

Route::apiResource('amenities', AmenityController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('poly.rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('room-types', RoomTypeController::class);
// Route::apiResource('roomtype-images/{roomType}', RoomTypeImageController::class);
Route::apiResource('services', ServiceController::class);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
// Quên mật khẩu
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Profile routes
Route::get('profile', [ProfileController::class, 'show']);
Route::put('profile', [ProfileController::class, 'update']);
Route::put('profile/password', [ProfileController::class, 'updatePassword']);
Route::delete('profile', [ProfileController::class, 'destroy']);


Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::put('/bookings/{booking}/assign-rooms', [BookingController::class, 'assignRooms']);
Route::put('/bookings/{booking}/add-services', [BookingController::class, 'addServices']);
Route::put('/bookings/{booking}/add-penalties', [BookingController::class, 'addPenalties']);
Route::put('/bookings/{booking}/confirm-payment', [BookingController::class, 'confirmPayment']);