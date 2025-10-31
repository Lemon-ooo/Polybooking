<?php

use App\Http\Controllers\Api\RoomController; // ✅ Thêm \Api
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::apiResource('rooms', RoomController::class);
Route::get('/room-types', [RoomController::class, 'getRoomTypes']);
Route::get('/amenities', [RoomController::class, 'getAmenities']);
Route::apiResource('services', ServiceController::class);