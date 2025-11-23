<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Console Routes & Scheduled Tasks
|--------------------------------------------------------------------------
|
| File này dùng để:
|  - Định nghĩa các Artisan command đơn giản (Artisan::command)
|  - Đăng ký scheduler cho các command (Schedule::command)
|
*/

// Ví dụ command mặc định của Laravel
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 🕒 Scheduler: tự động cập nhật trạng thái booking
// Chạy mỗi giờ 1 lần
Schedule::command('bookings:auto-status')->hourly();

// Nếu bro muốn chỉ chạy mỗi ngày 1 lần lúc 00:10, dùng dòng dưới và xoá dòng hourly:
// Schedule::command('bookings:auto-status')->dailyAt('00:10');
