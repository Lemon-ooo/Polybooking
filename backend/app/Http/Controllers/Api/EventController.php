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

        return response()->json($events);
    }

    public function publicShow($id)
    {
        $event = Event::where('id', $id)
            ->where('is_active', 1)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->firstOrFail();

        return response()->json($event);
    }

    // ================= ADMIN =================

    
    public function index()
    {
        
        return response()->json(Event::latest()->get());
    }

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

        return response()->json($event, 201);
    }

    public function show($id)
    {
        
        return response()->json(Event::findOrFail($id));
    }

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

        return response()->json($event);
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

        return response()->json($event);
    }
}
