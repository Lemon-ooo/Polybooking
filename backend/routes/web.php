<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CONTROLLERS
|--------------------------------------------------------------------------
*/

// AUTH
use App\Http\Controllers\Auth\AuthController;

// PUBLIC
use App\Http\Controllers\Web\HomeController;

// CUSTOMER
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\BookingController;
use App\Http\Controllers\Web\PaymentController;

// ADMIN
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\RoomTypeController;
use App\Http\Controllers\Web\RoomController;
use App\Http\Controllers\Web\AmenityController;
use App\Http\Controllers\Web\ServiceController;
use App\Http\Controllers\Web\RoomTypeImageController;
use App\Http\Controllers\Web\BookingAdminController;
use App\Http\Controllers\Web\DamageTypeController;
use App\Http\Controllers\Web\AdminGuestController;
use App\Http\Controllers\Web\AdminServiceController;
use App\Http\Controllers\Web\AdminCheckoutController;
use App\Http\Controllers\Web\AdminCheckinController;
use App\Http\Controllers\Web\VnpayController;

use App\Http\Middleware\IsAdmin;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| AUTH (GUEST)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login',  [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    Route::get('/register',  [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

/*
|--------------------------------------------------------------------------
| CUSTOMER AREA
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // PROFILE
    Route::get('/profile',           [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile',          [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.update_password');
    Route::delete('/profile/delete', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // BOOKING
    Route::get('/bookings',           [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/create',    [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings',          [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    // PAYMENT
    Route::get('/payment/{booking}', [PaymentController::class, 'showPaymentPage'])
        ->name('payment.page');

    Route::post('/payment/{booking}/vnpay', [PaymentController::class, 'redirectToVnpay'])
        ->name('payment.vnpay');

    Route::get('/payment/vnpay/return', [PaymentController::class, 'vnpayReturn'])
        ->name('payment.vnpay.return');
});

/*
|--------------------------------------------------------------------------
| ADMIN AREA
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', IsAdmin::class])
    ->group(function () {

        // DASHBOARD
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // MASTER DATA
        Route::resource('room-types', RoomTypeController::class);
        Route::resource('rooms', RoomController::class);
        Route::resource('amenities', AmenityController::class);
        Route::resource('services', ServiceController::class);

        Route::resource('users', UserController::class)->only(['index', 'edit', 'update']);

        Route::prefix('room-types/{room_type}')->group(function () {
            Route::resource('images', RoomTypeImageController::class);
        });

        // BOOKINGS
        Route::get('/bookings', [BookingAdminController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/paid', [BookingAdminController::class, 'paid'])->name('bookings.paid');
        Route::get('/bookings/in-use', [BookingAdminController::class, 'inUse'])->name('bookings.in_use');
        Route::get('/bookings/checkedout', [BookingAdminController::class, 'checkedout'])->name('bookings.checkedout');

        Route::get('/bookings/{booking}', [BookingAdminController::class, 'show'])
            ->name('bookings.show');

        /*
        |--------------------------------------------------------------------------
        | CHECK-IN (ĐÚNG – KHÔNG LỖI)
        |--------------------------------------------------------------------------
        */
        Route::get('/bookings/{booking}/checkin', [AdminCheckinController::class, 'show'])
            ->name('bookings.checkin');

        Route::post('/bookings/{booking}/checkin', [AdminCheckinController::class, 'checkin'])
            ->name('bookings.checkin.confirm');

        /*
        |--------------------------------------------------------------------------
        | GUEST MANAGEMENT
        |--------------------------------------------------------------------------
        */
        Route::get('/bookings/{booking}/guests', [AdminGuestController::class, 'index'])
            ->name('bookings.guests');

        Route::post('/bookings/{booking}/guests', [AdminGuestController::class, 'store'])
            ->name('bookings.guests.store');

        /*
        |--------------------------------------------------------------------------
        | IN-STAY (SERVICE / DAMAGE)
        |--------------------------------------------------------------------------
        */
        Route::post('/bookings/{booking}/add-service', [AdminServiceController::class, 'addService'])
            ->name('bookings.service');

        Route::post('/bookings/{booking}/add-damage', [AdminServiceController::class, 'addDamage'])
            ->name('bookings.damage');

        /*
        |--------------------------------------------------------------------------
        | CHECK-OUT
        |--------------------------------------------------------------------------
        */
        Route::get('/bookings/{booking}/checkout', [BookingAdminController::class, 'checkoutPage'])
            ->name('bookings.checkout.page');

        Route::post('/bookings/{booking}/checkout', [AdminCheckoutController::class, 'checkout'])
            ->name('bookings.checkout.confirm');

        // DAMAGE TYPES
        Route::resource('damage-types', DamageTypeController::class);
    });
