<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;



Route::apiResource('services', ServiceController::class);