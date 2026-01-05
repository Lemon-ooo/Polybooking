<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

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
    $perPage = $request->get('pageSize', 10); // refine gửi pageSize
    $page = $request->get('current', 1);     // refine gửi current

    $query = Event::query();

    // 🔍 Search (nếu cần)
    if ($request->filled('search')) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    // ↕️ Sort
    if ($request->filled('sorter')) {
        $sorter = json_decode($request->sorter, true);
        foreach ($sorter as $field => $order) {
            $query->orderBy($field, $order === 'ascend' ? 'asc' : 'desc');
        }
    } else {
        $query->latest();
    }

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
            'banner'      => 'nullable|string',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
        ]);

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

        $event->update($request->only([
            'title',
            'description',
            'banner',
'start_date',
            'end_date',
            'is_active',
        ]));

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