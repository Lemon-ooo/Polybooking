<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API ROUTES – POLYSTAY (FLAT, NO GROUP)
|--------------------------------------------------------------------------
| Thuần API – không group – không prefix – dễ debug
|--------------------------------------------------------------------------
*/

/* =========================================================
| USE CONTROLLERS
========================================================= */

use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomImageController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RoomTypeImageController;
use App\Http\Controllers\Api\ProfileController;

/* PAYMENT */
use App\Http\Controllers\Api\PaymentController;

/* ADMIN */
use App\Http\Controllers\Api\AdminCheckinController;
use App\Http\Controllers\Api\AdminServiceController;
use App\Http\Controllers\Api\AdminPenaltyController;
use App\Http\Controllers\Api\AdminCheckoutController;


/* =========================================================
| AUTH
========================================================= */

Route::post('login',    [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Quên mật khẩu
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);


/* =========================================================
| PROFILE
========================================================= */

Route::get('profile',              [ProfileController::class, 'show'])->middleware('auth:sanctum');
Route::put('profile',              [ProfileController::class, 'update'])->middleware('auth:sanctum');
Route::put('profile/password',     [ProfileController::class, 'updatePassword'])->middleware('auth:sanctum');
Route::delete('profile',            [ProfileController::class, 'destroy'])->middleware('auth:sanctum');


/* =========================================================
| MASTER DATA
========================================================= */

Route::apiResource('amenities', AmenityController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('services', ServiceController::class);


/* =========================================================
| ROOMS & ROOM TYPES
========================================================= */

Route::apiResource('rooms', RoomController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('roomtypeimages', RoomTypeImageController::class);

// RoomType Images (custom)
Route::post('room-types/{id}/images', [RoomTypeImageController::class, 'store']);
Route::delete('room-types/{roomTypeId}/images/{imageId}', [RoomTypeImageController::class, 'destroy']);
Route::delete('room-types/{roomTypeId}/main-image', [RoomTypeImageController::class, 'destroyMainImage']);


/* =========================================================
| GALLERY
========================================================= */

Route::apiResource('galleries', GalleryController::class);


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
    'admin/bookings/{id}/services',
    [AdminServiceController::class, 'addService']
)->middleware('auth:sanctum');


/* =========================================================
| ADMIN – PENALTY (HƯ HỎNG / PHẠT)
========================================================= */

// 1️⃣ Thêm thiệt hại
Route::post(
    'admin/bookings/{id}/damages',
    [AdminCheckoutController::class, 'addDamage']
)->middleware('auth:sanctum');

// 2️⃣ Thêm penalty (trả phòng trễ)
Route::post(
    'admin/bookings/{id}/penalties',
    [AdminCheckoutController::class, 'addPenalty']
)->middleware('auth:sanctum');

// 3️⃣ Xác nhận checkout (bắt buộc)
Route::post(
    'admin/bookings/{id}/checkout/confirm',
    [AdminCheckoutController::class, 'confirmCheckout']
)->middleware('auth:sanctum');

// 4️⃣ Xem tổng tiền checkout
Route::get(
    'admin/bookings/{id}/checkout/summary',
    [AdminCheckoutController::class, 'summary']
)->middleware('auth:sanctum');

// 5️⃣ Thanh toán checkout (cash / vnpay)
Route::post(
    'admin/bookings/{id}/checkout/pay',
    [AdminCheckoutController::class, 'pay']
)->middleware('auth:sanctum');
