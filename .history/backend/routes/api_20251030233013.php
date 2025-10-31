<?php

use App\Http\Controllers\Api\RoomController; // ✅ Thêm \Api
use Illuminate\Support\Facades\Route;

Route::apiResource('rooms', RoomController::class);
Route::get('/room-types', [RoomController::class, 'getRoomTypes']);
Route::get('/amenities', [RoomController::class, 'getAmenities']);