@extends('layouts.admin')

@section('title', 'Set User Role')

@section('content')
<h1>Cập nhật quyền tài khoản</h1>

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

<div class="mb-3">
    <strong>ID:</strong> {{ $user->user_id }} <br>
    <strong>Tên:</strong> {{ $user->user_name }} <br>
    <strong>Email:</strong> {{ $user->email }} <br>
</div>

<form action="{{ route('admin.users.update', $user->user_id) }}" method="POST">
    @csrf
    @method('PUT')

    <div class="mb-3">
        <label class="form-label">Role</label>
        <select name="role" class="form-control" required>
            <option value="customer" {{ $user->role === 'customer' ? 'selected' : '' }}>Customer</option>
            <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
        </select>
    </div>

    <button class="btn btn-primary" type="submit">Lưu</button>
    <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Quay lại</a>
</form>
@endsection
