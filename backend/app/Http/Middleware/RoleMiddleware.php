<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Kiểm tra xem user đã đăng nhập chưa
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn cần đăng nhập để truy cập!'
            ], 401);
        }

        // Kiểm tra role
        if ($request->user()->role !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập trang này!'
            ], 403);
        }

        return $next($request);
    }
}