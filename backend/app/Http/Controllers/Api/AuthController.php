<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;


class AuthController extends Controller
{
    /**
     * POST /api/v1/auth/register
     * Đăng ký tài khoản mới (mặc định role = customer).
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'user_name' => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:6', 'confirmed'],
            // optional
            'phone_number'     => ['nullable', 'string', 'max:30'],
            'address'   => ['nullable', 'string', 'max:255'],
            'avatar'    => ['nullable', 'string', 'max:255'],
        ]);

        $user = new User();
        $user->user_name = $data['user_name'];
        $user->email     = $data['email'];
        $user->password  = Hash::make($data['password']);
        $user->phone_number     = $data['phone_number'] ?? null;
        $user->address   = $data['address'] ?? null;
        $user->avatar    = $data['avatar'] ?? null;
        $user->role      = 'customer'; // mặc định
        $user->save();

        // Tạo token cho SPA/mobile
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => [
                'user'  => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
            'message' => 'Register successfully',
        ], 201);
    }

    /**
     * POST /api/v1/auth/login
     * Đăng nhập, trả về access token.
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        /** @var User|null $user */
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Invalid email or password',
            ], 401);
        }

        // Có thể xóa token cũ nếu muốn chỉ cho phép 1 phiên:
        // $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => [
                'user'       => $user,
                'token'      => $token,
                'token_type' => 'Bearer',
            ],
            'message' => 'Login successfully',
        ]);
    }

    /**
     * POST /api/v1/auth/logout
     * Xoá token hiện tại (logout trên thiết bị hiện tại).
     */
    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Logout successfully',
        ]);
    }

    /**
     * GET /api/v1/auth/me
     * Lấy thông tin user hiện tại.
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user(),
            'message' => 'User profile retrieved successfully',
        ]);
    }

    /**
     * PUT/PATCH /api/v1/auth/me
     * Cập nhật thông tin profile (trừ mật khẩu).
     */
    public function updateProfile(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'user_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email'     => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->user_id, 'user_id'),
            ],
            'phone_number'   => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'avatar'  => ['nullable', 'string', 'max:255'],
        ]);

        if (isset($data['user_name'])) {
            $user->user_name = $data['user_name'];
        }
        if (isset($data['email'])) {
            $user->email = $data['email'];
        }
        if (array_key_exists('phone_number', $data)) {
            $user->phone_number = $data['phone_number'];
        }
        if (array_key_exists('address', $data)) {
            $user->address = $data['address'];
        }
        if (array_key_exists('avatar', $data)) {
            $user->avatar = $data['avatar'];
        }

        $user->save();

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * POST /api/v1/auth/change-password
     * Đổi mật khẩu (cần current_password).
     */
    public function changePassword(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'current_password'      => ['required', 'string'],
            'new_password'          => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Password changed successfully',
        ]);
    }

     // 🔸 Lấy thông tin user đang đăng nhập
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
    public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Email không tồn tại trong hệ thống.'
        ], 404);
    }

    // Tạo mật khẩu mới
    $newPassword = Str::random(length: 8);

    // Cập nhật DB
    $user->password = Hash::make($newPassword);
    $user->save();

    // Gửi email
    Mail::to($user->email)->send(new \App\Mail\ResetPasswordMail($newPassword));

    return response()->json([
        'success' => true,
        'message' => 'Mật khẩu mới đã được gửi đến email của bạn!'
    ]);
}
}