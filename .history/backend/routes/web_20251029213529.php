<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\RoomTypeController;
use App\Http\Controllers\Web\AmenityController;
use App\Http\Controllers\Web\GalleryController;
use App\Http\Controllers\Web\ServiceController;
use App\Http\Controllers\Web\RoomImageController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AmenityController as ControllersAmenityController;
use App\Http\Controllers\GalleryController as ControllersGalleryController;
use App\Http\Controllers\RoomImageController as ControllersRoomImageController;
use App\Http\Controllers\RoomTypeController as ControllersRoomTypeController;
use App\Http\Controllers\ServiceController as ControllersServiceController;

Route::get('/', function () {
    return view('welcome');
});

// ✅ Admin routes
Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');

// ✅ Web CRUD routes
Route::resource('room-types', ControllersRoomTypeController::class); // CRUD loại phòng
Route::resource('amenities', ControllersAmenityController::class);   // CRUD tiện ích
Route::resource('galleries', ControllersGalleryController::class);   // CRUD gallery
Route::resource('services', ControllersServiceController::class);    // CRUD dịch vụ

// ✅ Album ảnh của phòng
Route::get('rooms/{room}/images', [ControllersRoomImageController::class, 'index'])->name('room.images.index');
Route::post('rooms/{room}/images', [ControllersRoomImageController::class, 'store'])->name('room.images.store');
Route::delete('rooms/images/{id}', [ControllersRoomImageController::class, 'destroy'])->name('room.images.destroy');