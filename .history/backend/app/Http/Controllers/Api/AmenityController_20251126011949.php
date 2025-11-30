<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AmenityController extends Controller
{
    public function index()
    {
        $amenities = Amenity::paginate(20);

        return view('admin.amenities.index', compact('amenities'));
    }

    public function create()
    {
        return view('admin.amenities.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amenity_name'  => 'required|string|max:255',
            'description'   => 'nullable|string',
            'amenity_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('amenity_image')) {
            $path = $request->file('amenity_image')->store('amenities', 'public');
            $validated['amenity_image'] = $path;
        }

        Amenity::create($validated);

        return redirect()
            ->route('admin.amenities.index')
            ->with('success', 'Tạo tiện ích thành công.');
    }

    public function show($id)
    {
        $amenity = Amenity::findOrFail($id);

        return view('admin.amenities.show', compact('amenity'));
    }

    public function edit($id)
    {
        $amenity = Amenity::findOrFail($id);

        return view('admin.amenities.edit', compact('amenity'));
    }

    public function update(Request $request, $id)
    {
        $amenity = Amenity::findOrFail($id);

        $validated = $request->validate([
            'amenity_name'  => 'required|string|max:255',
            'description'   => 'nullable|string',
            'amenity_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('amenity_image')) {
            if ($amenity->amenity_image && Storage::disk('public')->exists($amenity->amenity_image)) {
                Storage::disk('public')->delete($amenity->amenity_image);
            }

            $path = $request->file('amenity_image')->store('amenities', 'public');
            $validated['amenity_image'] = $path;
        }

        $amenity->update($validated);

        return redirect()
            ->route('admin.amenities.index')
            ->with('success', 'Cập nhật tiện ích thành công.');
    }

    public function destroy($id)
    {
        $amenity = Amenity::findOrFail($id);

        if ($amenity->amenity_image && Storage::disk('public')->exists($amenity->amenity_image)) {
            Storage::disk('public')->delete($amenity->amenity_image);
        }

        $amenity->delete();

        return redirect()
            ->route('admin.amenities.index')
            ->with('success', 'Xóa tiện ích thành công.');
    }
}
