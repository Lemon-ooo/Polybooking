<?php

use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;



Route::apiResource('services', ServiceController::class);
Route::apiResource('amenity', AmenityController::class);
Route::apiResource('booking', BookingController::class);
Route::apiResource('event', EventController::class);