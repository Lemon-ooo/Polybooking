<?php

use App\Http\Controllers\Api\EventController as ApiEventController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\RoomTypeController;
use App\Http\Controllers\Web\RoomController;
use App\Http\Controllers\Web\AmenityController;
use App\Http\Controllers\Web\ServiceController;
use App\Http\Controllers\Web\EventController;
use App\Http\Controllers\Web\RoomTypeImageController;
use App\Http\Middleware\IsAdmin;
use App\Http\Controllers\Web\BookingController;
use App\Http\Controllers\Web\AdminBookingController;
/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Không yêu cầu đăng nhập)
|--------------------------------------------------------------------------
*/

// Trang home hiển thị room types cho khách
Route::get('/', [HomeController::class, 'index'])->name('home');


/*
|--------------------------------------------------------------------------
| AUTH ROUTES (Chỉ dành cho khách chưa login)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {

    // Login
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    // Register
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});


/*
|--------------------------------------------------------------------------
| LOGOUT (Yêu cầu login)
|--------------------------------------------------------------------------
*/

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');


/*
|--------------------------------------------------------------------------
| CUSTOMER AREA (Yêu cầu login)
| - Chỉnh sửa profile
| - Đổi mật khẩu
| - Xóa tài khoản
| - Sau này thêm booking cũng đặt trong đây
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Đổi mật khẩu
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])
        ->name('profile.update_password');

    // Xóa tài khoản
    Route::delete('/profile/delete', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    // Booking (để đây sau này bro bổ sung)
    // Route::resource('bookings', BookingController::class)->except(['create']);

    // Booking (customer)
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/bookings/{booking_id}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking_id}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
});


/*
|--------------------------------------------------------------------------
| ADMIN AREA 
| - Dashboard
| - CRUD Room Types, Rooms, Amenities, Services
| - Quản lý Users (chỉ xem + set role)
| - CRUD RoomType Images (nested)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', IsAdmin::class])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        // Room Types
        Route::resource('room-types', RoomTypeController::class);

        // Rooms
        Route::resource('rooms', RoomController::class);

        // Amenities
        Route::resource('amenities', AmenityController::class);

        // Services
        Route::resource('services', ServiceController::class);
        // Events
        Route::resource('events', EventController::class);
        // Gallery
    
        // Users (chỉ index, edit, update role)
        Route::resource('users', UserController::class)
            ->only(['index', 'edit', 'update']);

        // Room Type Images (nested)
        Route::prefix('room-types/{room_type_id}')->group(function () {

            Route::get('images', [RoomTypeImageController::class, 'index'])
                ->name('room-types.images.index');

            Route::get('images/create', [RoomTypeImageController::class, 'create'])
                ->name('room-types.images.create');

            Route::post('images', [RoomTypeImageController::class, 'store'])
                ->name('room-types.images.store');

            Route::get('images/{image_id}/edit', [RoomTypeImageController::class, 'edit'])
                ->name('room-types.images.edit');

            Route::put('images/{image_id}', [RoomTypeImageController::class, 'update'])
                ->name('room-types.images.update');

            Route::delete('images/{image_id}', [RoomTypeImageController::class, 'destroy'])
                ->name('room-types.images.destroy');
        });
        // BOOKINGS (Admin)
        Route::get('bookings', [AdminBookingController::class, 'index'])
            ->name('bookings.index');

        Route::get('bookings/{booking_id}', [AdminBookingController::class, 'show'])
            ->name('bookings.show');

        // Chuyển sang paid
        Route::post('bookings/{booking_id}/mark-paid', [AdminBookingController::class, 'markPaid'])
            ->name('bookings.markPaid');

        // Gán phòng
        Route::post('bookings/{booking_id}/assign-rooms', [AdminBookingController::class, 'assignRooms'])
            ->name('bookings.assignRooms');

        // Dịch vụ phát sinh
        Route::post('bookings/{booking_id}/service-charges', [AdminBookingController::class, 'addServiceCharge'])
            ->name('bookings.serviceCharges.add');

        Route::delete('bookings/{booking_id}/service-charges/{service_charge_id}', [AdminBookingController::class, 'deleteServiceCharge'])
            ->name('bookings.serviceCharges.delete');

        // Penalty
        Route::post('bookings/{booking_id}/penalties', [AdminBookingController::class, 'addPenalty'])
            ->name('bookings.penalties.add');

        Route::delete('bookings/{booking_id}/penalties/{penalty_id}', [AdminBookingController::class, 'deletePenalty'])
            ->name('bookings.penalties.delete');
    });
