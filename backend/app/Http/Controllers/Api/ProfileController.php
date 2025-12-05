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
     * GET /api/client/profile hoặc /api/profile
     */
   public function show(Request $request)
{
    // LUÔN load lại user mới nhất từ DB
    $user = $request->user()->fresh();

    return response()->json([
        'success' => true,
        'data' => [
            'id' => $user->id,
            'user_name' => $user->user_name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'address' => $user->address,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'avatar_url' => $user->avatar
                ? asset('storage/' . $user->avatar)
                : null,
        ]
    ]);
}


    /**
     * PUT /api/client/profile
     */
   public function update(Request $request)
{
    $user = $request->user();

    $user->update([
        'user_name' => $request->user_name,
        'phone_number' => $request->phone_number,
        'address' => $request->address,
    ]);

    $user = $user->fresh();

    return response()->json([
        'success' => true,
        'data' => [
            'user_name' => $user->user_name,
            'phone_number' => $user->phone_number,
            'address' => $user->address,
            'avatar_url' => $user->avatar ? asset('storage/'.$user->avatar) : null,
        ]
    ]);
}


    /**
     * PUT /api/client/profile/password
     */
    public function updatePassword(Request $request)
    {
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
     * POST /api/client/profile/avatar – UPLOAD RIÊNG (frontend đang dùng)
     */
   public function uploadAvatar(Request $request)
{
    $request->validate([
        'avatar' => 'required|image|max:2048',
    ]);

    $user = $request->user();

    // Xóa avatar cũ
    if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
        Storage::disk('public')->delete($user->avatar);
    }

    // Lưu avatar mới
    $path = $request->file('avatar')->store('avatars', 'public');

    $user->avatar = $path;
    $user->save();

    // ⚡ SỬ DỤNG FRESH ĐỂ LOAD DỮ LIỆU MỚI NHẤT
    $user = $user->fresh();

    return response()->json([
        'success' => true,
        'avatar_url' => asset('storage/' . $user->avatar),
    ]);
}


    /**
     * DELETE /api/client/profile
     */
    public function destroy(Request $request)
    {
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

        // Xóa avatar
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        Auth::guard('web')->logout();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ]);
    }
}