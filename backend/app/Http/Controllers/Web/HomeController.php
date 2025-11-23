<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RoomType;

class HomeController extends Controller
{
    public function index()
    {
        // Lấy tất cả loại phòng + số phòng + ảnh chính
        $roomTypes = RoomType::withCount('rooms')
            ->with(['images' => function ($q) {
                $q->orderBy('image_type', 'asc')->orderBy('sort_order', 'asc');
            }])
            ->orderBy('base_price', 'asc')
            ->get();

        return view('home', compact('roomTypes'));
    }
}
