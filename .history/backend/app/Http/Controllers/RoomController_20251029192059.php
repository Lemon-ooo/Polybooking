<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;
use App\Models\Amenity;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource (API).
     */
    public function index(): JsonResponse
    {
        $rooms = Room::with(['roomType', 'amenities'])->get();
        return response()->json([
            'success' => true,
            'data' => $rooms,
            'message' => 'Rooms retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage (API).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'room_type_id' => 'required|exists:room_types,id',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|string',
            'amenities' => 'array',
            'amenities.*' => 'exists:amenities,amenity_id',
        ]);

        $room = Room::create($validated);

        if ($request->has('amenities')) {
            $room->amenities()->sync($request->amenities);
        }

        return response()->json([
            'success' => true,
            'data' => $room->load(['roomType', 'amenities']),
            'message' => 'Room created successfully'
        ], 201);
    }

    /**
     * Display the specified resource (API).
     */
    public function show(Room $room): JsonResponse
    {
        $room->load(['roomType', 'amenities']);
        return response()->json([
            'success' => true,
            'data' => $room,
            'message' => 'Room retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage (API).
     */
    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'room_type_id' => 'required|exists:room_types,id',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|string',
            'amenities' => 'array',
            'amenities.*' => 'exists:amenities,amenity_id',
        ]);

        $room->update($validated);
        $room->amenities()->sync($request->amenities ?? []);

        return response()->json([
            'success' => true,
            'data' => $room->load(['roomType', 'amenities']),
            'message' => 'Room updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage (API).
     */
    public function destroy(Room $room): JsonResponse
    {
        $room->delete();
        return response()->json([
            'success' => true,
            'message' => 'Room deleted successfully'
        ]);
    }

    /**
     * Get room types for dropdown (API).
     */
    public function getRoomTypes(): JsonResponse
    {
        $roomTypes = RoomType::all();
        return response()->json([
            'success' => true,
            'data' => $roomTypes
        ]);
    }

    /**
     * Get amenities for dropdown (API).
     */
    public function getAmenities(): JsonResponse
    {
        $amenities = Amenity::all();
        return response()->json([
            'success' => true,
            'data' => $amenities
        ]);
    }
}