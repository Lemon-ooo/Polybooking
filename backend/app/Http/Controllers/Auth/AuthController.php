<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /** Form login */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /** Xử lý login */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Điều hướng theo role
            if (Auth::user()->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('profile.edit');
        }

        return back()->withErrors([
            'email' => 'Email hoặc mật khẩu không đúng.',
        ])->onlyInput('email');
    }

    /** Form đăng ký cho customer */
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    /** Xử lý đăng ký: luôn là customer */
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

        Auth::login($user);

        return redirect()->route('profile.edit');
    }

    /** Logout */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
