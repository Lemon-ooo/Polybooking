<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    /**
     * Danh sách loại phòng (admin).
     * total_rooms = rooms_count (đếm từ bảng rooms), không lấy từ DB column.
     */
    public function index()
    {
        // rooms_count được sinh ra bởi withCount('rooms')
        $roomTypes = RoomType::withCount('rooms')->paginate(10);

        return view('admin.room_types.index', compact('roomTypes'));
    }

    /**
     * Form tạo loại phòng.
     */
    public function create()
    {
        $amenities = Amenity::all();

        return view('admin.room_types.create', compact('amenities'));
    }

    /**
     * Lưu loại phòng mới.
     * total_rooms không còn trong validate, logic chỉ phụ thuộc vào rooms bảng riêng.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_name' => 'required|string|max:255',
            'base_price'     => 'required|numeric|min:0',
            'max_guests'     => 'required|integer|min:1',
            'description'    => 'nullable|string',
            'room_type_image'=> 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'amenity_ids'    => 'nullable|array',
            'amenity_ids.*'  => 'exists:amenities,amenity_id',
        ]);

        // Xử lý ảnh chính
        if ($request->hasFile('room_type_image')) {
            $path = $request->file('room_type_image')->store('room_types', 'public');
            $validated['room_type_image'] = $path;
        }

        // Tạo room type mới
        $roomType = RoomType::create($validated);

        // Gán amenities (nếu có)
        if (!empty($validated['amenity_ids'] ?? null)) {
            $roomType->amenities()->sync($validated['amenity_ids']);
        }

        return redirect()
            ->route('admin.room-types.index')
            ->with('success', 'Tạo loại phòng thành công.');
    }

    /**
     * Xem chi tiết 1 loại phòng.
     * total_rooms = rooms->count()
     */
    public function show($id)
    {
        $roomType = RoomType::with(['rooms', 'amenities', 'images'])
            ->withCount('rooms')
            ->findOrFail($id);

        return view('admin.room_types.show', compact('roomType'));
    }

    /**
     * Form chỉnh sửa loại phòng.
     */
    public function edit($id)
    {
        $roomType  = RoomType::with('amenities')->findOrFail($id);
        $amenities = Amenity::all();

        return view('admin.room_types.edit', compact('roomType', 'amenities'));
    }

    /**
     * Cập nhật loại phòng.
     * Không đụng gì tới total_rooms, vì nó là số đếm từ bảng rooms.
     */
    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);

        $validated = $request->validate([
            'room_type_name' => 'required|string|max:255',
            'base_price'     => 'required|numeric|min:0',
            'max_guests'     => 'required|integer|min:1',
            'description'    => 'nullable|string',
            'room_type_image'=> 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'amenity_ids'    => 'nullable|array',
            'amenity_ids.*'  => 'exists:amenities,amenity_id',
        ]);

        // Nếu upload ảnh mới thì xóa ảnh cũ (nếu có)
        if ($request->hasFile('room_type_image')) {
            if ($roomType->room_type_image && Storage::disk('public')->exists($roomType->room_type_image)) {
                Storage::disk('public')->delete($roomType->room_type_image);
            }

            $path = $request->file('room_type_image')->store('room_types', 'public');
            $validated['room_type_image'] = $path;
        }

        $roomType->update($validated);

        // Cập nhật amenities
        $roomType->amenities()->sync($validated['amenity_ids'] ?? []);

        return redirect()
            ->route('admin.room-types.index')
            ->with('success', 'Cập nhật loại phòng thành công.');
    }

    /**
     * Xóa loại phòng.
     */
    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);

        // Xóa ảnh chính nếu có
        if ($roomType->room_type_image && Storage::disk('public')->exists($roomType->room_type_image)) {
            Storage::disk('public')->delete($roomType->room_type_image);
        }

        $roomType->delete();

        return redirect()
            ->route('admin.room-types.index')
            ->with('success', 'Xóa loại phòng thành công.');
    }
}
