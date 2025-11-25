<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Lấy danh sách dịch vụ (phù hợp RefineJS)
     */
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('perPage', 20);

        $services = Service::paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'  => $services->items(),
            'total' => $services->total(),
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
            'data' => $service,
        ], 201);
    }

    /**
     * Lấy chi tiết 1 dịch vụ
     */
    public function show($id)
    {
        $service = Service::findOrFail($id);

        return response()->json([
            'data' => $service,
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
            'data' => $service,
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
            'data' => null,
        ]);
    }
}
