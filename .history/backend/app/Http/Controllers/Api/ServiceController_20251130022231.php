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
        $services = Service::all();

        // Chuẩn hóa dữ liệu trả về giống format room-types
        $data = $services->map(function ($item) {
            return [
                'service_id'    => $item->service_id,
                'service_name'  => $item->service_name,
                'service_price' => $item->service_price,
                'description'   => $item->description,
                'service_image' => $item->service_image,
                'created_at'    => $item->created_at,
                'updated_at'    => $item->updated_at,
                'image_url'     => $item->service_image ? url('storage/' . $item->service_image) : null,
            ];
        });

        return response()->json([
            'data' => $data,
            'total' => $services->count()
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
            'data' => [
                'service_id'    => $service->service_id,
                'service_name'  => $service->service_name,
                'service_price' => $service->service_price,
                'description'   => $service->description,
                'service_image' => $service->service_image,
                'created_at'    => $service->created_at,
                'updated_at'    => $service->updated_at,
                'image_url'     => $service->service_image ? url('storage/' . $service->service_image) : null,
            ],
            'message' => 'Service created successfully'
        ], 201);
    }

    /** Xem chi tiết dịch vụ */
    public function show($service_id)
    {
        $service = Service::find($service_id);

        if (! $service) {
            return response()->json([
                'message' => 'Service not found',
            ], 404);
        }

        return response()->json([
            'data' => [
                'service_id'    => $service->service_id,
                'service_name'  => $service->service_name,
                'service_price' => $service->service_price,
                'description'   => $service->description,
                'service_image' => $service->service_image,
                'created_at'    => $service->created_at,
                'updated_at'    => $service->updated_at,
                'image_url'     => $service->service_image ? url('storage/' . $service->service_image) : null,
            ]
        ], 200);
    }

    /** Cập nhật dịch vụ */
    public function update(Request $request, $service_id)
    {
        $service = Service::find($service_id);

        if (! $service) {
            return response()->json([
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
            'data' => [
                'service_id'    => $service->service_id,
                'service_name'  => $service->service_name,
                'service_price' => $service->service_price,
                'description'   => $service->description,
                'service_image' => $service->service_image,
                'created_at'    => $service->created_at,
                'updated_at'    => $service->updated_at,
                'image_url'     => $service->service_image ? url('storage/' . $service->service_image) : null,
            ],
            'message' => 'Service updated successfully'
        ], 200);
    }

    /** Xóa dịch vụ */
    public function destroy($service_id)
    {
        $service = Service::find($service_id);

        if (! $service) {
            return response()->json([
                'message' => 'Service not found',
            ], 404);
        }

        if ($service->service_image && Storage::disk('public')->exists($service->service_image)) {
            Storage::disk('public')->delete($service->service_image);
        }

        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully'
        ], 200);
    }
}