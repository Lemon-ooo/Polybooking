<?php

use App\Http\Controllers\Api\AdminCheckinController;
use App\Http\Controllers\Api\AdminCheckoutController;
use App\Http\Controllers\Api\AdminPenaltyController;
use App\Http\Controllers\Api\AdminServiceController;
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
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentController;

Route::get('/bookings/my', [BookingController::class, 'myBookings'])->middleware('auth:sanctum');

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


/* =========================================================
| BOOKING – CUSTOMER
========================================================= */

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
});
Route::get('my/bookings',             [BookingController::class, 'myBookings'])->middleware('auth:sanctum');
Route::get('bookings/{id}',           [BookingController::class, 'show'])->middleware('auth:sanctum');
Route::post('bookings/{id}/cancel',   [BookingController::class, 'cancel'])->middleware('auth:sanctum');


/* =========================================================
| PAYMENT – VNPAY
========================================================= */

Route::post('payments/vnpay/create',   [PaymentController::class, 'createVnpay'])->middleware('auth:sanctum');
Route::get('payments/vnpay/callback',  [PaymentController::class, 'vnpayCallback']);


/* =========================================================
| ADMIN – CHECK-IN
========================================================= */

Route::post(
    'admin/bookings/{id}/checkin',
    [AdminCheckinController::class, 'checkin']
)->middleware('auth:sanctum');


/* =========================================================
| ADMIN – SERVICE (DỊCH VỤ PHÁT SINH)
========================================================= */

Route::post(
    'bookings/{id}/services',
    [AdminServiceController::class, 'addService']
)->middleware('auth:sanctum');


/* =========================================================
| ADMIN – PENALTY (HƯ HỎNG / PHẠT)
========================================================= */

Route::post(
    'bookings/{id}/penalties',
    [AdminPenaltyController::class, 'addPenalty']
)->middleware('auth:sanctum');


/* =========================================================
| ADMIN – CHECK-OUT (FINAL ACCOUNTING)
========================================================= */

Route::post(
    'bookings/{id}/checkout',
    [AdminCheckoutController::class, 'checkout']
)->middleware('auth:sanctum');

//chatbot
Route::post('/chatbot', [ChatbotController::class, 'handle']);

Route::get('/admin/dashboard', [DashboardController::class, 'stats']);