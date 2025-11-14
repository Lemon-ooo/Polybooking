<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event; // Import Model Event
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException; // Import ValidationException để xử lý lỗi 422

class EventController extends Controller
{
  /**
   * Hiển thị danh sách sự kiện (API)
   */
  public function index(): JsonResponse
  {
    try {
      // Lấy tất cả sự kiện. Có thể thêm pagination nếu cần
      $events = Event::all();

      return response()->json([
        'success' => true,
        'data' => $events,
        'message' => 'Events retrieved successfully',
        'meta' => [
          'total' => $events->count()
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to retrieve events',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * Lưu sự kiện mới (API)
   */
  public function store(Request $request): JsonResponse
  {
    try {
      // 🚨 VALIDATION cho Event
      $validated = $request->validate([
        'name' => 'required|string|max:255',
        'date' => 'required|date', // Kiểm tra định dạng ngày hợp lệ
        'location' => 'required|string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|string|max:500',
      ]);

      $event = Event::create($validated);

      return response()->json([
        'success' => true,
        'data' => $event,
        'message' => 'Event created successfully'
      ], 201); // 201 Created

    } catch (ValidationException $e) { // Bắt lỗi Validation
      return response()->json([
        'success' => false,
        'message' => 'Validation error',
        'errors' => $e->errors()
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to create event',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * Hiển thị chi tiết sự kiện (API)
   */
  public function show($id): JsonResponse
  {
    try {
      $event = Event::findOrFail($id);

      return response()->json([
        'success' => true,
        'data' => $event,
        'message' => 'Event retrieved successfully'
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Event not found',
        'error' => $e->getMessage()
      ], 404); // 404 Not Found
    }
  }

  /**
   * Cập nhật sự kiện (API)
   */
  public function update(Request $request, $id): JsonResponse
  {
    try {
      // 🚨 VALIDATION cho Event khi update
      $validated = $request->validate([
        'name' => 'required|string|max:255',
        'date' => 'required|date',
        'location' => 'required|string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|string|max:500',
      ]);

      $event = Event::findOrFail($id);
      $event->update($validated);

      return response()->json([
        'success' => true,
        'data' => $event,
        'message' => 'Event updated successfully'
      ]);

    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation error',
        'errors' => $e->errors()
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update event',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * Xóa sự kiện (API)
   */
  public function destroy($id): JsonResponse
  {
    try {
      $event = Event::findOrFail($id);
      $event->delete();

      return response()->json([
        'success' => true,
        'message' => 'Event deleted successfully'
      ]);

    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete event or event not found',
        'error' => $e->getMessage()
      ], 500);
    }
  }
}