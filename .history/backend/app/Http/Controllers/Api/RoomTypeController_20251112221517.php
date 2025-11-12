<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    /**
     * Hiển thị danh sách loại phòng (trả về JSON)
     */
    public function index()
    {
        $roomTypes = RoomType::all();

        return response()->json([
            'success' => true,
            'message' => 'Danh sách loại phòng',
            'data' => $roomTypes
        ]);
    }

    /**
     * Hiển thị chi tiết 1 loại phòng
     */
    public function show($id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy loại phòng'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $roomType
        ]);
    }
}
