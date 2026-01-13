<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\DamageType;

class AdminDamageTypeController extends Controller
{
    // List damage types (paginated)
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 25);

        $items = DamageType::orderBy('name')
            ->paginate($perPage);

        return response()->json(['success' => true, 'data' => $items]);
    }

    // Show single type
    public function show($id)
    {
        $item = DamageType::findOrFail($id);
        return response()->json(['success' => true, 'data' => $item]);
    }

    // Create
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('damage-types', 'public');
        }

        $type = DamageType::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'description' => $data['description'] ?? null,
            'image_path' => $imagePath
        ]);

        return response()->json(['success' => true, 'data' => $type], 201);
    }

    // Update
    public function update(Request $request, $id)
    {
        $type = DamageType::findOrFail($id);

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120'
        ]);

        if (isset($data['name'])) $type->name = $data['name'];
        if (isset($data['price'])) $type->price = $data['price'];
        if (array_key_exists('description', $data)) $type->description = $data['description'];

        if ($request->hasFile('image')) {
            if ($type->image_path) {
                Storage::disk('public')->delete($type->image_path);
            }
            $type->image_path = $request->file('image')->store('damage-types', 'public');
        }

        $type->save();

        return response()->json(['success' => true, 'data' => $type]);
    }

    // Delete
    public function destroy($id)
    {
        $type = DamageType::findOrFail($id);

        if ($type->image_path) {
            Storage::disk('public')->delete($type->image_path);
        }

        $type->delete();

        return response()->json(['success' => true]);
    }
}
