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
            'data' => $events,
            'total' => $events->count(),
        ]);
    }

    public function publicShow($id)
    {
        $event = Event::where('id', $id)
            ->where('is_active', 1)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->firstOrFail();

        return response()->json(['data' => $event]);
    }

    // ================= ADMIN =================

    public function index(Request $request)
    {
        // Lấy phân trang từ refine (nếu có)
        $page     = $request->get('current', 1);
        $perPage  = $request->get('pageSize', 10); // refine mặc định pageSize

        $events = Event::orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'  => $events->items(),
            'total' => $events->total(),
        ]);
    }

    public function store(Request $request)
    {
        // Convert date format nếu FE gửi YYYY-MM-DD
        if($request->start_date){
            $request['start_date'] = date('Y-m-d', strtotime($request->start_date));
        }
        if($request->end_date){
            $request['end_date'] = date('Y-m-d', strtotime($request->end_date));
        }

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner'      => 'nullable|string',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'is_active'   => 'boolean',
        ]);

        $event = Event::create($data);

        return response()->json(['data' => $event], 201);
    }

    public function show($id)
    {
        return response()->json(['data' => Event::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        // Convert date format
        if ($request->start_date) {
            $request['start_date'] = date('Y-m-d', strtotime($request->start_date));
        }
        if ($request->end_date) {
            $request['end_date'] = date('Y-m-d', strtotime($request->end_date));
        }

        $event->update($request->only([
            'title',
            'description',
            'banner',
            'start_date',
            'end_date',
            'is_active',
        ]));

        return response()->json(['data' => $event]);
    }

    public function destroy($id)
    {
        Event::findOrFail($id)->delete();

        return response()->json(['message' => 'Xoá event thành công']);
    }

    public function toggleStatus($id)
    {
        $event = Event::findOrFail($id);
        $event->is_active = !$event->is_active;
        $event->save();

        return response()->json(['data' => $event]);
    }
}
