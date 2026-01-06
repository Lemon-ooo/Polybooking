<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    // ================= USER =================

    public function publicIndex()
    {
        $events = Event::where('is_active', 1)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json([
            'data' => $events
        ]);
    }

    public function publicShow($id)
    {
        $event = Event::where('id', $id)
            ->where('is_active', 1)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->firstOrFail();

        return response()->json([
            'data' => $event
        ]);
    }

    // ================= ADMIN =================

    /**
     * GET /events
     */
    public function index(Request $request)
    {
        $perPage = $request->get('pageSize', 10);
        $page = $request->get('current', 1);

        $query = Event::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $query->latest();

        $events = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $events->items(),
            'meta' => [
                'total' => $events->total(),
                'current_page' => $events->currentPage(),
                'per_page' => $events->perPage(),
                'last_page' => $events->lastPage(),
            ],
        ]);
    }

    /**
     * POST /events
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
        ]);

        // 📸 Upload banner
        if ($request->hasFile('banner')) {
            $data['banner'] = $request->file('banner')->store('events', 'public');
        }

        $event = Event::create($data);

        return response()->json([
            'data' => $event
        ], 201);
    }

    /**
     * GET /events/{id}
     */
    public function show($id)
    {
        $event = Event::findOrFail($id);

        return response()->json([
            'data' => $event
        ]);
    }

    /**
     * PUT/PATCH /events/{id}
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'banner'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'start_date'  => 'sometimes|date',
            'end_date'    => 'sometimes|date|after_or_equal:start_date',
            'is_active'   => 'sometimes|boolean',
        ]);

        // 📸 Update banner
        if ($request->hasFile('banner')) {
            // Xóa ảnh cũ
            if ($event->banner) {
                Storage::disk('public')->delete($event->banner);
            }

            $data['banner'] = $request->file('banner')->store('events', 'public');
        }

        $event->update($data);

        return response()->json([
            'data' => $event
        ]);
    }

    /**
     * DELETE /events/{id}
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        if ($event->banner) {
            Storage::disk('public')->delete($event->banner);
        }

        $event->delete();

        return response()->json([
            'data' => $event
        ]);
    }

    /**
     * PATCH /events/{id}/toggle-status
     */
    public function toggleStatus($id)
    {
        $event = Event::findOrFail($id);
        $event->is_active = !$event->is_active;
        $event->save();

        return response()->json([
            'data' => $event
        ]);
    }
}
