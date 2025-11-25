<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AmenityController extends Controller
{
    public function index()
    {
        $amenities = Amenity::paginate(20);

        return response()->json([
            "success" => true,
            "data"    => $amenities->items(),
            "message" => "Amenities retrieved successfully",
            "meta"    => [
                "total" => $amenities->total(),
                "per_page" => $amenities->perPage(),
                "current_page" => $amenities->currentPage(),
                "last_page" => $amenities->lastPage(),
            ]
        ]);
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

        $amenity = Amenity::create($validated);

        return response()->json([
            "success" => true,
            "data"    => $amenity,
            "message" => "Amenity created successfully",
        ], 201);
    }

    public function show($id)
    {
        $amenity = Amenity::findOrFail($id);

        return response()->json([
            "success" => true,
            "data"    => $amenity,
            "message" => "Amenity retrieved successfully",
        ]);
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

        return response()->json([
            "success" => true,
            "data"    => $amenity,
            "message" => "Amenity updated successfully",
        ]);
    }

    public function destroy($id)
    {
        $amenity = Amenity::findOrFail($id);

        if ($amenity->amenity_image && Storage::disk('public')->exists($amenity->amenity_image)) {
            Storage::disk('public')->delete($amenity->amenity_image);
        }

        $amenity->delete();

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Amenity deleted successfully",
        ]);
    }
}
