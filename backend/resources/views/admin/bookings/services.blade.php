<div class="card mb-3">
    <div class="card-header">Dịch vụ & Thiệt hại</div>
    <div class="card-body">

        @if ($booking->status === 'in_use')

        {{-- ADD SERVICE --}}
        <form method="POST"
              action="{{ route('admin.bookings.service', $booking->id) }}"
              class="mb-3">
            @csrf
            <h6>Thêm dịch vụ</h6>
            <input name="service_name" class="form-control mb-2"
                   placeholder="Tên dịch vụ">
            <input name="price" type="number" class="form-control mb-2"
                   placeholder="Giá">
            <button class="btn btn-primary">Thêm dịch vụ</button>
        </form>

        {{-- ADD DAMAGE --}}
        <form method="POST"
              action="{{ route('admin.bookings.damage', $booking->id) }}">
            @csrf
            <h6>Ghi nhận thiệt hại</h6>
            <input name="description" class="form-control mb-2"
                   placeholder="Mô tả">
            <input name="cost" type="number" class="form-control mb-2"
                   placeholder="Chi phí">
            <button class="btn btn-danger">Thêm thiệt hại</button>
        </form>

        @else
            <p class="text-muted">Chỉ thêm dịch vụ khi khách đang ở</p>
        @endif

    </div>
</div>
