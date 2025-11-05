<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        if ($request->user()->role !== $role) {
            return response()->json(['error' => 'Không có quyền truy cập'], 403);
        }

        return $next($request);
    }
}
