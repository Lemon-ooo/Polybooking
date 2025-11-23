@extends('layouts.admin')

@section('title', 'Register')

@section('content')
<h1>Đăng ký tài khoản</h1>

@if($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach($errors->all() as $e)
                <li>{{ $e }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('register.post') }}" method="POST">
    @csrf

    <div class="mb-3">
        <label class="form-label">Tên hiển thị</label>
        <input type="text" name="user_name" class="form-control"
               value="{{ old('user_name') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" name="email" class="form-control"
               value="{{ old('email') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input type="password" name="password" class="form-control"
               required>
    </div>

    <div class="mb-3">
        <label class="form-label">Nhập lại mật khẩu</label>
        <input type="password" name="password_confirmation" class="form-control"
               required>
    </div>

    <button class="btn btn-primary" type="submit">Đăng ký</button>
    <a href="{{ route('login') }}" class="btn btn-link">Đã có tài khoản? Đăng nhập</a>
</form>
@endsection
