<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** API Login */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Email hoặc mật khẩu không đúng.',
            ], 401);
        }

        $request->session()->regenerate();

        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Đăng nhập thành công.',
        ]);
    }

    /** API Register */
    public function register(Request $request)
    {
        $data = $request->validate([
            'user_name' => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'user_name' => $data['user_name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'role'      => 'customer',
        ]);

        Auth::login($user);

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Đăng ký thành công.',
        ], 201);
    }

    /** API Logout */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Đăng xuất thành công.',
        ]);
    }
}
