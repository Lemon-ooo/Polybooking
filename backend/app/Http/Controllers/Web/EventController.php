<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    // Hiển thị danh sách events
    public function index()
    {
        $events = Event::paginate(10);
        return view('events.index', compact('events'));
    }

    // Hiển thị form tạo event mới
    public function create()
    {
        return view('events.create');
    }

    // Lưu event mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:upcoming,ongoing,completed',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = $path;
        }

        Event::create($validated);

        return redirect()->route('web.events.index')->with('success', 'Event tạo thành công');
    }

    // Hiển thị chi tiết event
    public function show(Event $event)
    {
        return view('events.show', compact('event'));
    }

    // Hiển thị form chỉnh sửa event
    public function edit(Event $event)
    {
        return view('events.edit', compact('event'));
    }

    // Cập nhật event
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:upcoming,ongoing,completed',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image) {
                Storage::disk('public')->delete($event->image);
            }
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = $path;
        }

        $event->update($validated);

        return redirect()->route('web.events.index')->with('success', 'Event cập nhật thành công');
    }

    // Xóa event
    public function destroy(Event $event)
    {
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }
        $event->delete();

        return redirect()->route('web.events.index')->with('success', 'Event xóa thành công');
    }
}