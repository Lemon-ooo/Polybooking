<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\Request;

class AmenityController extends Controller
{
    // GET /api/amenities
    public function index()
{
    $amenities = \App\Models\Amenity::latest()->paginate(10);
    return view('amenities.index', compact('amenities'));
}


    // POST /api/amenities
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $amenity = Amenity::create($data);
        return response()->json($amenity, 201);
    }

    // GET /api/amenities/{id}
    public function show($id)
    {
        $amenity = Amenity::findOrFail($id);
        return response()->json($amenity);
    }

    // PUT /api/amenities/{id}
    public function update(Request $request, $id)
    {
        $amenity = Amenity::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $amenity->update($data);

        return response()->json($amenity);
    }

    // DELETE /api/amenities/{id}
    public function destroy($id)
    {
        $amenity = Amenity::findOrFail($id);
        $amenity->delete();

        return response()->json(['message' => 'Amenity deleted successfully']);
    }
}
