<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TourController extends Controller
{
    /**
     * Hiển thị danh sách tour
     */
    public function index()
    {
        $tours = Tour::all();
        return view('tours.index', compact('tours'));
    }

    /**
     * Form tạo tour mới
     */
    public function create()
    {
        return view('tours.create');
    }

    /**
     * Lưu tour mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'location'    => 'required|string|max:255',
            'start_date'  => 'required|date',
            'duration'    => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:5120',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tours', 'public');
        }

        Tour::create([
            'name'        => $request->name,
            'price'       => $request->price,
            'location'    => $request->location,
            'start_date'  => $request->start_date,
            'duration'    => $request->duration,
            'description' => $request->description,
            'image'       => $imagePath,
        ]);

        return redirect()->route('web.tours.index')
            ->with('success', 'Tour đã được thêm thành công.');
    }

    /**
     * Hiển thị chi tiết tour
     */
    public function show($id)
    {
        $tour = Tour::findOrFail($id);
        return view('tours.show', compact('tour'));
    }

    /**
     * Form chỉnh sửa tour
     */
    public function edit($id)
    {
        $tour = Tour::findOrFail($id);
        return view('tours.edit', compact('tour'));
    }

    /**
     * Cập nhật tour
     */
    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'location'    => 'required|string|max:255',
            'start_date'  => 'required|date',
            'duration'    => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:5120',
        ]);

        $imagePath = $tour->image;

        if ($request->hasFile('image')) {
            if ($tour->image && Storage::disk('public')->exists($tour->image)) {
                Storage::disk('public')->delete($tour->image);
            }
            $imagePath = $request->file('image')->store('tours', 'public');
        }

        $tour->update([
            'name'        => $request->name,
            'price'       => $request->price,
            'location'    => $request->location,
            'start_date'  => $request->start_date,
            'duration'    => $request->duration,
            'description' => $request->description,
            'image'       => $imagePath,
        ]);

        return redirect()->route('web.tours.index')
            ->with('success', 'Tour đã được cập nhật thành công.');
    }

    /**
     * Xóa tour
     */
    public function destroy($id)
    {
        $tour = Tour::findOrFail($id);

        if ($tour->image && Storage::disk('public')->exists($tour->image)) {
            Storage::disk('public')->delete($tour->image);
        }

        $tour->delete();

        return redirect()->route('web.tours.index')
            ->with('success', 'Tour đã được xóa thành công.');
    }
}
