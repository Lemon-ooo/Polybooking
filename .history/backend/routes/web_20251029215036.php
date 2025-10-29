<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Web\RoomTypeController;
use App\Http\Controllers\Web\AmenityController;
use App\Http\Controllers\Web\GalleryController;
use App\Http\Controllers\Web\ServiceController;
use App\Http\Controllers\Web\RoomImageController;

Route::get('/', function () {
    return view('welcome');
});

// ✅ Admin routes
Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');

// ✅ Web CRUD routes
Route::resource('room-types', RoomTypeController::class); // CRUD loại phòng
Route::resource('amenities', AmenityController::class);   // CRUD tiện ích
Route::resource('galleries', GalleryController::class);   // CRUD gallery
Route::resource('services', ServiceController::class);    // CRUD dịch vụ

// ✅ Album ảnh của phòng
Route::get('rooms/{room}/images', [RoomImageController::class, 'index'])->name('room.images.index');
Route::post('rooms/{room}/images', [RoomImageController::class, 'store'])->name('room.images.store');
Route::delete('rooms/images/{id}', [RoomImageController::class, 'destroy'])->name('room.images.destroy');
