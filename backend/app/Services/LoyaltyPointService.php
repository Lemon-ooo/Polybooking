<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPoint;
use App\Models\MembershipTier;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;

class LoyaltyPointService
{
    const POINT_RATE = 1000; // 1000đ = 1 điểm

    public function rewardForBooking(User $user, int $amount): void
    {
        $points = floor($amount / self::POINT_RATE);
        if ($points <= 0) return;

        DB::transaction(function () use ($user, $points) {

            $year = now()->year;

            $userPoint = UserPoint::firstOrCreate(
                [
                    'user_id' => $user->user_id,
                    'year'    => $year,
                ],
                ['total_points' => 0]
            );

            $before = $userPoint->total_points;
            $userPoint->increment('total_points', $points);

            $this->handleTierUpgrade(
                $user,
                $before,
                $userPoint->total_points
            );
        });
    }

    protected function handleTierUpgrade(User $user, int $before, int $after): void
    {
        $tiers = MembershipTier::orderBy('min_points')->get();

        foreach ($tiers as $tier) {
            if ($before < $tier->min_points && $after >= $tier->min_points) {
                $this->grantVoucherByTier($user, $tier->name);
            }
        }
    }

    protected function grantVoucherByTier(User $user, string $tierName): void
    {
        $map = [
            'silver'  => 'SILVER10',
            'gold'    => 'GOLD15',
            'diamond' => 'DIAMOND20',
        ];

        if (!isset($map[$tierName])) return;

        $voucher = Voucher::where('code', $map[$tierName])
            ->where('status', 'active')
            ->first();

        if (!$voucher) return;

        if ($user->vouchers()->where('voucher_id', $voucher->id)->exists()) {
            return;
        }

        $user->vouchers()->attach($voucher->id);
    }
}
