<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    /**
     * Hiển thị danh sách sự kiện kèm phân trang cho Refine/Ant Design.
     */
    public function index(Request $request)
    {
        //  Lấy tham số phân trang từ Refine 
        $perPage = $request->input('pageSize', 10);

        // Lấy tất cả sự kiện và phân trang
        $events = Event::orderBy('created_at', 'desc')->paginate($perPage);

        // Trả về JSON theo định dạng Refine/Ant Design
        return response()->json([
            'data' => $events->items(), // Dữ liệu của trang hiện tại
            'total' => $events->total(), // Tổng số lượng bản ghi
        ]);
    }

    /**
     * Lưu sự kiện mới 
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',

            'image' => 'nullable|image|max:5120',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        $event = Event::create([
            'name' => $request->name,
            'description' => $request->description,
            'location' => $request->location,
            'date' => $request->date,
            'image' => $imagePath,
        ]);

        //  Trả về object sự kiện đã tạo
        return response()->json(['data' => $event], 201);
    }

    /**
     * Hiển thị chi tiết sự kiện
     */
    public function show($id)
    {
        $event = Event::findOrFail($id);
        //  Trả về object sự kiện
        return response()->json(['data' => $event]);
    }

    /**
     * Cập nhật sự kiện (Sử dụng cho Frontend Edit)
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',

            'image' => 'nullable|image|max:5120',
        ]);

        $imagePath = $event->image;

        // Xử lý ảnh mới
        if ($request->hasFile('image')) {
            // Xóa file cũ nếu tồn tại
            if ($event->image && Storage::disk('public')->exists($event->image)) {
                Storage::disk('public')->delete($event->image);
            }
            $imagePath = $request->file('image')->store('events', 'public');
        }


        $event->update([
            'name' => $request->name,
            'description' => $request->description,
            'location' => $request->location,
            'date' => $request->date,
            'image' => $imagePath,
        ]);

        // Trả về object sự kiện đã cập nhật
        return response()->json(['data' => $event]);
    }

    /**
     * Xóa sự kiện
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        // Xóa file ảnh liên quan khỏi storage
        if ($event->image && Storage::disk('public')->exists($event->image)) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        // Trả về phản hồi rỗng (hoặc 204 No Content)
        return response()->json([], 200);
    }


}