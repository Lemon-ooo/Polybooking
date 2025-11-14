<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller; // ✅ thêm dòng này
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return view('services.index', compact('services'));
    }

    public function create()
    {
        return view('services.create');
    }

  public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // 2MB
    ]);

    $data = $request->all();

    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/services'), $filename);
        $data['image'] = 'uploads/services/' . $filename;
    }

    Service::create($data);

    return redirect()->route('web.services.index')->with('success', 'Dịch vụ đã được thêm thành công.');
}

    public function show($id)
    {
        $service = Service::findOrFail($id);
        return view('services.show', compact('service'));
    }

    public function edit($id)
    {
        $service = Service::findOrFail($id);
        return view('services.edit', compact('service'));
    }

   public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    ]);

    $service = Service::findOrFail($id);
    $data = $request->all();

    if ($request->hasFile('image')) {
        // Xóa ảnh cũ nếu có
        if ($service->image && file_exists(public_path($service->image))) {
            unlink(public_path($service->image));
        }

        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/services'), $filename);
        $data['image'] = 'uploads/services/' . $filename;
    }

    $service->update($data);

    return redirect()->route('web.services.index')->with('success', 'Dịch vụ đã được cập nhật thành công.');
}

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return redirect()->route('web.services.index')->with('success', 'Dịch vụ đã được xóa thành công.');
    }
}