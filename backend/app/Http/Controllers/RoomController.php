<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    /**
     * GET /admin/rooms
     * Liệt kê phòng (kèm loại phòng), phân trang.
     */
    public function index()
    {
        $rooms = Room::query()
            ->with(['roomType:id,name'])
            ->select(['id','room_number','room_type_id','description','price','status','created_at'])
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        // View KHÔNG có tiền tố admin (theo cấu trúc thư mục của bro)
        return view('rooms.index', compact('rooms'));
    }

    /**
     * GET /admin/rooms/create
     * Form tạo mới phòng.
     */
    public function create()
    {
        $roomTypes = RoomType::query()->orderBy('name')->get(['id','name']);

        return view('rooms.create', compact('roomTypes'));
    }

    /**
     * POST /admin/rooms
     * Lưu phòng mới.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'room_number'   => ['required','string','max:255','unique:rooms,room_number'],
            'room_type_id'  => ['required','integer','exists:room_types,id'],
            'description'   => ['nullable','string'],
            'price'         => ['nullable','numeric','between:0,9999999999.99'],
            // Cho phép 3 trạng thái phổ biến; tùy DB của bro có thể mở rộng thêm
            // 'status'        => ['required', Rule::in(['available','occupied','maintenance'])],
        ]);

        Room::create($data);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Tạo phòng thành công.');
    }

    /**
     * GET /admin/rooms/{room}
     * Trang chi tiết phòng.
     */
    public function show(Room $room)
    {
        $room->load(['roomType:id,name']);

        return view('rooms.show', compact('room'));
    }

    /**
     * GET /admin/rooms/{room}/edit
     * Form chỉnh sửa phòng.
     */
    public function edit(Room $room)
    {
        $roomTypes = RoomType::query()->orderBy('name')->get(['id','name']);

        return view('rooms.edit', compact('room','roomTypes'));
    }

    /**
     * PUT/PATCH /admin/rooms/{room}
     * Cập nhật phòng.
     */
    public function update(Request $request, Room $room)
    {
        $data = $request->validate([
            'room_number'   => [
                'required','string','max:255',
                Rule::unique('rooms','room_number')->ignore($room->id),
            ],
            'room_type_id'  => ['required','integer','exists:room_types,id'],
            'description'   => ['nullable','string'],
            'price'         => ['nullable','numeric','between:0,9999999999.99'],
            //'status'        => ['required', Rule::in(['available','occupied','maintenance'])],
        ]);

        $room->update($data);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Cập nhật phòng thành công.');
    }

    /**
     * DELETE /admin/rooms/{room}
     * Xóa phòng.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Đã xóa phòng.');
    }
}
