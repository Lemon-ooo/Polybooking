@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
    <h1 class="mb-4">Admin Dashboard</h1>

    <div class="row mb-4">
        <div class="col-md-3 mb-3">
            <div class="card border-primary">
                <div class="card-body">
                    <h5 class="card-title">Room Types</h5>
                    <p class="card-text display-6">{{ $roomTypesCount ?? 0 }}</p>
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
                    <p class="card-text display-6">{{ $roomsCount ?? 0 }}</p>
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
                    <p class="card-text display-6">{{ $amenitiesCount ?? 0 }}</p>
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
                    <p class="card-text display-6">{{ $servicesCount ?? 0 }}</p>
                    <a href="{{ route('admin.services.index') }}" class="btn btn-sm btn-warning">
                        Manage Services
                    </a>
                </div>
            </div>
        </div>
    </div>

    {{-- Thống kê user --}}
    <div class="row mb-4">
        <div class="col-md-4 mb-3">
            <div class="card border-dark">
                <div class="card-body">
                    <h5 class="card-title">Users</h5>
                    <p class="card-text display-6">{{ $usersCount ?? 0 }}</p>
                    <p class="mb-0">
                        Admin: <strong>{{ $adminsCount ?? 0 }}</strong> <br>
                        Customer: <strong>{{ $customersCount ?? 0 }}</strong>
                    </p>
                    <a href="{{ route('admin.users.index') }}" class="btn btn-sm btn-dark mt-2">
                        Manage Users
                    </a>
                </div>
            </div>
        </div>
    </div>

    {{-- Bảng dưới: room types / rooms / users gần đây --}}
    <div class="row">
        <div class="col-md-4 mb-3">
            <div class="card">
                <div class="card-header">
                    Recent Room Types
                </div>
                <div class="card-body">
                    @if($recentRoomTypes->count())
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

        <div class="col-md-4 mb-3">
            <div class="card">
                <div class="card-header">
                    Recent Rooms
                </div>
                <div class="card-body">
                    @if($recentRooms->count())
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

        <div class="col-md-4 mb-3">
            <div class="card">
                <div class="card-header">
                    Recent Users
                </div>
                <div class="card-body">
                    @if($recentUsers->count())
                        <ul class="list-group">
                            @foreach($recentUsers as $u)
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        {{ $u->user_name }}
                                        <small class="text-muted d-block">
                                            {{ $u->email }} · Role: {{ $u->role }}
                                        </small>
                                    </span>
                                    <a href="{{ route('admin.users.edit', $u->user_id) }}"
                                       class="btn btn-sm btn-outline-dark">
                                        Set Role
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    @else
                        <p class="mb-0">No users yet.</p>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
