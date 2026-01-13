<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\Booking;
use App\Models\Room;
use App\Models\AssignedRoom;
use App\Models\BookingGuest;
use Carbon\Carbon;

class AdminCheckinController extends Controller
{
    /**
     * POST /api/admin/bookings/{booking_id}/checkin
     */
public function checkin(Request $request, $bookingId)
{
    /* ================= AUTH (ADMIN) ================= */
    $user = $request->user();
    if (!$user || $user->role !== 'admin') {
        return $this->error(
            'FORBIDDEN',
            'Bạn không có quyền thực hiện thao tác này',
            403
        );
    }

    /* ================= VALIDATION ================= */
    try {
        $validated = $request->validate([
            // room_id KHÔNG bắt buộc nữa vì check-in theo booking nhiều phòng
            'room_id' => 'sometimes|nullable|exists:rooms,room_id',

            // danh sách khách check-in
            'guests' => 'required|array|min:1',
            'guests.*.name' => 'required|string|max:255',
            'guests.*.age'  => 'required|integer|min:0',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return $this->validationError($e->errors());
    }

    /* ================= LOAD BOOKING ================= */
    $booking = Booking::with('items')->find($bookingId);
    if (!$booking) {
        return $this->error(
            'BOOKING_NOT_FOUND',
            'Không tìm thấy booking',
            404
        );
    }

    // chỉ cho check-in khi booking đã thanh toán
    if ($booking->status !== Booking::STATUS_PAID) {
        return $this->error(
            'INVALID_BOOKING_STATUS',
            'Booking chưa ở trạng thái đã thanh toán'
        );
    }
  $now = Carbon::now('Asia/Ho_Chi_Minh');

$checkinDate = Carbon::parse($booking->check_in)->timezone('Asia/Ho_Chi_Minh')->toDateString();


// đúng ngày
if ($now->toDateString() !== $checkinDate) {
    return $this->error(
        'INVALID_CHECKIN_DATE',
        'Chỉ được check-in đúng ngày nhận phòng'
    );
}

// 00:00 → 11:00
$startTime = Carbon::parse($checkinDate . ' 01:00:00', 'Asia/Ho_Chi_Minh');
$endTime   = Carbon::parse($checkinDate . ' 11:00:00', 'Asia/Ho_Chi_Minh');

if ($now->lt($startTime) || $now->gt($endTime)) {
    return $this->error(
        'INVALID_CHECKIN_TIME',
        'Chỉ được check-in trong khoảng 00:00 đến 11:00'
    );
}

   /* ================= VALIDATE GUEST COUNT ================= */
// tổng số khách đã đặt
$totalBookedGuests = ($booking->adults ?? 0) + ($booking->children ?? 0);

// số khách đã check-in trước đó
$checkedInGuests = BookingGuest::where('booking_id', $booking->booking_id)->count();

// số khách đang nhập trong lần check-in này
$currentGuests = count($validated['guests']);

// không cho vượt quá tổng booking
if ($checkedInGuests + $currentGuests > $totalBookedGuests) {
    return $this->error(
        'GUEST_OVER_LIMIT',
        'Số khách check-in vượt quá số khách đã đặt'
    );
}

    DB::beginTransaction();
    try {

        /* ================= GET ALL ASSIGNED ROOMS ================= */
        // lấy TOÀN BỘ phòng đã được gán cho booking và chưa check-in
        $assignedRooms = AssignedRoom::where('booking_id', $booking->id)
            ->where('status', AssignedRoom::STATUS_ASSIGNED)
            ->lockForUpdate()
            ->get();

        if ($assignedRooms->isEmpty()) {
            throw new \Exception('NO_ASSIGNED_ROOMS');
        }

        /* ================= SAVE GUESTS ================= */
        // lưu toàn bộ khách check-in
        foreach ($validated['guests'] as $guest) {
            BookingGuest::create([
                'booking_id' => $booking->id,
                'name'       => $guest['name'],
                'age'        => $guest['age'],
                'verified'   => true,
            ]);
        }

        /* ================= UPDATE ASSIGNED ROOMS ================= */
        // chuyển toàn bộ assigned_room → checked_in
        AssignedRoom::whereIn('assigned_room_id', $assignedRooms->pluck('assigned_room_id'))
            ->update([
                'status' => AssignedRoom::STATUS_CHECKED_IN,
                'checked_in_at' => now(),
            ]);

        /* ================= UPDATE ROOMS ================= */
        // chuyển toàn bộ room → in_use
        Room::whereIn('room_id', $assignedRooms->pluck('room_id'))
            ->lockForUpdate()
            ->update([
                'room_status' => Room::STATUS_IN_USE,
            ]);

        /* ================= UPDATE BOOKING ================= */
        // booking bắt đầu được sử dụng
        $booking->update([
            'status' => Booking::STATUS_IN_USE,
        ]);

        DB::commit();

        return $this->success([
            'booking_id' => $booking->id,
            'rooms_checked_in' => $assignedRooms->count(),
            'guests' => count($validated['guests']),
            'status' => 'checked_in',
        ]);

    } catch (\Exception $e) {
        DB::rollBack();

        return $this->error(
            'CHECKIN_FAILED',
            $e->getMessage()
        );
    }
}



    /* ================= HELPERS ================= */

    private function success($data, $status = 200)
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'meta'    => [
                'timestamp' => now()->toISOString()
            ]
        ], $status);
    }

    private function error($code, $message, $status = 400)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => $code,
                'message' => $message
            ]
        ], $status);
    }

    private function validationError($details)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => 'VALIDATION_ERROR',
                'message' => 'Dữ liệu không hợp lệ',
                'details' => $details
            ]
        ], 422);
    }
}