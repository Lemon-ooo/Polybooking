<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\DamageType;
use Illuminate\Http\Request;

class DamageTypeController extends Controller
{
    public function index()
    {
        $items = DamageType::all();
        return view('admin.damage_types.index', compact('items'));
    }

    public function create()
    {
        return view('admin.damage_types.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required',
            'price' => 'required|integer|min:0',
        ]);

        DamageType::create($request->all());

        return redirect()->route('admin.damage_types.index')
            ->with('success', 'Thêm loại hư hại thành công');
    }

    public function edit($id)
    {
        $item = DamageType::findOrFail($id);
        return view('admin.damage_types.edit', compact('item'));
    }

    public function update(Request $request, $id)
    {
        $item = DamageType::findOrFail($id);
        $item->update($request->all());

        return redirect()->route('admin.damage_types.index')
            ->with('success', 'Cập nhật thành công');
    }

    public function destroy($id)
    {
        DamageType::destroy($id);

        return redirect()->route('admin.damage_types.index')
            ->with('success', 'Đã xóa loại thiệt hại');
    }
}
