<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Amenity;
use App\Models\Service;

class DashboardController extends Controller
{
    public function index()
    {
        $roomTypesCount = RoomType::count();
        $roomsCount     = Room::count();
        $amenitiesCount = Amenity::count();
        $servicesCount  = Service::count();

        $recentRoomTypes = RoomType::orderByDesc('created_at')->limit(5)->get();
        $recentRooms     = Room::with('roomType')->orderByDesc('created_at')->limit(5)->get();

        return view('admin.dashboard', compact(
            'roomTypesCount',
            'roomsCount',
            'amenitiesCount',
            'servicesCount',
            'recentRoomTypes',
            'recentRooms'
        ));
    }
}
