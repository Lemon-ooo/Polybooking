@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Tạo booking mới</h1>

    {{-- Thông báo lỗi --}}
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $e)
                    <li>{{ $e }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Thông báo flash --}}
    @if (session('ok'))
        <div class="alert alert-success">{{ session('ok') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    <form method="POST" action="{{ route('admin.bookings.store') }}">
        @csrf

        {{-- Thông tin chung --}}
        <div class="card mb-3">
            <div class="card-header">Thông tin chung</div>
            <div class="card-body row g-3">
                <div class="col-md-4">
                    <label class="form-label fw-bold">Người đặt</label>
                    <select name="user_id" class="form-select" required>
                        <option value="">-- Chọn user --</option>
                        @foreach($users as $u)
                            <option value="{{ $u->id }}"
                                @selected(old('user_id') == $u->id)>
                                {{ $u->name }} (ID: {{ $u->id }})
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-8">
                    <label class="form-label fw-bold">Yêu cầu đặc biệt</label>
                    <textarea name="special_request" rows="2" class="form-control"
                              placeholder="VD: tầng cao, gần thang máy, ...">{{ old('special_request') }}</textarea>
                </div>
            </div>
        </div>

        {{-- Phòng đặt (hiện tại 1 loại phòng: index 0) --}}
        <div class="card mb-3">
            <div class="card-header">Thông tin phòng</div>
            <div class="card-body row g-3 booking-item-row">
                <div class="col-md-4">
                    <label class="form-label fw-bold">Loại phòng</label>
                    <select name="items[0][room_type_id]"
                            class="form-select room-type-select"
                            data-price-target="#room-type-price-0"
                            required>
                        <option value="" data-price="0">-- Chọn loại phòng --</option>
                        @foreach($roomTypes as $rt)
                     
                        @endphp
                            <option value="{{ $rt->id }}"
                                    data-price="{{ $rt->base_price }}"
                                    @selected(old('items.0.room_type_id') == $rt->id)>
                                {{ $rt->name }}
                                ({{ number_format($rt->base_price, 0, ',', '.') }} VNĐ/đêm)
                            </option>
                        @endforeach

                    </select>
                    <small class="text-muted d-block mt-1">
                        Giá/đêm:
                        <span id="room-type-price-0" class="room-price-display">
                            0 VNĐ
                        </span>
                    </small>
                </div>

                <div class="col-md-3">
                    <label class="form-label fw-bold">Ngày nhận phòng</label>
                    <input type="date"
                           name="items[0][check_in_date]"
                           value="{{ old('items.0.check_in_date') }}"
                           class="form-control"
                           required>
                </div>

                <div class="col-md-3">
                    <label class="form-label fw-bold">Ngày trả phòng</label>
                    <input type="date"
                           name="items[0][check_out_date]"
                           value="{{ old('items.0.check_out_date') }}"
                           class="form-control"
                           required>
                </div>

                <div class="col-md-2">
                    <label class="form-label fw-bold">Số khách</label>
                    <input type="number"
                           name="items[0][num_guests]"
                           value="{{ old('items.0.num_guests', 2) }}"
                           min="1"
                           class="form-control"
                           required>
                </div>
            </div>
        </div>

        {{-- Dịch vụ kèm (tuỳ chọn) --}}
        <div class="card mb-3">
            <div class="card-header">Dịch vụ kèm</div>
            <div class="card-body">
                @forelse($services as $sv)
                    <div class="row g-2 align-items-center mb-2">
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input service-check"
                                       type="checkbox"
                                       value="{{ $sv->id }}"
                                       id="service_{{ $sv->id }}"
                                       name="services[{{ $sv->id }}][service_id]">
                                <label class="form-check-label" for="service_{{ $sv->id }}">
                                    {{ $sv->name }}
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label mb-0">Số lượng</label>
                            <input type="number"
                                   class="form-control form-control-sm"
                                   name="services[{{ $sv->id }}][quantity]"
                                   value="1" min="1">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label mb-0">Đơn giá</label>
                            <input type="number"
                                   class="form-control form-control-sm"
                                   name="services[{{ $sv->id }}][price]"
                                   value="{{ $sv->price }}"
                                   step="1000">
                        </div>
                        <div class="col-md-3">
                            <span class="text-muted">
                                (~ {{ number_format($sv->price, 0, ',', '.') }} VNĐ)
                            </span>
                        </div>
                    </div>
                @empty
                    <p class="text-muted mb-0">Chưa có dịch vụ nào.</p>
                @endforelse
            </div>
        </div>

        {{-- Nút submit --}}
        <div class="d-flex justify-content-between">
            <a href="{{ route('admin.bookings.index') }}" class="btn btn-outline-secondary">
                ⬅ Quay lại
            </a>
            <button type="submit" class="btn btn-success">
                💾 Tạo booking
            </button>
        </div>
    </form>
</div>

{{-- JS hiển thị giá loại phòng theo base_pirce --}}
<script>
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.room-type-select').forEach(function (select) {
            function updatePrice() {
                const option = select.options[select.selectedIndex];
                const price  = option ? parseFloat(option.dataset.price || 0) : 0;
                const target = document.querySelector(select.dataset.priceTarget);

                if (target) {
                    const formatted = new Intl.NumberFormat('vi-VN').format(price);
                    target.textContent = formatted + ' VNĐ';
                }
            }

            select.addEventListener('change', updatePrice);
            updatePrice(); // khởi tạo theo giá đang chọn (nếu có)
        });
    });
</script>
@endsection
