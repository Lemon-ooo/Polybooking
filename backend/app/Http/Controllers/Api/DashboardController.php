<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Amenity;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            "roomTypes"    => RoomType::count(),
            "rooms"        => Room::count(),
            "amenities"    => Amenity::count(),
            "services"     => Service::count(),

            "totalUsers"   => User::count(),
            "admins"       => User::where("role", "admin")->count(),
            "customers"    => User::where("role", "customer")->count(),

            "recentRoomTypes" => RoomType::orderByDesc("created_at")->limit(5)->get(),
            "recentRooms"     => Room::orderByDesc("created_at")->limit(5)->get(),
            "recentUsers"     => User::orderByDesc("created_at")->limit(5)->get(),
        ]);
    }
}