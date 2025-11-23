<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Amenity;
use App\Models\Service;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        // thống kê phòng
        $roomTypesCount = RoomType::count();
        $roomsCount     = Room::count();
        $amenitiesCount = Amenity::count();
        $servicesCount  = Service::count();

        // thống kê user
        $usersCount     = User::count();
        $adminsCount    = User::where('role', 'admin')->count();
        $customersCount = User::where('role', 'customer')->count();

        $recentRoomTypes = RoomType::orderByDesc('created_at')->limit(5)->get();
        $recentRooms     = Room::with('roomType')->orderByDesc('created_at')->limit(5)->get();
        $recentUsers     = User::orderByDesc('created_at')->limit(5)->get();

        return view('admin.dashboard', compact(
            'roomTypesCount',
            'roomsCount',
            'amenitiesCount',
            'servicesCount',
            'usersCount',
            'adminsCount',
            'customersCount',
            'recentRoomTypes',
            'recentRooms',
            'recentUsers'
        ));
    }
}
