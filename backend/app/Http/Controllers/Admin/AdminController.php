<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller; // ✅ Sửa namespace
use App\Models\Room;
use App\Models\User;
use App\Models\RoomType;
use Illuminate\View\View;

class AdminController extends Controller // ✅ Extend đúng class
{
    /**
     * Display admin dashboard.
     */
    public function index(): View
    {
        $stats = [
            'totalRooms' => Room::count(),
            'availableRooms' => Room::where('room_status', Room::STATUS_AVAILABLE)->count(),
            'occupiedRooms' => Room::where('room_status', Room::STATUS_IN_USE)->count(),
            'totalRoomTypes' => RoomType::count(),
            'totalUsers' => User::count(),
        ];

        $recentRooms = Room::with('roomType')
            ->latest()
            ->take(5)
            ->get();

        return view('admin.dashboard', compact('stats', 'recentRooms'));
    }
}