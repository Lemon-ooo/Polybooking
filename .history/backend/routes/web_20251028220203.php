<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\RoomImageController;

Route::get('/', function () {
    return view('welcome');
});
//admin
Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
Route::resource('room-types', RoomTypeController::class); //crud loại phòng
Route::resource('rooms', RoomController::class);//crud phòng
Route::resource('amenities', AmenityController::class);
Route::resource('galleries', GalleryController::class);
Route::resource('services', ServiceController::class);//crud dịch vụ



// Album ảnh của phòng
Route::get('rooms/{room}/images', [RoomImageController::class, 'index'])->name('room.images.index');
Route::post('rooms/{room}/images', [RoomImageController::class, 'store'])->name('room.images.store');
Route::delete('rooms/images/{id}', [RoomImageController::class, 'destroy'])->name('room.images.destroy');

