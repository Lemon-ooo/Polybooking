@extends('layouts.admin')

@section('title', 'My Profile')

@section('content')
<h1>Thông tin tài khoản</h1>

@if(session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
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

<div class="row">
    <div class="col-md-6">
        <h3>Thông tin cá nhân</h3>
        <form action="{{ route('profile.update') }}" method="POST" enctype="multipart/form-data">
            @csrf

            <div class="mb-3">
                <label class="form-label">Tên hiển thị</label>
                <input type="text" name="user_name" class="form-control"
                       value="{{ old('user_name', $user->user_name) }}" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Email (không chỉnh sửa tại đây)</label>
                <input type="email" class="form-control" value="{{ $user->email }}" disabled>
            </div>

            <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input type="text" name="phone_number" class="form-control"
                       value="{{ old('phone_number', $user->phone_number) }}">
            </div>

            <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input type="text" name="address" class="form-control"
                       value="{{ old('address', $user->address) }}">
            </div>

            <div class="mb-3">
                <label class="form-label">Ngày sinh</label>
                <input type="date" name="date_of_birth" class="form-control"
                       value="{{ old('date_of_birth', optional($user->date_of_birth)->format('Y-m-d')) }}">
            </div>

            <div class="mb-3">
                <label class="form-label">Avatar</label><br>
                @if($user->avatar)
                    <img src="{{ asset('storage/'.$user->avatar) }}" style="max-width:120px"
                         class="mb-2 d-block">
                @endif
                <input type="file" name="avatar" class="form-control">
            </div>

            <button class="btn btn-primary" type="submit">Cập nhật</button>
        </form>
    </div>

    <div class="col-md-6">
        <h3>Đổi mật khẩu</h3>
        <form action="{{ route('profile.update_password') }}" method="POST">
            @csrf

            <div class="mb-3">
                <label class="form-label">Mật khẩu hiện tại</label>
                <input type="password" name="current_password" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Mật khẩu mới</label>
                <input type="password" name="password" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Nhập lại mật khẩu mới</label>
                <input type="password" name="password_confirmation" class="form-control" required>
            </div>

            <button class="btn btn-warning" type="submit">Đổi mật khẩu</button>
        </form>

        <hr>

        <h3>Hủy tài khoản</h3>
        <form action="{{ route('profile.destroy') }}" method="POST"
              onsubmit="return confirm('Bạn chắc chắn muốn hủy tài khoản? Hành động này không thể hoàn tác.');">
            @csrf
            @method('DELETE')

            <div class="mb-3">
                <label class="form-label">Nhập lại mật khẩu để xác nhận</label>
                <input type="password" name="confirm_password" class="form-control" required>
            </div>

            <button class="btn btn-danger" type="submit">Hủy tài khoản</button>
        </form>
    </div>
</div>
@endsection
