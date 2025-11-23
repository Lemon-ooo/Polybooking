@extends('layouts.admin')

@section('title', 'Login')

@section('content')
<h1>Đăng nhập</h1>

@if(session('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
@endif

@if($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach($errors->all() as $e)
                <li>{{ $e }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('login.post') }}" method="POST">
    @csrf

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

    <div class="mb-3 form-check">
        <input type="checkbox" name="remember" id="remember" class="form-check-input">
        <label for="remember" class="form-check-label">Ghi nhớ đăng nhập</label>
    </div>

    <button class="btn btn-primary" type="submit">Đăng nhập</button>
    <a href="{{ route('register') }}" class="btn btn-link">Đăng ký</a>
</form>
@endsection
