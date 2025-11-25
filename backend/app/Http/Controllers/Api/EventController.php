<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    /**
     * Danh sách sự kiện
     */
    public function index()
    {
        $events = Event::orderByDesc('date')->paginate(20);

        return response()->json([
            "success" => true,
            "data"    => $events->items(),
            "message" => "Events retrieved successfully",
            "meta"    => [
                "total"        => $events->total(),
                "per_page"     => $events->perPage(),
                "current_page" => $events->currentPage(),
                "last_page"    => $events->lastPage(),
            ]
        ]);
    }

    /**
     * Tạo sự kiện mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'date'        => 'required|date',
            'location'    => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:5120',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        $event = Event::create([
            'name'        => $request->name,
            'description' => $request->description,
            'location'    => $request->location,
            'date'        => $request->date,
            'image'       => $imagePath,
        ]);

        return response()->json([
            "success" => true,
            "data"    => $event,
            "message" => "Event created successfully"
        ], 201);
    }

    /**
     * Xem chi tiết sự kiện
     */
    public function show($id)
    {
        $event = Event::findOrFail($id);

        return response()->json([
            "success" => true,
            "data"    => $event,
            "message" => "Event retrieved successfully"
        ]);
    }

    /**
     * Cập nhật sự kiện
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'date'        => 'required|date',
            'location'    => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:5120',
        ]);

        $imagePath = $event->image;

        if ($request->hasFile('image')) {
            if ($event->image && Storage::disk('public')->exists($event->image)) {
                Storage::disk('public')->delete($event->image);
            }

            $imagePath = $request->file('image')->store('events', 'public');
        }

        $event->update([
            'name'        => $request->name,
            'description' => $request->description,
            'location'    => $request->location,
            'date'        => $request->date,
            'image'       => $imagePath,
        ]);

        return response()->json([
            "success" => true,
            "data"    => $event,
            "message" => "Event updated successfully"
        ]);
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

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Event deleted successfully"
        ]);
    }
}
