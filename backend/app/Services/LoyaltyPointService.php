<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPoint;
use App\Models\MembershipTier;
use App\Models\Voucher;
use App\Mail\TierUpMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

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

            $after = $userPoint->total_points;

            $this->handleTierUpgrade($user, $before, $after);
        });
    }

    protected function handleTierUpgrade(User $user, int $before, int $after): void
    {
        // Tier cũ
        $oldTier = MembershipTier::where('min_points', '<=', $before)
            ->orderByDesc('min_points')
            ->first();

        // Tier mới (cao nhất đạt được)
        $newTier = MembershipTier::where('min_points', '<=', $after)
            ->orderByDesc('min_points')
            ->first();

        if (!$newTier || ($oldTier && $oldTier->id === $newTier->id)) {
            return;
        }

        $voucher = $this->grantVoucherByTier($user, $newTier->name);

        // 📧 Gửi mail
        Mail::to($user->email)->send(
            new TierUpMail(
                $user,
                $newTier,
                $after,
                $voucher
            )
        );
    }

    protected function grantVoucherByTier(User $user, string $tierName): ?Voucher
    {
        $map = [
            'silver'  => 'SILVER10',
            'gold'    => 'GOLD15',
            'diamond' => 'DIAMOND20',
        ];

        if (!isset($map[$tierName])) return null;

        $voucher = Voucher::where('code', $map[$tierName])
            ->where('status', 'active')
            ->first();

        if (!$voucher) return null;

        if ($user->vouchers()->where('voucher_id', $voucher->id)->exists()) {
            return null;
        }

        $user->vouchers()->attach($voucher->id);

        return $voucher;
    }
}