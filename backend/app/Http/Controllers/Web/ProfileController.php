<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Hiển thị form chỉnh sửa thông tin cá nhân
     */
    public function edit()
    {
        /** @var User $user */
        $user = Auth::user();

        return view('profile.edit', compact('user'));
    }

    /**
     * Cập nhật thông tin profile (không đổi email tại đây)
     */
    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

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

        // 🔥 Eloquent model nên update() được
        $user->update($data);

        return redirect()->route('profile.edit')->with('success', 'Cập nhật tài khoản thành công.');
    }

    /**
     * Cập nhật mật khẩu
     */
    public function updatePassword(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $data = $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($data['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'Mật khẩu hiện tại không đúng.',
            ]);
        }

        $user->password = Hash::make($data['password']);
        $user->save();  // 🔥 save() là method của Eloquent model

        return redirect()->route('profile.edit')->with('success', 'Đổi mật khẩu thành công.');
    }

    /**
     * Hủy (xóa) tài khoản của chính mình
     */
    public function destroy(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'confirm_password' => 'required|string',
        ]);

        if (!Hash::check($request->input('confirm_password'), $user->password)) {
            return back()->withErrors([
                'confirm_password' => 'Mật khẩu xác nhận không đúng.',
            ]);
        }

        // Xóa avatar nếu có
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        Auth::logout();

        // 🔥 delete() là method của Eloquent model
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Tài khoản đã được hủy.');
    }
}
