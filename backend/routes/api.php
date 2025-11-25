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
use App\Http\Controllers\Web\RoomTypeImageController;

Route::apiResource('amenities', AmenityController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('poly.rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('roomtype-images/{roomType}', RoomTypeImageController::class);
Route::apiResource('services', ServiceController::class);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');