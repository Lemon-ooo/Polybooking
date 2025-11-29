<?php

namespace App\Http\Controllers\Api;

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
use App\Http\Controllers\Web\RoomTypeImageController;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Http\Request;


Route::apiResource('amenities', AmenityController::class);
// Route::apiResource('bookings', BookingController::class);


// Booking API



Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::put('/bookings/{booking}/assign-rooms', [BookingController::class, 'assignRooms']);
Route::put('/bookings/{booking}/add-services', [BookingController::class, 'addServices']);
Route::put('/bookings/{booking}/add-penalties', [BookingController::class, 'addPenalties']);
Route::put('/bookings/{booking}/confirm-payment', [BookingController::class, 'confirmPayment']);

Route::apiResource('events', EventController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('room-typeimages', RoomTypeImageController::class);
Route::apiResource('services', ServiceController::class);
