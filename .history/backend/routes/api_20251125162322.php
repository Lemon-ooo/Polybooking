<?php

use App\Http\Controllers\Api\AmenityController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;



Route::apiResource('services', ServiceController::class);
Route::apiResource('amenity', AmenityController::class);