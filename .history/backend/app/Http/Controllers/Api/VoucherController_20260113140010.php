<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class VoucherController extends Controller
{
    /* =====================================================
     * ADMIN - CREATE VOUCHER
     * ===================================================== */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code'             => 'required|string|unique:vouchers,code',
            'discount_percent' => 'nullable|integer|min:1|max:100',
            'discount_amount'  => 'nullable|integer|min:1',
            'min_price'        => 'nullable|integer|min:0',
            'expired_at'       => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'details' => $validator->errors(),
                ]
            ], 422);
        }

        if ($request->discount_percent && $request->discount_amount) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_DISCOUNT_TYPE',
                    'message' => 'Chỉ được chọn giảm theo % hoặc số tiền',
                ]
            ], 400);
        }

        $voucher = Voucher::create([
            'code'             => $request->code,
            'discount_percent' => $request->discount_percent,
            'discount_amount'  => $request->discount_amount,
            'min_price'        => $request->min_price ?? 0,
            'expired_at'       => $request->expired_at,
            'status'           => 'active',
        ]);

        return response()->json([
            'success' => true,
            'data' => $voucher,
        ]);
    }
    /* =====================================================
     * ADMIN - UPDATE VOUCHER
     * ===================================================== */
    public function update(Request $request, $id)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Bạn không có quyền truy cập',
                ]
            ], 401);
        }

        $voucher = Voucher::find($id);

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VOUCHER_NOT_FOUND',
                    'message' => 'Không tìm thấy voucher',
                ]
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'code'             => 'sometimes|required|string|unique:vouchers,code,' . $id,
            'discount_percent' => 'nullable|integer|min:1|max:100',
            'discount_amount'  => 'nullable|integer|min:1',
            'min_price'        => 'nullable|integer|min:0',
            'expired_at'       => 'sometimes|required|date|after:today',
            'status'           => 'sometimes|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'details' => $validator->errors(),
                ]
            ], 422);
        }

        if ($request->filled('discount_percent') && $request->filled('discount_amount')) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_DISCOUNT_TYPE',
                    'message' => 'Chỉ được chọn 1 loại giảm',
                ]
            ], 400);
        }

        $voucher->update($request->only([
            'code',
            'discount_percent',
            'discount_amount',
            'min_price',
            'expired_at',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật voucher thành công',
            'data' => $voucher,
        ]);
    }
    /* =====================================================
     * USER - VALIDATE VOUCHER
     * ===================================================== */
    public function validateVoucher(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'code'  => 'required|string',
                'price' => 'required|integer|min:0',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'details' => $validator->errors(),
                ]
            ], 422);
        }

        /** @var User|null $user */
        $user = auth('sanctum')->user();

        /* ===============================
     * 1️⃣ ƯU TIÊN VOUCHER RIÊNG
     * =============================== */
        $voucher = null;

        if ($user) {
            $voucher = $user->vouchers()
                ->where('code', $request->code)
                ->wherePivot('is_used', false)
                ->first();
        }

        /* ===============================
     * 2️⃣ VOUCHER CHUNG
     * =============================== */
        if (!$voucher) {
            $voucher = Voucher::where('code', $request->code)->first();
        }

        if (!$voucher || !$voucher->isValid()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VOUCHER_INVALID',
                    'message' => 'Voucher không hợp lệ hoặc không thuộc về bạn',
                ]
            ], 400);
        }

        if ($request->price < $voucher->min_price) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'MIN_PRICE_NOT_MET',
                    'min_price' => $voucher->min_price,
                ]
            ], 400);
        }

        $discount = $voucher->discount_percent
            ? intval($request->price * $voucher->discount_percent / 100)
            : $voucher->discount_amount;

        $discount = min($discount, $request->price);

        return response()->json([
            'success' => true,
            'data' => [
                'voucher_code' => $voucher->code,
                'discount' => $discount,
                'price_before' => $request->price,
                'price_after' => $request->price - $discount,
            ]
        ]);
    }

    /* =====================================================
     * ADMIN - TOGGLE STATUS
     * ===================================================== */
    public function toggleStatus($id)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Bạn không có quyền truy cập',
                ]
            ], 401);
        }

        $voucher = Voucher::findOrFail($id);
        $voucher->status = $voucher->status === 'active' ? 'inactive' : 'active';
        $voucher->save();

        return response()->json([
            'success' => true,
            'data' => $voucher,
        ]);
    }

    /* =====================================================
     * ADMIN - LIST VOUCHERS
     * ===================================================== */
    public function index(Request $request)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Bạn không có quyền truy cập',
                ]
            ], 401);
        }

        $vouchers = Voucher::orderByDesc('created_at')
            ->get()
            ->map(function ($v) {
                $v->used_count = \App\Models\Booking::where('voucher_code', $v->code)->count();
                return $v;
            });

        return response()->json([
            'success' => true,
            'data' => $vouchers,
        ]);
    }

    /* =====================================================
     * ADMIN - SHOW VOUCHER
     * ===================================================== */
    public function show(Request $request, $id)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Bạn không có quyền truy cập',
                ]
            ], 401);
        }

        $voucher = Voucher::find($id);

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VOUCHER_NOT_FOUND',
                    'message' => 'Không tìm thấy voucher',
                ]
            ], 404);
        }

        // Số lần voucher đã được sử dụng (dựa trên booking.voucher_code)
        $usedCount = Booking::where('voucher_code', $voucher->code)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'voucher' => $voucher,
                'used_count' => $usedCount,
            ]
        ]);
    }
    /* =====================================================
     * ADMIN - DELETE VOUCHER
     * ===================================================== */
    public function destroy($id)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Bạn không có quyền truy cập',
                ]
            ], 401);
        }

        $voucher = Voucher::find($id);

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VOUCHER_NOT_FOUND',
                    'message' => 'Không tìm thấy voucher',
                ]
            ], 404);
        }

        if (Booking::where('voucher_code', $voucher->code)->exists()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VOUCHER_IN_USE',
                    'message' => 'Voucher đã được sử dụng, không thể xóa',
                ]
            ], 400);
        }

        $voucher->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa voucher thành công',
        ]);
    }
}