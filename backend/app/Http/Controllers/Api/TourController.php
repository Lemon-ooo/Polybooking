<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class TourController extends Controller
{
  /**
   * Hiển thị danh sách tour (API)
   */
  public function index(): JsonResponse
  {
    try {
      $tours = Tour::all();

      return response()->json([
        'success' => true,
        'data' => $tours,
        'message' => 'Tours retrieved successfully',
        'meta' => [
          'total' => $tours->count()
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to retrieve tours',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * Tạo tour mới (API)
   */
  public function store(Request $request): JsonResponse
  {
    try {
      $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'price'       => 'required|numeric|min:0',
        'location'    => 'required|string|max:255',
        'start_date'  => 'required|date',
        'duration'    => 'required|string|max:255',
        'description' => 'nullable|string',
        'image'       => 'nullable|string|max:500',
      ]);

      $tour = Tour::create($validated);

      return response()->json([
        'success' => true,
        'data' => $tour,
        'message' => 'Tour created successfully'
      ], 201);

    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation error',
        'errors' => $e->errors()
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to create tour',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * Hiển thị chi tiết tour (API)
   */
  public function show($id): JsonResponse
  {
    try {
      $tour = Tour::findOrFail($id);

      return response()->json([
        'success' => true,
        'data' => $tour,
        'message' => 'Tour retrieved successfully'
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Tour not found',
        'error' => $e->getMessage()
      ], 404);
    }
  }

  /**
   * Cập nhật tour (API)
   */
  public function update(Request $request, $id): JsonResponse
  {
    try {
      $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'price'       => 'required|numeric|min:0',
        'location'    => 'required|string|max:255',
        'start_date'  => 'required|date',
        'duration'    => 'required|string|max:255',
        'description' => 'nullable|string',
        'image'       => 'nullable|image|max:500',
      ]);

      $tour = Tour::findOrFail($id);
      $tour->update($validated);

      return response()->json([
        'success' => true,
        'data' => $tour,
        'message' => 'Tour updated successfully'
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
        'message' => 'Failed to update tour',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * Xóa tour (API)
   */
  public function destroy($id): JsonResponse
  {
    try {
      $tour = Tour::findOrFail($id);
      $tour->delete();

      return response()->json([
        'success' => true,
        'message' => 'Tour deleted successfully'
      ]);

    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete tour or tour not found',
        'error' => $e->getMessage()
      ], 500);
    }
  }
}
