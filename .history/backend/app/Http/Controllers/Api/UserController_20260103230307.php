<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Danh sách user (Refine useTable)
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 20);
        $page    = $request->get('page', 1);

        $query = User::orderByDesc('created_at');

        $users = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'  => $users->items(),
            'total' => $users->total(),
        ]);
    }

    /**
     * Lấy chi tiết 1 user
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Cập nhật role user (admin / customer)
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role' => 'required|in:admin,customer',
        ]);

        $user->update([
            'role' => $validated['role'],
        ]);

        return response()->json([
            'data' => $user,
            'message' => 'Cập nhật quyền thành công',
        ]);
    }

    /**
     * (Tuỳ chọn) Xóa user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'data' => null,
        ]);
    }
}