<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class RevenueController extends Controller
{
    /**
     * GET /api/revenue/summary
     * Tổng doanh thu (today / month / year)
     */
    public function summary()
    {
        $today = now()->toDateString();

        return response()->json([
            'success' => true,
            'data' => [
                'today' => $this->revenueByDate($today, $today),
                'this_month' => $this->revenueByMonth(now()->year, now()->month),
                'this_year' => $this->revenueByYear(now()->year),
            ]
        ]);
    }

    /**
     * GET /api/revenue/range?from=2026-01-01&to=2026-01-31
     */
    public function range(Request $request)
    {
        $data = $request->validate([
            'from' => 'required|date',
            'to'   => 'required|date|after_or_equal:from',
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->revenueByDate($data['from'], $data['to']),
        ]);
    }

    /**
     * ===============================
     * PRIVATE METHODS
     * ===============================
     */

    private function baseQuery()
    {
        return Payment::where('status', 'success')
            ->whereIn('payment_type', ['room_prepaid', 'service']);
    }

    private function revenueByDate($from, $to)
    {
        $room = (clone $this->baseQuery())
            ->where('payment_type', 'room_prepaid')
            ->whereBetween('paid_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
            ->sum('amount');

        $service = (clone $this->baseQuery())
            ->where('payment_type', 'service')
            ->whereBetween('paid_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
            ->sum('amount');

        return [
            'room_revenue'    => $room,
            'service_revenue' => $service,
            'total_revenue'   => $room + $service,
        ];
    }

    private function revenueByMonth($year, $month)
    {
        return $this->revenueByDate(
            "$year-$month-01",
            now()->setYear($year)->setMonth($month)->endOfMonth()->toDateString()
        );
    }

    private function revenueByYear($year)
    {
        return $this->revenueByDate(
            "$year-01-01",
            "$year-12-31"
        );
    }


    //top 10 phòng có doanh thu cao nhất
public function topRoomTypes()
{
    $data = DB::table('payments')
        ->join('bookings', 'payments.booking_id', '=', 'bookings.id')
        ->join('booking_items', 'bookings.id', '=', 'booking_items.booking_id')
        ->join(
            'room_types',
            'booking_items.room_type_id',
            '=',
            'room_types.room_type_id'
        )
        ->where('payments.status', 'success')
        ->where('payments.payment_type', 'room_prepaid')
        ->select(
            'room_types.room_type_id as id',
            'room_types.room_type_name as name',
            DB::raw('SUM(payments.amount) as revenue'),
            DB::raw('COUNT(DISTINCT bookings.id) as total_bookings')
        )
        ->groupBy(
            'room_types.room_type_id',
            'room_types.room_type_name'
        )
        ->orderByDesc('revenue')
        ->limit(10)
        ->get();

    return response()->json([
        'success' => true,
        'data' => $data
    ]);
}


}
