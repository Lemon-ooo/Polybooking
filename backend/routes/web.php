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
use App\Http\Controllers\Web\EventController;
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
Route::get('/rooms',                [RoomController::class, 'index'])->name('web.rooms.index');
Route::get('/rooms/create',         [RoomController::class, 'create'])->name('web.rooms.create');
Route::post('/rooms',               [RoomController::class, 'store'])->name('web.rooms.store'); // ĐÃ SỬA
Route::get('/rooms/{room}',         [RoomController::class, 'show'])->name('web.rooms.show');
Route::get('/rooms/{room}/edit',    [RoomController::class, 'edit'])->name('web.rooms.edit');
Route::put('/rooms/{room}',         [RoomController::class, 'update'])->name('web.rooms.update');
Route::patch('/rooms/{room}',       [RoomController::class, 'update'])->name('web.rooms.update.patch');
Route::delete('/rooms/{room}',      [RoomController::class, 'destroy'])->name('web.rooms.destroy');

/*
|--------------------------------------------------------------------------
| Room Types (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/room-types',                 [RoomTypeController::class, 'index'])->name('web.room-types.index');
Route::get('/room-types/create',          [RoomTypeController::class, 'create'])->name('web.room-types.create');
Route::post('/room-types',                [RoomTypeController::class, 'store'])->name('web.room-types.store');
Route::get('/room-types/{room_type}',     [RoomTypeController::class, 'show'])->name('web.room-types.show');
Route::get('/room-types/{room_type}/edit',[RoomTypeController::class, 'edit'])->name('web.room-types.edit');
Route::put('/room-types/{room_type}',     [RoomTypeController::class, 'update'])->name('web.room-types.update');
Route::patch('/room-types/{room_type}',   [RoomTypeController::class, 'update'])->name('web.room-types.update.patch');
Route::delete('/room-types/{room_type}',  [RoomTypeController::class, 'destroy'])->name('web.room-types.destroy');

/*
|--------------------------------------------------------------------------
| Amenities (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/amenities',                [AmenityController::class, 'index'])->name('web.amenities.index');
Route::get('/amenities/create',         [AmenityController::class, 'create'])->name('web.amenities.create');
Route::post('/amenities',               [AmenityController::class, 'store'])->name('web.amenities.store');
Route::get('/amenities/{amenity}',      [AmenityController::class, 'show'])->name('web.amenities.show');
Route::get('/amenities/{amenity}/edit', [AmenityController::class, 'edit'])->name('web.amenities.edit');
Route::put('/amenities/{amenity}',      [AmenityController::class, 'update'])->name('web.amenities.update');
Route::patch('/amenities/{amenity}',    [AmenityController::class, 'update'])->name('web.amenities.update.patch');
Route::delete('/amenities/{amenity}',   [AmenityController::class, 'destroy'])->name('web.amenities.destroy');

/*
|--------------------------------------------------------------------------
| Galleries (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/galleries',                [GalleryController::class, 'index'])->name('web.galleries.index');
Route::get('/galleries/create',         [GalleryController::class, 'create'])->name('web.galleries.create');
Route::post('/galleries',               [GalleryController::class, 'store'])->name('web.galleries.store');
Route::get('/galleries/{gallery}',      [GalleryController::class, 'show'])->name('web.galleries.show');
Route::get('/galleries/{gallery}/edit', [GalleryController::class, 'edit'])->name('web.galleries.edit');
Route::put('/galleries/{gallery}',      [GalleryController::class, 'update'])->name('web.galleries.update');
Route::patch('/galleries/{gallery}',    [GalleryController::class, 'update'])->name('web.galleries.update.patch');
Route::delete('/galleries/{gallery}',   [GalleryController::class, 'destroy'])->name('web.galleries.destroy');

/*
|--------------------------------------------------------------------------
| Services (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/services',                [ServiceController::class, 'index'])->name('web.services.index');
Route::get('/services/create',         [ServiceController::class, 'create'])->name('web.services.create');
Route::post('/services',               [ServiceController::class, 'store'])->name('web.services.store');
Route::get('/services/{service}',      [ServiceController::class, 'show'])->name('web.services.show');
Route::get('/services/{service}/edit', [ServiceController::class, 'edit'])->name('web.services.edit');
Route::put('/services/{service}',      [ServiceController::class, 'update'])->name('web.services.update');
Route::patch('/services/{service}',    [ServiceController::class, 'update'])->name('web.services.update.patch');
Route::delete('/services/{service}',   [ServiceController::class, 'destroy'])->name('web.services.destroy');


/*
|--------------------------------------------------------------------------
| Events (CRUD đầy đủ)
|--------------------------------------------------------------------------
*/
Route::get('/events',                [EventController::class, 'index'])->name('web.events.index');
Route::get('/events/create',         [EventController::class, 'create'])->name('web.events.create');
Route::post('/events',               [EventController::class, 'store'])->name('web.events.store');
Route::get('/events/{event}',        [EventController::class, 'show'])->name('web.events.show');
Route::get('/events/{event}/edit',   [EventController::class, 'edit'])->name('web.events.edit');
Route::put('/events/{event}',        [EventController::class, 'update'])->name('web.events.update');
Route::patch('/events/{event}',      [EventController::class, 'update'])->name('web.events.update.patch');
Route::delete('/events/{event}',     [EventController::class, 'destroy'])->name('web.events.destroy');
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