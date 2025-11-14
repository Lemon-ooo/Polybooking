<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    // Lấy danh sách events
    public function index(): JsonResponse
    {
        $events = Event::latest()->paginate(15);
        return response()->json($events);
    }

    // Lấy chi tiết event
    public function show(Event $event): JsonResponse
    {
        return response()->json($event);
    }

    // Tìm kiếm events
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q');
        $events = Event::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();

        return response()->json($events);
    }

    // Lấy events theo status
    public function getByStatus(string $status): JsonResponse
    {
        $events = Event::where('status', $status)->get();
        return response()->json($events);
    }
}