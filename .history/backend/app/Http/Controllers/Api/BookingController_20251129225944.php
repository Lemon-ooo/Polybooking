<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Http\Request;
use RuntimeException;
use App\Models\AssignedRoom;
use App\Models\Room;
use App\Models\ServiceCharge;
use App\Models\PenaltyCharge;
use App\Models\Service;
use Illuminate\Support\Facades\DB;


class BookingController extends Controller
{
    private function success($data, $message = '')
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => $message,
        ]);
    }

    private function error($message, $code = 500)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $code);
    }

    /**
     * POST /api/bookings
     * Tạo booking dùng lại BookingService (giống Web)
     */
    public function store(Request $request, BookingService $bookingService)
    {
        // DÒNG DEBUG: nếu request thực sự vào đây sẽ thấy text này
        // dd('API BookingController@store');

        $validated = $request->validate([
            'user_id'                  => ['required', 'integer', 'exists:users,user_id'],
            'check_in'                 => ['required', 'date', 'after_or_equal:today'],
            'check_out'                => ['required', 'date', 'after:check_in'],
            'guest_number'             => ['required', 'integer', 'min:1'],
            'room_type_ids'            => ['required', 'array', 'min:1'],
            'room_type_ids.*'          => ['required', 'integer', 'exists:room_types,room_type_id'],
            'quantities'               => ['required', 'array', 'min:1'],
            'quantities.*'             => ['required', 'integer', 'min:0'],
        ]);

        // Lấy user theo user_id (API không dùng session web)
        /** @var \App\Models\User $user */
        $user = User::where('user_id', $validated['user_id'])->firstOrFail();

        try {
            $booking = $bookingService->createBookingForUser($user, $validated);
        } catch (RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (\Throwable $e) {
            return $this->error('Lỗi server khi tạo booking: ' . $e->getMessage(), 500);
        }

        return $this->success($booking, 'Booking created successfully.');
    }

    /**
     * GET /api/bookings
     * (tạm thời lọc theo user_id truyền vào query cho dễ test)
     * /api/bookings?user_id=4
     */
    public function index(Request $request)
    {
        $userId = $request->query('user_id');

        $query = Booking::with(['items.roomType'])
            ->orderByDesc('created_at');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $bookings = $query->paginate(10);

        return $this->success($bookings, 'Booking list');
    }

    /**
     * GET /api/bookings/{id}
     */
    public function show($id, Request $request)
    {
        $userId = $request->query('user_id');

        $bookingQuery = Booking::with([
            'items.roomType',
            'assignedRooms.room',
            'serviceCharges.service',
            'penaltyCharges',
        ])
            ->where('booking_id', $id);

        if ($userId) {
            $bookingQuery->where('user_id', $userId);
        }

        $booking = $bookingQuery->firstOrFail();

        return $this->success($booking, 'Booking detail');
    }
    //
    public function assignRooms($bookingId, Request $request)
    {
        $data = $request->validate([
            'rooms' => ['required', 'array', 'min:1'],
            'rooms.*.room_id' => ['required', 'integer', 'exists:rooms,room_id'],
        ]);

        // Tìm booking theo khóa chính booking_id
        $booking = Booking::where('booking_id', $bookingId)->firstOrFail();

        DB::beginTransaction();

        try {
            foreach ($data['rooms'] as $item) {
                // Lấy phòng theo room_id
                $room = Room::where('room_id', $item['room_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                // ⚠️ GIẢ SỬ phòng trống là 'available' trong cột room_status
                // Nếu bro đang dùng giá trị khác (ví dụ: 'empty', 'vacant', 0,1,...) thì chỉ cần đổi chuỗi bên dưới.
                if ($room->room_status !== 'available') {
                    DB::rollBack();
                    return $this->error("Room {$room->room_id} is not available", 422);
                }

                // Tạo bản ghi gán phòng
                AssignedRoom::create([
                    'booking_id'   => $booking->booking_id,
                    'room_id'      => $room->room_id,
                    'room_type_id' => $room->room_type_id,
                    'check_in'     => $booking->check_in,
                    'check_out'    => $booking->check_out,
                    // nếu bảng assigned_rooms còn cột NOT NULL khác (vd: status) thì thêm vào đây
                    // 'status'       => 'assigned',
                ]);

                // Cập nhật trạng thái phòng
                // ⚠️ GIẢ SỬ trạng thái sau khi gán là 'occupied'
                $room->room_status = 'occupied';   // đổi chuỗi này theo schema thực tế nếu cần
                $room->save();
            }

            // Có thể update status booking nếu muốn (tuỳ design)
            // ví dụ: $booking->status = 'assigned';
            $booking->save();

            DB::commit();

            $booking->load('assignedRooms.room');

            return $this->success($booking, 'Rooms assigned successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error('Lỗi server khi gán phòng: ' . $e->getMessage(), 500);
        }
    }
public function addServices($bookingId, Request $request)
{
    $data = $request->validate([
        'services'              => ['required', 'array', 'min:1'],
        'services.*.service_id' => ['required', 'integer', 'exists:services,service_id'],
        'services.*.quantity'   => ['required', 'integer', 'min:1'],
    ]);

    /** @var Booking $booking */
    $booking = Booking::where('booking_id', $bookingId)->firstOrFail();

    DB::beginTransaction();

    try {
        $addedAmount = 0;

        foreach ($data['services'] as $item) {

            // Lấy đúng service theo service_id
            $service = Service::where('service_id', $item['service_id'])->firstOrFail();

            // Lấy đúng cột giá: service_price
            $unitPrice = $service->service_price;

            if ($unitPrice === null) {
                DB::rollBack();
                return $this->error("Service {$item['service_id']} không có service_price hợp lệ.", 422);
            }

            $lineAmount = $unitPrice * $item['quantity'];

            // Lưu vào service_charges
            ServiceCharge::create([
                'booking_id'  => $booking->booking_id,
                'service_id'  => $service->service_id,   // cột FK trỏ về services.service_id
                'quantity'    => $item['quantity'],
                'price'  => $unitPrice,
                'amount'      => $lineAmount,
            ]);

            $addedAmount += $lineAmount;
        }

        // Cập nhật tổng tiền dịch vụ + booking + remaining_balance
        $booking->service_total_amount = ($booking->service_total_amount ?? 0) + $addedAmount;

        $booking->booking_total_amount = ($booking->room_total_amount ?? 0)
                                       + ($booking->service_total_amount ?? 0)
                                       + ($booking->penalty_total_amount ?? 0);

        $booking->remaining_balance = ($booking->remaining_balance ?? 0) + $addedAmount;

        $booking->save();

        DB::commit();

        $booking->load(['serviceCharges.service']);

        return $this->success($booking, 'Services added successfully.');
    } catch (\Throwable $e) {
        DB::rollBack();
        return $this->error('Lỗi server khi thêm dịch vụ: ' . $e->getMessage(), 500);
    }
}


    public function addPenalties($bookingId, Request $request)
    {
        $data = $request->validate([
            'penalties'            => ['required', 'array', 'min:1'],
            'penalties.*.description'   => ['required', 'string', 'max:255'],
            'penalties.*.amount'   => ['required', 'numeric', 'min:0'],
        ]);

        $booking = Booking::where('booking_id', $bookingId)->firstOrFail();

        DB::beginTransaction();

        try {
            $addedAmount = 0;

            foreach ($data['penalties'] as $item) {
                PenaltyCharge::create([
                    'booking_id' => $booking->booking_id,
                    'description'     => $item['description'],
                    'amount'     => $item['amount'],
                ]);

                $addedAmount += $item['amount'];
            }

            // cập nhật tổng phạt & booking
            $booking->penalty_total_amount = ($booking->penalty_total_amount ?? 0) + $addedAmount;
            $booking->booking_total_amount = ($booking->room_total_amount ?? 0)
                + ($booking->service_total_amount ?? 0)
                + ($booking->penalty_total_amount ?? 0);

            // remaining_balance tăng tương ứng
            $booking->remaining_balance = ($booking->remaining_balance ?? 0) + $addedAmount;

            $booking->save();

            DB::commit();

            $booking->load('penaltyCharges');

            return $this->success($booking, 'Penalties added successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error('Lỗi server khi thêm tiền phạt: ' . $e->getMessage(), 500);
        }
    }
    public function confirmPayment($bookingId, Request $request)
    {
        $data = $request->validate([
            'paid_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $booking = Booking::where('booking_id', $bookingId)->firstOrFail();

        // nếu chưa có booking_total_amount thì không cho confirm
        if (($booking->booking_total_amount ?? 0) <= 0) {
            return $this->error('Booking total amount is zero, cannot confirm payment.', 422);
        }

        // kiểm tra số tiền trả so với remaining_balance (ưu tiên remaining)
        $remaining = $booking->remaining_balance ?? $booking->booking_total_amount;

        if ($data['paid_amount'] < $remaining) {
            // cho phép bro siết chặt: phải trả đủ 100%
            return $this->error('Paid amount is less than remaining balance.', 422);
        }

        // cập nhật remaining_balance = 0, status = 'paid'
        $booking->remaining_balance = 0;
        $booking->status = 'paid';   // nếu hệ thống bro đang dùng STATUS_PAID constant thì chỉnh lại

        $booking->save();

        return $this->success($booking, 'Payment confirmed successfully.');
    }
}