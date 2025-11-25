<?php

use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\RoomController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;


Route::apiResource('amenities', AmenityController::class);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', GalleryController::class);
Route::apiResource('room-types', GalleryController::class);
Route::apiResource('roomtypeimages', GalleryController::class);
Route::apiResource('services', GalleryController::class);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');