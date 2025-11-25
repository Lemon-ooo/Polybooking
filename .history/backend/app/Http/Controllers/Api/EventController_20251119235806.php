<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    /**
     * Hiển thị danh sách sự kiện
     */
    public function index()
    {
        $events = Event::all();
        return view('events.index', compact('events'));
    }

    /**
     * Form tạo sự kiện mới
     */
    public function create()
    {
        return view('events.create');
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
            'image' => 'nullable|image|max:5120', // chỉ cần image, tự nhận PNG/JPG/GIF
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        Event::create([
            'name' => $request->name,
            'description' => $request->description,
            'location' => $request->location,
            'date' => $request->date,
            'image' => $imagePath,
        ]);

        return redirect()->route('web.events.index')
            ->with('success', 'Sự kiện đã được thêm thành công.');
    }

    /**
     * Hiển thị chi tiết sự kiện
     */
    public function show($id)
    {
        $event = Event::findOrFail($id);
        return view('events.show', compact('event'));
    }

    /**
     * Form chỉnh sửa sự kiện
     */
    public function edit($id)
    {
        $event = Event::findOrFail($id);
        return view('events.edit', compact('event'));
    }

    /**
     * Cập nhật sự kiện
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

        return redirect()->route('web.events.index')
            ->with('success', 'Sự kiện đã được cập nhật thành công.');
    }

    /**
     * Xóa sự kiện
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        if ($event->image && Storage::disk('public')->exists($event->image)) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return redirect()->route('web.events.index')
            ->with('success', 'Sự kiện đã được xóa thành công.');
    }
}
