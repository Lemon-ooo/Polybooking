<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Configuration\Exceptions;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 2.1) Đăng ký alias (key => class)
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            // có thể alias thêm: 'isAdmin' => ..., 'audit' => ..., v.v.
        ]);

        // 2.2) (Tuỳ chọn) Tạo group đặt tên sẵn
        // => dùng trực tiếp trong routes: ->middleware('admin') / ->middleware('client')
        $middleware->group('admin', [
            'auth',           // bắt buộc đã đăng nhập
            'role:admin',     // và có role admin
        ]);

        $middleware->group('client', [
            'auth',
            'role:client',
        ]);

        // 2.3) (Tuỳ chọn) Thêm global middleware (chạy cho mọi request web/api)
        // $middleware->append(\App\Http\Middleware\SomeGlobalMiddleware::class);

        // 2.4) (Tuỳ chọn) Thêm vào sẵn group 'web' hoặc 'api' hiện có
        // $middleware->appendToGroup('web', \App\Http\Middleware\AuditWeb::class);
        // $middleware->appendToGroup('api', \App\Http\Middleware\EnforceJson::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
