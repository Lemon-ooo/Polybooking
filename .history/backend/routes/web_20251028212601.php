<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\GalleryController;

Route::get('/', function () {
    return view('welcome');
});

//admin
Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
Route::resource('room-types', RoomTypeController::class); //crud loại phòng
Route::resource('rooms', RoomController::class);//crud phòng
Route::resource('amenities', AmenityController::class);
Route::resource('galleries', GalleryController::class);