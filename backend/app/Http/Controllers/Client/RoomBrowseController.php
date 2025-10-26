<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Room;

class RoomBrowseController extends Controller
{
    public function index()
    {
        // Giả định đã có model Room và quan hệ roomType()
        $rooms = Room::query()
            ->with(['roomType'])          // có thể bỏ nếu chưa cần
            ->latest('id')
            ->paginate(9)
            ->withQueryString();

        return view('client.rooms.index', compact('rooms'));
    }
}
