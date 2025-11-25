<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /** Lấy danh sách dịch vụ */
    public function index()
    {
        $services = Service::paginate(20);

        // Chuẩn hóa dữ liệu trả về
        $data = $services->map(function ($item) {
            return [
                'id'          => $item->id,
                'name'        => $item->service_name,
                'description' => $item->description,
                'price'       => number_format($item->service_price, 2),
                'image'       => $item->service_image,
                'created_at'  => $item->created_at,
                'updated_at'  => $item->updated_at,
                'image_url'   => $item->service_image ? url('storage/' . $item->service_image) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => 'Services retrieved successfully',
            'meta'    => [
                'total' => $services->total(),
            ],
        ], 200);
    }

    /** Tạo dịch vụ */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_name'  => 'required|string|max:255',
            'service_price' => 'required|numeric|min:0',
            'description'   => 'nullable|string',
            'service_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('service_image')) {
            $path = $request->file('service_image')->store('services', 'public');
            $validated['service_image'] = $path;
        }

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'          => $service->id,
                'name'        => $service->service_name,
                'description' => $service->description,
                'price'       => number_format($service->service_price, 2),
                'image'       => $service->service_image,
                'created_at'  => $service->created_at,
                'updated_at'  => $service->updated_at,
                'image_url'   => $service->service_image ? url('storage/' . $service->service_image) : null,
            ],
            'message' => 'Service created successfully',
            'meta'    => [
                'total' => 1
            ]
        ], 201);
    }

    /** Xem chi tiết dịch vụ */
    public function show($id)
    {
        $service = Service::find($id);

        if (! $service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id'          => $service->id,
                'name'        => $service->service_name,
                'description' => $service->description,
                'price'       => number_format($service->service_price, 2),
                'image'       => $service->service_image,
                'created_at'  => $service->created_at,
                'updated_at'  => $service->updated_at,
                'image_url'   => $service->service_image ? url('storage/' . $service->service_image) : null,
            ],
            'message' => 'Service retrieved successfully',
            'meta'    => [
                'total' => 1
            ]
        ], 200);
    }

    /** Cập nhật dịch vụ */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (! $service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found',
            ], 404);
        }

        $validated = $request->validate([
            'service_name'  => 'required|string|max:255',
            'service_price' => 'required|numeric|min:0',
            'description'   => 'nullable|string',
            'service_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('service_image')) {
            if ($service->service_image && Storage::disk('public')->exists($service->service_image)) {
                Storage::disk('public')->delete($service->service_image);
            }

            $validated['service_image'] = $request->file('service_image')->store('services', 'public');
        }

        $service->update($validated);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'          => $service->id,
                'name'        => $service->service_name,
                'description' => $service->description,
                'price'       => number_format($service->service_price, 2),
                'image'       => $service->service_image,
                'created_at'  => $service->created_at,
                'updated_at'  => $service->updated_at,
                'image_url'   => $service->service_image ? url('storage/' . $service->service_image) : null,
            ],
            'message' => 'Service updated successfully',
            'meta'    => [
                'total' => 1,
            ]
        ], 200);
    }

    /** Xóa dịch vụ */
    public function destroy($id)
    {
        $service = Service::find($id);

        if (! $service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found',
            ], 404);
        }

        if ($service->service_image && Storage::disk('public')->exists($service->service_image)) {
            Storage::disk('public')->delete($service->service_image);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully',
            'meta'    => [
                'total' => 0
            ]
        ], 200);
    }
}
