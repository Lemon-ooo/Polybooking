<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class ClientProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'user_name'    => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address'      => 'nullable|string|max:255',
        ]);

        $user->update($request->only('user_name', 'phone_number', 'address'));

        // TRẢ VỀ TOKEN MỚI ĐỂ TRÁNH BỊ LOGOUT
        return response()->json([
            'message' => 'Cập nhật thành công',
            'data'    => $user->only(['id', 'user_name', 'email', 'phone_number', 'address', 'avatar', 'role']),
            'token'   => $user->createToken('sanctum-token')->plainTextToken,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password'      => 'required',
            'password'              => 'required|min:6|confirmed',
            'password_confirmation' => 'required',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Mật khẩu hiện tại không đúng'
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // QUAN TRỌNG: XÓA TẤT CẢ TOKEN CŨ + TẠO TOKEN MỚI
        $user->tokens()->delete();
        $newToken = $user->createToken('sanctum-token')->plainTextToken;

        return response()->json([
            'message' => 'Đổi mật khẩu thành công',
            'token'   => $newToken,
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120'
        ]);

        $user = $request->user();

        if ($user->avatar && $user->avatar !== '/storage/avatars/default.jpg') {
            $oldPath = str_replace('/storage/', '', $user->avatar);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = '/storage/' . $path;
        $user->save();

        // Cũng trả token mới cho chắc chắn (dù ít khi bị logout ở đây)
        return response()->json([
            'message' => 'Upload avatar thành công',
            'data'    => ['avatar' => $user->avatar],
            'token'   => $user->createToken('sanctum-token')->plainTextToken,
        ]);
    }
}