<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Lấy danh sách dịch vụ (paginate 20)
     */
    public function index()
    {
        $services = Service::paginate(20);

        return response()->json([
            "success" => true,
            "data"    => $services->items(),
            "message" => "Services retrieved successfully",
            "meta"    => [
                "total"        => $services->total(),
                "per_page"     => $services->perPage(),
                "current_page" => $services->currentPage(),
                "last_page"    => $services->lastPage(),
            ]
        ]);
    }

    /**
     * Tạo dịch vụ mới
     */
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
            "success" => true,
            "data"    => $service,
            "message" => "Service created successfully",
        ], 201);
    }

    /**
     * Lấy chi tiết 1 dịch vụ
     */
    public function show($id)
    {
        $service = Service::findOrFail($id);

        return response()->json([
            "success" => true,
            "data"    => $service,
            "message" => "Service retrieved successfully",
        ]);
    }

    /**
     * Cập nhật dịch vụ
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

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

            $path = $request->file('service_image')->store('services', 'public');
            $validated['service_image'] = $path;
        }

        $service->update($validated);

        return response()->json([
            "success" => true,
            "data"    => $service,
            "message" => "Service updated successfully",
        ]);
    }

    /**
     * Xóa dịch vụ
     */
    public function destroy($id)
    {
        $service = Service::findOrFail($id);

        if ($service->service_image && Storage::disk('public')->exists($service->service_image)) {
            Storage::disk('public')->delete($service->service_image);
        }

        $service->delete();

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Service deleted successfully",
        ]);
    }
}
