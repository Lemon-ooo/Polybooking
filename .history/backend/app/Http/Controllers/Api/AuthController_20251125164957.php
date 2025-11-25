<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
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
            'role'      => 'customer', // mặc định
        ]);

        // Tạo token API
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user_id'   => $user->user_id,
                'user_name' => $user->user_name,
                'email'     => $user->email,
                'role'      => $user->role,
                'token'     => $token,
            ],
            'message' => 'Đăng ký thành công.',
        ], 201);
    }

    /** API Login */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Email hoặc mật khẩu không đúng.',
            ], 401);
        }

        // Tạo token mới cho API
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user_id'   => $user->user_id,
                'user_name' => $user->user_name,
                'email'     => $user->email,
                'role'      => $user->role,
                'token'     => $token,
            ],
            'message' => 'Đăng nhập thành công.',
        ]);
    }

    /** API Logout */
    public function logout(Request $request)
    {
        // Xóa tất cả token của user hiện tại
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Đăng xuất thành công.',
        ]);
    }
}
