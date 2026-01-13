<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MembershipTier;

class LoyaltyController extends Controller
{
    /**
     * GET /api/me/loyalty
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $year = now()->year;

        // điểm năm hiện tại
        $pointsRecord = $user->points()
            ->where('year', $year)
            ->first();

        $totalPoints = $pointsRecord?->total_points ?? 0;

        // xác định hạng
        $tier = MembershipTier::where('min_points', '<=', $totalPoints)
            ->orderByDesc('min_points')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'year' => $year,
                'total_points' => $totalPoints,
                'tier' => $tier?->name ?? 'silver',
                'vouchers' => $user->vouchers()->get([
                    'vouchers.id',
                    'vouchers.code',
                    'vouchers.discount_percent',
                    'vouchers.discount_amount',
                    'vouchers.min_price',
                    'vouchers.expired_at',
                    'voucher_user.is_used'
                ])
            ]
        ]);
    }
}
