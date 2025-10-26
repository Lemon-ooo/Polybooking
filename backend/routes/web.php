<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Client\RoomBrowseController; // <-- THÊM: controller client

/*
|--------------------------------------------------------------------------
| Guest (chưa đăng nhập)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'showLoginForm'])->name('login.show');
    Route::post('/login',   [AuthController::class, 'login'])->name('login');

    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register.show');
    Route::post('/register',[AuthController::class, 'register'])->name('register');
});

/*
|--------------------------------------------------------------------------
| Đăng xuất (đã đăng nhập)
|--------------------------------------------------------------------------
*/
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

/*
|--------------------------------------------------------------------------
| Khu vực CLIENT (chỉ role:client)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:client'])->prefix('client')->as('client.')->group(function () {
    // Điều hướng trang client chính về danh sách phòng
    Route::get('/', fn () => redirect()->route('client.rooms.index'))->name('dashboard');

    // Danh sách phòng cho client
    Route::get('/rooms', [RoomBrowseController::class, 'index'])->name('rooms.index');
});

/*
|--------------------------------------------------------------------------
| Khu vực ADMIN (chỉ role:admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');

    // CRUD loại phòng & phòng
    Route::resource('room-types', RoomTypeController::class);
    Route::resource('rooms',      RoomController::class);
});

/*
|--------------------------------------------------------------------------
| Điều hướng chung
|--------------------------------------------------------------------------
*/
// /dashboard: chuyển hướng theo role đang đăng nhập
Route::get('/dashboard', function () {
    if (!auth()->check()) {
        return redirect()->route('login.show');
    }
    return auth()->user()->role === 'admin'
        ? redirect()->route('admin.dashboard')
        : redirect()->route('client.dashboard');
})->name('dashboard');

// Trang chủ
Route::get('/', function () {
    if (auth()->check()) {
        return auth()->user()->role === 'admin'
            ? redirect()->route('admin.dashboard')
            : redirect()->route('client.dashboard');
    }
    return view('welcome');
});
