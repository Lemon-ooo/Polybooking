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
use App\Http\Controllers\Api\RoomTypeImageController;

Route::apiResource('amenities', AmenityController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('roomtypeimages', RoomTypeImageController::class);
Route::post('room-types/{id}/images', [RoomTypeImageController::class, 'store']);
Route::delete('room-types/{roomTypeId}/images/{imageId}', [RoomTypeImageController::class, 'destroy']);
Route::delete('/room-types/{roomTypeId}/main-image', [RoomTypeImageController::class, 'destroyMainImage']);

Route::apiResource('services', ServiceController::class);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');