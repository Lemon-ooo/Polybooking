<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Web\TourController;

/*
|--------------------------------------------------------------------------
| Public Authentication
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Public CRUD API (không cần đăng nhập)
|--------------------------------------------------------------------------
*/

// Phòng
Route::apiResource('rooms', RoomController::class);

// Loại phòng
Route::apiResource('room-types', RoomTypeController::class);

// Tiện nghi
Route::apiResource('amenities', AmenityController::class);

// Dịch vụ
Route::apiResource('services', ServiceController::class);


// Thư viện ảnh (gallery)
Route::apiResource('galleries', GalleryController::class);
// Sự kiện (Events)
Route::apiResource('events', EventController::class);

//Tour
Route::apiResource('tours', TourController::class);
