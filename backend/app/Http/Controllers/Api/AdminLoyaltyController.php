<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\MembershipTier;

class AdminLoyaltyController extends Controller
{
    /**
     * GET /api/loyalty/users
     * Danh sách thành viên
     */
    public function index(Request $request)
    {
        $year = $request->get('year', now()->year);

        $users = User::with([
            'points' => fn ($q) => $q->where('year', $year)
        ])->paginate(20);

        return $this->success($users);
    }

    /**
     * GET /api/loyalty/users/{user_id}
     * Chi tiết thành viên
     */
    public function show($userId)
    {
        $year = now()->year;

        $user = User::with([
            'points' => fn ($q) => $q->where('year', $year),
            'vouchers'
        ])->findOrFail($userId);

        $totalPoints = $user->points->first()?->total_points ?? 0;

        $tier = MembershipTier::where('min_points', '<=', $totalPoints)
            ->orderByDesc('min_points')
            ->first();

        return $this->success([
            'user' => $user,
            'total_points' => $totalPoints,
            'tier' => $tier?->name ?? 'silver'
        ]);
    }

    /**
     * POST /api/loyalty/users/{user_id}/points
     * Cộng / trừ điểm
     */
    public function adjustPoints(Request $request, $userId)
    {
        $data = $request->validate([
            'points' => 'required|integer'
        ]);

        $year = now()->year;

        $user = User::findOrFail($userId);

        $points = $user->points()->firstOrCreate(
            ['year' => $year],
            ['total_points' => 0]
        );

        $points->increment('total_points', $data['points']);

        return $this->success([
            'message' => 'Điểm đã được cập nhật',
            'total_points' => $points->total_points
        ]);
    }

    /**
     * POST /api/loyalty/users/{user_id}/reset
     * Reset điểm năm hiện tại
     */
    public function reset($userId)
    {
        $year = now()->year;

        $user = User::findOrFail($userId);

        $user->points()
            ->where('year', $year)
            ->update(['total_points' => 0]);

        return $this->success([
            'message' => 'Đã reset điểm thành viên'
        ]);
    }

    /* =====================================================
     * RESPONSE HELPERS – GIỐNG PAYMENT CONTROLLER
     * ===================================================== */

    protected function success($data, $status = 200)
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'meta'    => [
                'timestamp' => now()->toISOString()
            ]
        ], $status);
    }

    protected function error($code, $message, $status = 400)
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => $code,
                'message' => $message
            ]
        ], $status);
    }
}
