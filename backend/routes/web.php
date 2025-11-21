<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\RoomTypeController as WebRoomTypeController;
use App\Http\Controllers\Web\RoomController as WebRoomController;
use App\Http\Controllers\Web\AmenityController as WebAmenityController;
use App\Http\Controllers\Web\ServiceController as WebServiceController;
use App\Http\Controllers\Web\RoomTypeImageController;
use App\Http\Controllers\Web\DashboardController;


Route::prefix('admin')
    ->name('admin.')
    ->middleware(['web']) // sau này thêm 'auth', 'is_admin' nếu cần
    ->group(function () {
        Route::get('/home', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('room-types', WebRoomTypeController::class);
        Route::resource('rooms', WebRoomController::class);
        Route::resource('amenities', WebAmenityController::class);
        Route::resource('services', WebServiceController::class);


        Route::prefix('room-types/{room_type_id}')->group(function () {
            Route::get('images',        [RoomTypeImageController::class, 'index'])->name('room-types.images.index');
            Route::get('images/create', [RoomTypeImageController::class, 'create'])->name('room-types.images.create');
            Route::post('images',       [RoomTypeImageController::class, 'store'])->name('room-types.images.store');
            Route::get('images/{image_id}/edit', [RoomTypeImageController::class, 'edit'])->name('room-types.images.edit');
            Route::put('images/{image_id}',      [RoomTypeImageController::class, 'update'])->name('room-types.images.update');
            Route::delete('images/{image_id}',   [RoomTypeImageController::class, 'destroy'])->name('room-types.images.destroy');
        });
    });
