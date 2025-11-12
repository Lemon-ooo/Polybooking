<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Hiển thị danh sách dịch vụ (API)
     */
    public function index(): JsonResponse
    {
        try {
            $services = Service::all();
            
            // Tự động thêm full URL cho ảnh
            $services->each(function ($service) {
                if ($service->image) {
                    $service->image_url = asset($service->image);
                } else {
                    $service->image_url = null;
                }
            });

            return response()->json([
                'success' => true,
                'data' => $services,
                'message' => 'Services retrieved successfully',
                'meta' => [
                    'total' => $services->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lưu dịch vụ mới (API)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // 2MB
            ]);

            $data = $request->only(['name', 'price', 'description']);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->move(public_path('uploads/services'), $filename);
                $data['image'] = 'uploads/services/' . $filename;
            }

            $service = Service::create($data);

            if ($service->image) {
                $service->image_url = asset($service->image);
            }

            return response()->json([
                'success' => true,
                'data' => $service,
                'message' => 'Service created successfully'
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
                'message' => 'Failed to create service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hiển thị chi tiết dịch vụ (API)
     */
    public function show($id): JsonResponse
    {
        try {
            $service = Service::findOrFail($id);

            if ($service->image) {
                $service->image_url = asset($service->image);
            }

            return response()->json([
                'success' => true,
                'data' => $service,
                'message' => 'Service retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Cập nhật dịch vụ (API)
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $service = Service::findOrFail($id);
            $data = $request->only(['name', 'price', 'description']);

            if ($request->hasFile('image')) {
                // Xóa ảnh cũ
                if ($service->image && file_exists(public_path($service->image))) {
                    unlink(public_path($service->image));
                }

                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('uploads/services'), $filename);
                $data['image'] = 'uploads/services/' . $filename;
            }

            $service->update($data);

            if ($service->image) {
                $service->image_url = asset($service->image);
            }

            return response()->json([
                'success' => true,
                'data' => $service,
                'message' => 'Service updated successfully'
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
                'message' => 'Failed to update service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa dịch vụ (API)
     */
    public function destroy($id): JsonResponse
    {
        try {
            $service = Service::findOrFail($id);

            // Xóa file ảnh nếu có
            if ($service->image && file_exists(public_path($service->image))) {
                unlink(public_path($service->image));
            }

            $service->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete service',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}