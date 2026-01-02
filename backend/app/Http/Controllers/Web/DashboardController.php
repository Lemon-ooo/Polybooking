<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ServiceInvoice;
use App\Models\DamageInvoice;
use App\Models\RoomType;
use App\Models\ServiceCharge;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // --- DOANH THU ---
        $revenue_today = Booking::whereDate('updated_at', today())
                                ->where('status', 'check_out')
                                ->sum('total_price');

        $revenue_month = Booking::whereMonth('updated_at', now()->month)
                                ->where('status', 'check_out')
                                ->sum('total_price');

        $revenue_year = Booking::whereYear('updated_at', now()->year)
                               ->where('status', 'check_out')
                               ->sum('total_price');

        $revenue_total = Booking::where('status', 'check_out')->sum('total_price');

        // --- PHÒNG ĐƯỢC ĐẶT NHIỀU NHẤT ---
        $top_room_types = Booking::select('room_type_id', DB::raw('COUNT(*) as count'))
            ->groupBy('room_type_id')
            ->with('roomType')
            ->orderByDesc('count')
            ->take(5)
            ->get();

        // --- DỊCH VỤ SỬ DỤNG NHIỀU ---
        $top_services = ServiceCharge::select('service_id', DB::raw('SUM(quantity) as qty'))
            ->groupBy('service_id')
            ->with('service')
            ->orderByDesc('qty')
            ->take(5)
            ->get();

        // --- THIỆT HẠI ---
        $damage_total = DamageInvoice::sum('amount');

        $damage_common = DamageInvoice::select('damage_type_id', DB::raw('COUNT(*) as total'))
            ->groupBy('damage_type_id')
            ->with('damageType')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        return view('admin.dashboard', compact(
            'revenue_today', 'revenue_month', 'revenue_year', 'revenue_total',
            'top_room_types', 'top_services',
            'damage_total', 'damage_common'
        ));
    }
}
