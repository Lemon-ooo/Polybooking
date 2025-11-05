<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Xử lý khi người dùng chưa đăng nhập.
     */
    protected function redirectTo($request)
    {
        // Nếu request là API thì không redirect
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // Nếu là web, bạn có thể redirect về trang chủ hoặc login (nếu có)
        return '/';
    }
}
