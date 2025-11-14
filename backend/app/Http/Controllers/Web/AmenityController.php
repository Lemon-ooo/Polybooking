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
        $amenities = Amenity::latest()->paginate(10);
        return view('amenities.index', compact('amenities'));
    }

    public function create()
    {
        return view('amenities.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'nullable|string|max:255',
            'icon'        => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('icon')) {
            $validated['icon_path'] = $request->file('icon')->store('amenities', 'public');
        }

        Amenity::create($validated);

        return redirect()->route('web.amenities.index')->with('success', 'Thêm thành công!');
    }

    public function edit(Amenity $amenity)
    {
        return view('amenities.edit', compact('amenity'));
    }

    public function update(Request $request, Amenity $amenity)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'nullable|string|max:255',
            'icon'        => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('icon')) {
            if ($amenity->icon_path) {
                Storage::disk('public')->delete($amenity->icon_path);
            }
            $validated['icon_path'] = $request->file('icon')->store('amenities', 'public');
        }

        $amenity->update($validated);

        return redirect()->route('web.amenities.index')->with('success', 'Cập nhật thành công!');
    }

    public function destroy(Amenity $amenity)
    {
        if ($amenity->icon_path) {
            Storage::disk('public')->delete($amenity->icon_path);
        }
        $amenity->delete();

        return redirect()->route('web.amenities.index')->with('success', 'Xóa thành công!');
    }
}