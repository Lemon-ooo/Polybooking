<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LoyaltyController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\RoomImageController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AdminCheckinController;
use App\Http\Controllers\Api\AdminLoyaltyController;
use App\Http\Controllers\Api\AdminServiceController;
use App\Http\Controllers\Api\AdminCheckoutController;
// AdminDamageController removed — damage endpoints moved into AdminCheckoutController
use App\Http\Controllers\Api\AdminDamageTypeController;
// AdminPenaltyController removed — penalty endpoints moved into AdminCheckoutController
use App\Http\Controllers\Api\RoomTypeImageController;
use App\Http\Controllers\Api\RevenueController;

Route::get('/bookings/my', [BookingController::class, 'myBookings'])->middleware('auth:sanctum');

Route::apiResource('amenities', AmenityController::class);
Route::apiResource('bookings', BookingController::class);

Route::get('events', [EventController::class, 'index']);
Route::post('events', [EventController::class, 'store']);
Route::get('events/{id}', [EventController::class, 'show']);
Route::put('events/{id}', [EventController::class, 'update']);
Route::delete('events/{id}', [EventController::class, 'destroy']);
Route::patch('events/{id}/toggle', [EventController::class, 'toggleStatus']);

Route::apiResource('rooms', RoomController::class);
Route::apiResource('galleries', GalleryController::class);
Route::apiResource('roomimages', RoomImageController::class);
Route::apiResource('room-types', RoomTypeController::class);
Route::apiResource('roomtypeimages', RoomTypeImageController::class);
Route::apiResource('users', UserController::class);

// ================= ROOM TYPE IMAGES (PUBLIC - CLIENT) =================
Route::get(
    'room-types/{id}/images',
    [RoomTypeImageController::class, 'index']
);

// USER
Route::post('/chat/send', [ChatController::class, 'sendMessage']);
// ADMIN
Route::get('/chat', [ChatController::class, 'list']);
Route::get('/chat/{id}', [ChatController::class, 'show']);
Route::post('/chat/{id}/reply', [ChatController::class, 'reply']);
Route::post('room-types/{id}/images', [RoomTypeImageController::class, 'store']);
Route::delete('room-types/{roomTypeId}/images/{imageId}', [RoomTypeImageController::class, 'destroy']);
Route::delete('/room-types/{roomTypeId}/main-image', [RoomTypeImageController::class, 'destroyMainImage']);

Route::apiResource('services', ServiceController::class);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
// Quên mật khẩu
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Profile routes
Route::middleware('auth:sanctum')->prefix('client')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);
});

/* =========================================================
| BOOKING – CUSTOMER
========================================================= */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('booking/index', [AdminBookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('my/bookings', [BookingController::class, 'myBookings']);
    Route::get('bookings/{id}', [BookingController::class, 'show']);
    Route::post('bookings/{id}/cancel', [BookingController::class, 'cancel']);
});

///////////////////////Booking Admin Show & Index///////////////////////
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/bookings', [AdminBookingController::class, 'index']);
    Route::get('/bookings/{id}', [AdminBookingController::class, 'show']);
});

/* =========================================================
| PAYMENT – VNPAY
========================================================= */
Route::post('payments/vnpay/booking', [PaymentController::class, 'createVnpayBooking'])->middleware('auth:sanctum');
Route::get('payments/vnpay/callback', [PaymentController::class, 'vnpayCallback']);

/* =========================================================
| ADMIN – CHECK-IN
========================================================= */
Route::post(
    'bookings/{id}/checkin',
    [AdminCheckinController::class, 'checkin']
)->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // POST - Gắn phòng cho booking
    Route::post('bookings/{id}/assign-room', [\App\Http\Controllers\Api\AdminAssignedRoomController::class, 'assign']);
    
    // GET - Lấy danh sách phòng đã gắn cho booking
    Route::get('bookings/{id}/assigned-rooms', [\App\Http\Controllers\Api\AdminAssignedRoomController::class, 'index']);
    
    // GET - Lấy tất cả assigned rooms (có filter)
    Route::get('assigned-rooms', [\App\Http\Controllers\Api\AdminAssignedRoomController::class, 'list']);
});
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
// Damage endpoints moved to checkout flow (see bookings/{id}/checkout/...)

// Damage types CRUD (catalog used when creating invoices)
Route::get('damage-types', [AdminDamageTypeController::class, 'index'])->middleware('auth:sanctum');
Route::post('damage-types', [AdminDamageTypeController::class, 'store'])->middleware('auth:sanctum');
Route::get('damage-types/{id}', [AdminDamageTypeController::class, 'show'])->middleware('auth:sanctum');
Route::put('damage-types/{id}', [AdminDamageTypeController::class, 'update'])->middleware('auth:sanctum');
Route::delete('damage-types/{id}', [AdminDamageTypeController::class, 'destroy'])->middleware('auth:sanctum');

// Penalty endpoints moved to checkout flow (see bookings/{id}/checkout/...)

// 3️⃣ Xác nhận checkout (bắt buộc)
Route::post(
    'bookings/{id}/checkout/confirm',
    [AdminCheckoutController::class, 'confirmCheckout']
)->middleware('auth:sanctum');

// 4️⃣ Xem tổng tiền checkout
Route::get(
    'bookings/{id}/checkout/summary',
    [AdminCheckoutController::class, 'summary']
)->middleware('auth:sanctum');

// 5️⃣ Thanh toán checkout (cash / vnpay)
Route::post(
    'bookings/{id}/checkout/pay',
    [AdminCheckoutController::class, 'pay']
)->middleware('auth:sanctum');

// 6️⃣ Thêm damage/penalty trực tiếp trong luồng checkout (AdminCheckoutController)
Route::post(
    'bookings/{id}/checkout/damages',
    [AdminCheckoutController::class, 'addDamages']
)->middleware('auth:sanctum');

Route::post(
    'bookings/{id}/checkout/penalty',
    [AdminCheckoutController::class, 'addPenatis']
)->middleware('auth:sanctum');

//chatbot
Route::post('/chatbot', [ChatbotController::class, 'handle']);

/* =========================================================
| CHAT 
========================================================= */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('chat', [ChatController::class, 'list']);
    Route::post('chat/send', [ChatController::class, 'sendMessage']);
    Route::get('chat/{id}', [ChatController::class, 'show']);
    Route::post('chat/{id}/reply', [ChatController::class, 'reply']);
});

Route::get('/admin/dashboard', [DashboardController::class, 'stats']);

/* =========================================================
| INVOICE ROUTES (HÓA ĐƠN)
========================================================= */
// Invoice routes - GROUPED VERSION (Recommended)
Route::prefix('bookings/{id}/invoice')->group(function () {
    Route::get('/', [InvoiceController::class, 'show']);
    Route::get('/pdf', [InvoiceController::class, 'pdf']);
    Route::post('/send-mail', [InvoiceController::class, 'sendMail']);
    Route::post('/store-and-send', [InvoiceController::class, 'storeAndSend']);
    Route::post('/store', [InvoiceController::class, 'store']);
    Route::get('/check', [InvoiceController::class, 'check']); // Thêm route check
});

Route::get('/invoices/{id}', [InvoiceController::class, 'getStoredInvoice']);
Route::get('/invoices/{id}/pdf', [InvoiceController::class, 'downloadPdf']);

/* =========================================================
| VOUCHER – CUSTOMER
========================================================= */
Route::post(
    'vouchers/validate',
    [VoucherController::class, 'validateVoucher']
);

/* =========================================================
| VOUCHER – ADMIN
========================================================= */
Route::post(
    'vouchers',
    [VoucherController::class, 'store']
)->middleware('auth:sanctum');

Route::get(
    'vouchers',
    [VoucherController::class, 'index']
)->middleware('auth:sanctum');

Route::patch(
    'vouchers/{id}/status',
    [VoucherController::class, 'toggleStatus']
)->middleware('auth:sanctum');

Route::get(
    'vouchers/{id}',
    [VoucherController::class, 'show']
)->middleware('auth:sanctum');


Route::put(
    'vouchers/{id}',
    [VoucherController::class, 'update']
)->middleware('auth:sanctum');

Route::delete(
    'vouchers/{id}',
    [VoucherController::class, 'destroy']
)->middleware('auth:sanctum');


// Review routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('reviews', ReviewController::class);
    Route::get('reviews/pending', [ReviewController::class, 'getPendingReviews']);
});

Route::get(
    'room-types/{id}/rating',
    [RoomTypeController::class, 'rating']
);


// Loyalty routes
Route::middleware('auth:sanctum')->get(
    '/me/loyalty',
    [LoyaltyController::class, 'me']
);
    Route::get('/loyalty/users', [AdminLoyaltyController::class, 'index']);
    Route::get('/loyalty/users/{user_id}', [AdminLoyaltyController::class, 'show']);
    Route::post('/loyalty/users/{user_id}/points', [AdminLoyaltyController::class, 'adjustPoints']);
    Route::post('/loyalty/users/{user_id}/reset', [AdminLoyaltyController::class, 'reset']);


    Route::prefix('revenue')->group(function () {
    Route::get('/summary', [RevenueController::class, 'summary']);
    Route::get('/range', [RevenueController::class, 'range']);
    Route::get('/top-room-types', [RevenueController::class, 'topRoomTypes']);  
    });
