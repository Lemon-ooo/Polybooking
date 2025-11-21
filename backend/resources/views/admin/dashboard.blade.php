@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
    <h1 class="mb-4">Admin Dashboard</h1>

    {{-- Hàng thống kê nhanh --}}
    <div class="row mb-4">

        <div class="col-md-3 mb-3">
            <div class="card border-primary">
                <div class="card-body">
                    <h5 class="card-title">Room Types</h5>
                    <p class="card-text display-6">
                        {{ $roomTypesCount ?? 0 }}
                    </p>
                    <a href="{{ route('admin.room-types.index') }}" class="btn btn-sm btn-primary">
                        Manage Room Types
                    </a>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card border-success">
                <div class="card-body">
                    <h5 class="card-title">Rooms</h5>
                    <p class="card-text display-6">
                        {{ $roomsCount ?? 0 }}
                    </p>
                    <a href="{{ route('admin.rooms.index') }}" class="btn btn-sm btn-success">
                        Manage Rooms
                    </a>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card border-info">
                <div class="card-body">
                    <h5 class="card-title">Amenities</h5>
                    <p class="card-text display-6">
                        {{ $amenitiesCount ?? 0 }}
                    </p>
                    <a href="{{ route('admin.amenities.index') }}" class="btn btn-sm btn-info">
                        Manage Amenities
                    </a>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card border-warning">
                <div class="card-body">
                    <h5 class="card-title">Services</h5>
                    <p class="card-text display-6">
                        {{ $servicesCount ?? 0 }}
                    </p>
                    <a href="{{ route('admin.services.index') }}" class="btn btn-sm btn-warning">
                        Manage Services
                    </a>
                </div>
            </div>
        </div>

    </div>

    {{-- Khu vực khác, sau này có thể nhét thêm biểu đồ, booking, log hoạt động, v.v. --}}
    <div class="row">
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-header">
                    Recent Room Types
                </div>
                <div class="card-body">
                    @if(!empty($recentRoomTypes) && count($recentRoomTypes) > 0)
                        <ul class="list-group">
                            @foreach($recentRoomTypes as $rt)
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        {{ $rt->room_type_name }}
                                        <small class="text-muted d-block">
                                            ID: {{ $rt->room_type_id }} · Max Guests: {{ $rt->max_guests }}
                                        </small>
                                    </span>
                                    <a href="{{ route('admin.room-types.edit', $rt->room_type_id) }}"
                                       class="btn btn-sm btn-outline-primary">
                                        Edit
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    @else
                        <p class="mb-0">No room types yet.</p>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-header">
                    Recent Rooms
                </div>
                <div class="card-body">
                    @if(!empty($recentRooms) && count($recentRooms) > 0)
                        <ul class="list-group">
                            @foreach($recentRooms as $room)
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        Room {{ $room->room_number }}
                                        <small class="text-muted d-block">
                                            Type: {{ $room->roomType->room_type_name ?? '-' }} · Status: {{ $room->room_status }}
                                        </small>
                                    </span>
                                    <a href="{{ route('admin.rooms.edit', $room->room_id) }}"
                                       class="btn btn-sm btn-outline-secondary">
                                        Edit
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    @else
                        <p class="mb-0">No rooms yet.</p>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
