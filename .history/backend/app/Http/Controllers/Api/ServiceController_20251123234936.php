<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::paginate(20);

        return view('admin.services.index', compact('services'));
    }

    public function create()
    {
        return view('admin.services.create');
    }

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

        Service::create($validated);

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Tạo dịch vụ thành công.');
    }

    public function show($id)
    {
        $service = Service::findOrFail($id);

        return view('admin.services.show', compact('service'));
    }

    public function edit($id)
    {
        $service = Service::findOrFail($id);

        return view('admin.services.edit', compact('service'));
    }

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

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Cập nhật dịch vụ thành công.');
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);

        if ($service->service_image && Storage::disk('public')->exists($service->service_image)) {
            Storage::disk('public')->delete($service->service_image);
        }

        $service->delete();

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Xóa dịch vụ thành công.');
    }
}
