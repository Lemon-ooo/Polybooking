<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    /**
     * Hiển thị danh sách phòng (API)
     */
    public function index(): JsonResponse
    {
        try {
            $rooms = Room::with(['roomType', 'amenities'])->latest()->get();
            
            return response()->json([
                'success' => true,
                'data' => $rooms,
                'message' => 'Rooms retrieved successfully',
                'meta' => [
                    'total' => $rooms->count(),
                    'page' => 1,
                    'per_page' => $rooms->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rooms',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lưu phòng mới vào database (API)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'room_number' => 'required|string|max:50|unique:rooms',
                'room_type_id' => 'required|exists:room_types,id',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'status' => 'required|string|in:available,occupied,maintenance',
                'amenities' => 'nullable|array',
                'amenities.*' => 'exists:amenities,amenity_id',
            ]);

            $room = Room::create($validated);

            if (!empty($request->amenities)) {
                $room->amenities()->sync($request->amenities);
            }

            return response()->json([
                'success' => true,
                'data' => $room->load(['roomType', 'amenities']),
                'message' => 'Room created successfully'
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hiển thị chi tiết phòng (API)
     */
    public function show(Room $room): JsonResponse
    {
        try {
            $room->load(['roomType', 'amenities']);
            
            return response()->json([
                'success' => true,
                'data' => $room,
                'message' => 'Room retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật phòng (API)
     */
    public function update(Request $request, Room $room): JsonResponse
    {
        try {
            $validated = $request->validate([
                'room_number' => 'required|string|max:50|unique:rooms,room_number,' . $room->id,
                'room_type_id' => 'required|exists:room_types,id',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'status' => 'required|string|in:available,occupied,maintenance',
                'amenities' => 'nullable|array',
                'amenities.*' => 'exists:amenities,id',
            ]);

            $room->update($validated);
            $room->amenities()->sync($request->amenities ?? []);

            return response()->json([
                'success' => true,
                'data' => $room->load(['roomType', 'amenities']),
                'message' => 'Room updated successfully'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa phòng (API)
     */
    public function destroy(Room $room): JsonResponse
    {
        try {
            $room->delete();

            return response()->json([
                'success' => true,
                'message' => 'Room deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách room types cho dropdown (API)
     */
    public function getRoomTypes(): JsonResponse
    {
        try {
            $roomTypes = RoomType::all();

            return response()->json([
                'success' => true,
                'data' => $roomTypes,
                'message' => 'Room types retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve room types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách amenities cho dropdown (API)
     */
    public function getAmenities(): JsonResponse
    {
        try {
            $amenities = Amenity::all();

            return response()->json([
                'success' => true,
                'data' => $amenities,
                'message' => 'Amenities retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve amenities',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}