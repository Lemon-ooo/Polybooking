<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;

Route::apiResource('services', ServiceController::class);
