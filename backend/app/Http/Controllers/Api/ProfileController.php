<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * GET /api/profile
     * Lấy thông tin user hiện tại
     */
    public function show(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Profile retrieved successfully.',
        ]);
    }

    /**
     * PUT /api/profile
     * Cập nhật thông tin profile (không đổi email)
     */
    public function update(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'user_name'    => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:50',
            'address'      => 'nullable|string|max:255',
            'date_of_birth'=> 'nullable|date',
            'avatar'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Xử lý avatar
        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Profile updated successfully.',
        ]);
    }

    /**
     * PUT /api/profile/password
     * Cập nhật mật khẩu
     */
    public function updatePassword(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->password = Hash::make($data['password']);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
        ]);
    }

    /**
     * DELETE /api/profile
     * Xóa tài khoản hiện tại
     */
    public function destroy(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $request->validate([
            'confirm_password' => 'required|string',
        ]);

        if (!Hash::check($request->input('confirm_password'), $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Confirm password is incorrect.',
            ], 422);
        }

        // Xóa avatar nếu có
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ]);
    }
}
