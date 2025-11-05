<?php

use Illuminate\Support\Facades\Route;

// Admin
use App\Http\Controllers\Admin\AdminController;

// Web Controllers
use App\Http\Controllers\Web\RoomController;
use App\Http\Controllers\Web\RoomTypeController;
use App\Http\Controllers\Web\AmenityController;
use App\Http\Controllers\Web\GalleryController;
use App\Http\Controllers\Web\ServiceController;
use App\Http\Controllers\Web\RoomImageController;

Route::get('/', fn() => view('welcome'))->name('home');

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');

/*
|--------------------------------------------------------------------------
| Rooms (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/rooms',                [RoomController::class, 'index'])->name('rooms.index');
Route::get('/rooms/create',         [RoomController::class, 'create'])->name('rooms.create');
Route::post('/rooms',               [RoomController::class, 'store'])->name('web.rooms.store'); // ĐÃ SỬA
Route::get('/rooms/{room}',         [RoomController::class, 'show'])->name('rooms.show');
Route::get('/rooms/{room}/edit',    [RoomController::class, 'edit'])->name('rooms.edit');
Route::put('/rooms/{room}',         [RoomController::class, 'update'])->name('rooms.update');
Route::patch('/rooms/{room}',       [RoomController::class, 'update'])->name('rooms.update.patch');
Route::delete('/rooms/{room}',      [RoomController::class, 'destroy'])->name('rooms.destroy');

/*
|--------------------------------------------------------------------------
| Room Types (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/room-types',                 [RoomTypeController::class, 'index'])->name('room-types.index');
Route::get('/room-types/create',          [RoomTypeController::class, 'create'])->name('room-types.create');
Route::post('/room-types',                [RoomTypeController::class, 'store'])->name('web.room-types.store');
Route::get('/room-types/{room_type}',     [RoomTypeController::class, 'show'])->name('room-types.show');
Route::get('/room-types/{room_type}/edit',[RoomTypeController::class, 'edit'])->name('room-types.edit');
Route::put('/room-types/{room_type}',     [RoomTypeController::class, 'update'])->name('room-types.update');
Route::patch('/room-types/{room_type}',   [RoomTypeController::class, 'update'])->name('room-types.update.patch');
Route::delete('/room-types/{room_type}',  [RoomTypeController::class, 'destroy'])->name('room-types.destroy');

/*
|--------------------------------------------------------------------------
| Amenities (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/amenities',                [AmenityController::class, 'index'])->name('amenities.index');
Route::get('/amenities/create',         [AmenityController::class, 'create'])->name('amenities.create');
Route::post('/amenities',               [AmenityController::class, 'store'])->name('web.amenities.store');
Route::get('/amenities/{amenity}',      [AmenityController::class, 'show'])->name('amenities.show');
Route::get('/amenities/{amenity}/edit', [AmenityController::class, 'edit'])->name('amenities.edit');
Route::put('/amenities/{amenity}',      [AmenityController::class, 'update'])->name('amenities.update');
Route::patch('/amenities/{amenity}',    [AmenityController::class, 'update'])->name('amenities.update.patch');
Route::delete('/amenities/{amenity}',   [AmenityController::class, 'destroy'])->name('amenities.destroy');

/*
|--------------------------------------------------------------------------
| Galleries (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/galleries',                [GalleryController::class, 'index'])->name('galleries.index');
Route::get('/galleries/create',         [GalleryController::class, 'create'])->name('galleries.create');
Route::post('/galleries',               [GalleryController::class, 'store'])->name('web.galleries.store');
Route::get('/galleries/{gallery}',      [GalleryController::class, 'show'])->name('galleries.show');
Route::get('/galleries/{gallery}/edit', [GalleryController::class, 'edit'])->name('galleries.edit');
Route::put('/galleries/{gallery}',      [GalleryController::class, 'update'])->name('galleries.update');
Route::patch('/galleries/{gallery}',    [GalleryController::class, 'update'])->name('galleries.update.patch');
Route::delete('/galleries/{gallery}',   [GalleryController::class, 'destroy'])->name('galleries.destroy');

/*
|--------------------------------------------------------------------------
| Services (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/services',                [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/create',         [ServiceController::class, 'create'])->name('services.create');
Route::post('/services',               [ServiceController::class, 'store'])->name('web.services.store');
Route::get('/services/{service}',      [ServiceController::class, 'show'])->name('services.show');
Route::get('/services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
Route::put('/services/{service}',      [ServiceController::class, 'update'])->name('services.update');
Route::patch('/services/{service}',    [ServiceController::class, 'update'])->name('services.update.patch');
Route::delete('/services/{service}',   [ServiceController::class, 'destroy'])->name('services.destroy');

/*
|--------------------------------------------------------------------------
| Room Images (Album ảnh của phòng)
|--------------------------------------------------------------------------
*/
Route::prefix('rooms/{room}')->name('room.images.')->group(function () {
    Route::get   ('/images',               [RoomImageController::class, 'index'])->name('index');
    Route::post  ('/images',               [RoomImageController::class, 'store'])->name('store');
    Route::delete('/images/{image}',       [RoomImageController::class, 'destroy'])->name('destroy');
});