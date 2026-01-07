<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\RoomImageController;
use App\Http\Controllers\Api\RoomTypeImageController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentController;

use App\Http\Controllers\Api\AdminCheckinController;
use App\Http\Controllers\Api\AdminCheckoutController;
use App\Http\Controllers\Api\AdminPenaltyController;
use App\Http\Controllers\Api\AdminServiceController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| PROFILE (CLIENT)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('client')->group(function () {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::delete('profile', [ProfileController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| BOOKINGS
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('bookings/my', [BookingController::class, 'myBookings']);
    Route::post('bookings/{id}/cancel', [BookingController::class, 'cancel']);
});

Route::apiResource('bookings', BookingController::class);

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
*/
Route::get('events', [EventController::class, 'index']);
Route::post('events', [EventController::class, 'store']);
Route::get('events/{id}', [EventController::class, 'show']);
Route::put('events/{id}', [EventController::class, 'update']);
Route::delete('events/{id}', [EventController::class, 'destroy']);
Route::patch('events/{id}/toggle', [EventController::class, 'toggleStatus']);

/*
|--------------------------------------------------------------------------
| BASIC RESOURCES
|--------------------------------------------------------------------------
*/
Route::apiResource('amenities', AmenityController::class);
Route::apiResource('services', ServiceController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('roomtypeimages', RoomTypeImageController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('users', UserController::class);

/*
|--------------------------------------------------------------------------
| ROOM TYPE IMAGES
|--------------------------------------------------------------------------
*/
Route::post('room-types/{id}/images', [RoomTypeImageController::class, 'store']);
Route::delete('room-types/{roomTypeId}/images/{imageId}', [RoomTypeImageController::class, 'destroy']);
Route::delete('room-types/{roomTypeId}/main-image', [RoomTypeImageController::class, 'destroyMainImage']);

/*
|-------------------------------------------------------------------------- 
| CHAT 
|-------------------------------------------------------------------------- 
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('chat', [ChatController::class, 'list']);
    Route::post('chat/send', [ChatController::class, 'sendMessage']);
    Route::get('chat/{id}', [ChatController::class, 'show']);
    Route::post('chat/{id}/reply', [ChatController::class, 'reply']);
});




/*
|--------------------------------------------------------------------------
| CHATBOT
|--------------------------------------------------------------------------
*/
Route::post('chatbot', [ChatbotController::class, 'handle']);

/*
|--------------------------------------------------------------------------
| PAYMENT – VNPAY
|--------------------------------------------------------------------------
*/
Route::post('payments/vnpay/create', [PaymentController::class, 'createVnpay'])->middleware('auth:sanctum');
Route::get('payments/vnpay/callback', [PaymentController::class, 'vnpayCallback']);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('admin/bookings/{id}/checkin', [AdminCheckinController::class, 'checkin']);
    Route::post('admin/bookings/{id}/services', [AdminServiceController::class, 'addService']);
    Route::post('admin/bookings/{id}/penalties', [AdminPenaltyController::class, 'addPenalty']);
    Route::post('admin/bookings/{id}/checkout', [AdminCheckoutController::class, 'checkout']);
    Route::get('admin/dashboard', [DashboardController::class, 'stats']);
});