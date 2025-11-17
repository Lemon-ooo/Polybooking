<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Carbon\Carbon;

class AutoUpdateBookingStatus extends Command
{
    protected $signature = 'bookings:auto-status';
    protected $description = 'Tự động cập nhật trạng thái booking theo ngày check-in/check-out';

    public function handle(): int
    {
        $today = Carbon::today()->toDateString();

        $this->info('Auto update booking status for date: '.$today);

        // 1) pending -> cancelled nếu check_in_date < hôm nay
        $pendingToCancel = Booking::where('status', 'pending')
            ->whereHas('items', function ($q) use ($today) {
                $q->whereDate('check_in_date', '<', $today);
            })
            ->update(['status' => 'cancelled']);

        $this->info("Đã chuyển {$pendingToCancel} booking từ pending -> cancelled");

        // 2) confirmed -> checked_in nếu có phòng check_in_date <= hôm nay
        $confirmedToIn = Booking::where('status', 'confirmed')
            ->whereHas('items', function ($q) use ($today) {
                $q->whereDate('check_in_date', '<=', $today);
            })
            ->update(['status' => 'checked_in']);

        $this->info("Đã chuyển {$confirmedToIn} booking từ confirmed -> checked_in");

        // 3) checked_in -> checked_out nếu tất cả phòng check_out_date <= hôm nay
        $checkedInToOut = Booking::where('status', 'checked_in')
            // mọi phòng đều có check_out_date <= hôm nay
            ->whereDoesntHave('items', function ($q) use ($today) {
                $q->whereDate('check_out_date', '>', $today);
            })
            ->update(['status' => 'checked_out']);

        $this->info("Đã chuyển {$checkedInToOut} booking từ checked_in -> checked_out");

        return Command::SUCCESS;
    }
}
