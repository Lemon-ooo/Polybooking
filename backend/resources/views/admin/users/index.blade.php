@extends('layouts.admin')

@section('title', 'Users')

@section('content')
<h1>Quản lý tài khoản</h1>

<table class="table table-bordered">
    <thead>
    <tr>
        <th>ID</th>
        <th>Tên</th>
        <th>Email</th>
        <th>Role</th>
        <th>Ngày tạo</th>
        <th>Hành động</th>
    </tr>
    </thead>
    <tbody>
    @forelse($users as $u)
        <tr>
            <td>{{ $u->user_id }}</td>
            <td>{{ $u->user_name }}</td>
            <td>{{ $u->email }}</td>
            <td>
                <span class="badge bg-{{ $u->role === 'admin' ? 'danger' : 'secondary' }}">
                    {{ $u->role }}
                </span>
            </td>
            <td>{{ $u->created_at }}</td>
            <td>
                <a href="{{ route('admin.users.edit', $u->user_id) }}" class="btn btn-sm btn-warning">
                    Set Role
                </a>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="6">Chưa có tài khoản nào.</td>
        </tr>
    @endforelse
    </tbody>
</table>

{{ $users->links() }}
@endsection
