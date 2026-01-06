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
            'date_of_birth' => $user->date_of_birth?->format('Y-m-d'), // Trả về null nếu không có
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

    // Validate dữ liệu đầu vào trước khi update
    $validatedData = $request->validate([
        'user_name'     => 'required|string|max:255',
        'phone_number'  => 'nullable|string|max:20',
        'address'       => 'nullable|string|max:500',
        'date_of_birth' => 'nullable|date|date_format:Y-m-d', // Chỉ validate, không gán rule vào value
    ]);

    try {
        // Update chỉ những field được validate
        $user->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công!',
            'data'    => $user->fresh(), // Trả về user mới nhất
        ]);
    } catch (\Exception $e) {
        \Log::error('Profile update failed: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Cập nhật thất bại. Vui lòng thử lại.',
        ], 500);
    }
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