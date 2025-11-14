@extends('layouts.admin')

@section('content')
  <div class="page-container">
    <div class="header-row">
      {{-- ✅ Cập nhật tiêu đề và link Thêm mới cho Event --}}
      <h2 class="page-title">📅 Danh sách Sự kiện</h2>
      <a href="{{ route('web.events.create') }}" class="btn btn-primary">➕ Thêm sự kiện mới</a>
    </div>

    @if (session('success'))
      <div class="alert alert-success mb-3" style="padding: 15px; background: #d4edda; color: #155724; border-radius: 5px;">
        {{ session('success') }}
      </div>
    @endif

    <div class="card">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên sự kiện</th>
            <th>Mô tả</th>
            {{-- ✅ Thêm trường mới cho Event --}}
            <th>Ngày</th>
            <th>Địa điểm</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {{-- ✅ Lặp qua biến $events --}}
          @forelse ($events as $event)
            <tr>
              <td>{{ $event->id }}</td>
              <td>{{ $event->name }}</td>
              <td>{{ $event->description }}</td>
              {{-- ✅ Hiển thị các trường mới --}}
              <td>{{ \Carbon\Carbon::parse($event->date)->format('d/m/Y') }}</td>
              <td>{{ $event->location }}</td>
              <td>
                @if ($event->image)
                  <img src="{{ $event->image }}" alt="Hình sự kiện" width="60">
                @else
                  <em>Không có ảnh</em>
                @endif
              </td>
              <td>
                <div class="button-group">
                  {{-- ✅ Cập nhật routes cho Event --}}
                  <a href="{{ route('web.events.show', $event->id) }}" class="btn btn-primary">xem</a>
                  <a href="{{ route('web.events.edit', $event->id) }}" class="btn btn-primary">✏️ Sửa</a>
                  <form action="{{ route('web.events.destroy', $event->id) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger"
                      onclick="return confirm('Bạn có chắc chắn muốn xóa sự kiện này?')">🗑️ Xóa</button>
                  </form>
                </div>
              </td>
            </tr>
          @empty
            <tr>
              <td colspan="7" class="text-center text-muted">Chưa có sự kiện nào</td>
            </tr>
          @endforelse
        </tbody>
      </table>
    </div>
  </div>

  {{-- Giữ nguyên style CSS --}}
  <style>
    .page-container {
      background: #f4f6f9;
      padding: 25px 35px;
      border-radius: 8px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
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

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
    }

    .table-dark {
      background-color: #343a40;
      color: #fff;
      /* Đã đổi lại màu trắng cho header table */
    }

    .button-group {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background-color: #2196F3;
      color: #fff;
    }

    .btn-primary:hover {
      background-color: #1976D2;
    }

    .btn-danger {
      background-color: #f44336;
      color: #fff;
    }

    .btn-danger:hover {
      background-color: #d32f2f;
    }
  </style>
@endsection