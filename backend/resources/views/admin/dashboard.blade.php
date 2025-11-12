@extends('layouts.admin')

@section('content')
<div class="page-container">
    <div class="header-row">
        <h2 class="page-title">🏠 Trang quản trị</h2>
    </div>

    <div class="card">
        <p>Chào mừng bạn đến với <strong>trang Admin</strong>! 👋</p>
        <ul>
            <li><a href="{{ route('web.room-types.index') }}">Quản lý loại phòng</a></li>
            <li><a href="{{ route('web.rooms.index') }}">Quản lý phòng</a></li>
        </ul>
    </div>
</div>

<style>
.page-container {
    background: #f4f6f9;
    padding: 25px 35px;
    border-radius: 8px;
}
.header-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.page-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    border-left: 5px solid #2196F3;
    padding-left: 10px;
}
.card {
    background: #fff;
    border-radius: 12px;
    padding: 25px 30px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}
.card a {
    text-decoration: none;
    color: #2196F3;
}
.card a:hover {
    text-decoration: underline;
}
</style>
@endsection
