<?php

namespace App\Services;

use App\Models\AssignedRoom;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\PenaltyCharge;
use App\Models\Room;
use App\Models\Service;
use App\Models\ServiceCharge;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class BookingAdminService
{
    /**
     * Đánh dấu booking là đã thanh toán (paid)
     * Chỉ cho phép từ trạng thái unpaid.
     */
    public function markAsPaid(Booking $booking): Booking
    {
        if ($booking->status !== Booking::STATUS_UNPAID) {
            throw new RuntimeException('Chỉ có thể chuyển sang paid khi booking đang ở trạng thái unpaid.');
        }

        $booking->status = Booking::STATUS_PAID;
        $booking->save();

        return $booking;
    }

    /**
     * Gán phòng cụ thể cho 1 booking.
     *
     * $assignments: array dạng
     *  [
     *      booking_item_id => [room_id1, room_id2, ...],
     *      ...
     *  ]
     *
     * Logic:
     *  - Số lượng room_id phải khớp với quantity của booking_item
     *  - Mỗi phòng:
     *      + thuộc đúng room_type
     *      + status = available
     *      + không bị trùng ngày với assigned_rooms khác
     *  - Sau khi gán đầy đủ → set booking.status = confirmed
     */
    public function assignRooms(Booking $booking, array $assignments): Booking
    {
        if (!in_array($booking->status, [Booking::STATUS_PAID, Booking::STATUS_CONFIRMED])) {
            throw new RuntimeException('Chỉ gán phòng cho booking đã paid hoặc confirmed.');
        }

        $checkIn  = Carbon::parse($booking->check_in);
        $checkOut = Carbon::parse($booking->check_out);

        return DB::transaction(function () use ($booking, $assignments, $checkIn, $checkOut) {

            $items = $booking->items()->get()->keyBy('booking_item_id');

            foreach ($assignments as $bookingItemId => $roomIds) {
                /** @var BookingItem|null $item */
                $item = $items->get($bookingItemId);

                if (!$item) {
                    throw new RuntimeException("Booking item {$bookingItemId} không tồn tại.");
                }

                $roomIds = array_filter(array_map('intval', $roomIds));
                $roomIds = array_values(array_unique($roomIds)); // loại trùng

                if (count($roomIds) === 0) {
                    throw new RuntimeException("Bạn phải chọn phòng cho booking item ID {$bookingItemId}.");
                }

                if (count($roomIds) !== $item->quantity) {
                    throw new RuntimeException(
                        "Số phòng gán cho loại phòng {$item->room_type_id} phải đúng bằng quantity = {$item->quantity}."
                    );
                }

                // Gán từng phòng
                foreach ($roomIds as $roomId) {
                    $room = Room::where('room_id', $roomId)->first();

                    if (!$room) {
                        throw new RuntimeException("Phòng ID {$roomId} không tồn tại.");
                    }

                    // Check đúng loại phòng
                    if ((int)$room->room_type_id !== (int)$item->room_type_id) {
                        throw new RuntimeException(
                            "Phòng ID {$roomId} không thuộc loại phòng ID {$item->room_type_id}."
                        );
                    }

                    // Check trạng thái phòng
                    if ($room->room_status !== 'available') {
                        throw new RuntimeException("Phòng {$room->room_number} hiện không ở trạng thái available.");
                    }

                    // Check trùng lịch
                    $hasConflict = AssignedRoom::where('room_id', $room->room_id)
                        ->where('check_in', '<', $checkOut)
                        ->where('check_out', '>', $checkIn)
                        ->where('booking_id', '!=', $booking->booking_id)
                        ->exists();

                    if ($hasConflict) {
                        throw new RuntimeException("Phòng {$room->room_number} đã được đặt trong khoảng ngày này.");
                    }

                    // Nếu mọi thứ ok → tạo assigned_room
                    AssignedRoom::create([
                        'booking_id'   => $booking->booking_id,
                        'room_id'      => $room->room_id,
                        'room_type_id' => $room->room_type_id,
                        'check_in'     => $booking->check_in,
                        'check_out'    => $booking->check_out,
                    ]);

                    // Có thể update status phòng sang 'booked' (optional)
                    $room->room_status = 'booked';
                    $room->save();
                }
            }

            // Nếu gán thành công, set booking status = confirmed
            $booking->status = Booking::STATUS_CONFIRMED;
            $booking->save();

            return $booking;
        });
    }

    /**
     * Thêm service charge cho booking.
     *
     * $data:
     *  - service_id
     *  - quantity
     *  - price (optional: nếu null thì lấy từ bảng services)
     */
    public function addServiceCharge(Booking $booking, array $data): Booking
    {
        if (!in_array($booking->status, [Booking::STATUS_PAID, Booking::STATUS_CONFIRMED])) {
            throw new RuntimeException('Chỉ thêm dịch vụ cho booking đã thanh toán phòng.');
        }

        $serviceId = (int)($data['service_id'] ?? 0);
        $quantity  = (int)($data['quantity'] ?? 1);
        $price     = $data['price'] ?? null;

        if ($quantity <= 0) {
            throw new RuntimeException('Số lượng dịch vụ phải lớn hơn 0.');
        }

        /** @var Service|null $service */
        $service = Service::where('service_id', $serviceId)->first();

        if (!$service) {
            throw new RuntimeException("Dịch vụ không tồn tại.");
        }

        // Cột giá dịch vụ trong bảng services (theo đặt tả trước bro dùng sevice_price)
        if ($price === null) {
            $price = $service->service_price ?? 0; // chú ý: sevice_price (typo theo migrate)
        }

        $amount = $price * $quantity;

        DB::transaction(function () use ($booking, $service, $quantity, $price, $amount) {
            ServiceCharge::create([
                'booking_id' => $booking->booking_id,
                'service_id' => $service->service_id,
                'quantity'   => $quantity,
                'price'      => $price,
                'amount'     => $amount,
            ]);

            // Recalc totals
            $booking->recalculateTotals();
        });

        return $booking->fresh();
    }

    /**
     * Xoá 1 service charge
     */
    public function deleteServiceCharge(ServiceCharge $charge): Booking
    {
        $booking = $charge->booking;

        DB::transaction(function () use ($booking, $charge) {
            $charge->delete();
            $booking->recalculateTotals();
        });

        return $booking->fresh();
    }

    /**
     * Thêm penalty charge (phí phạt).
     *
     * $data:
     *  - description
     *  - amount
     */
    public function addPenalty(Booking $booking, array $data): Booking
    {
        $amount = (float)($data['amount'] ?? 0);

        if ($amount <= 0) {
            throw new RuntimeException('Số tiền phạt phải lớn hơn 0.');
        }

        $description = $data['description'] ?? null;

        DB::transaction(function () use ($booking, $amount, $description) {
            PenaltyCharge::create([
                'booking_id'  => $booking->booking_id,
                'description' => $description,
                'amount'      => $amount,
            ]);

            $booking->recalculateTotals();
        });

        return $booking->fresh();
    }

    /**
     * Xoá penalty charge
     */
    public function deletePenalty(PenaltyCharge $penalty): Booking
    {
        $booking = $penalty->booking;

        DB::transaction(function () use ($booking, $penalty) {
            $penalty->delete();
            $booking->recalculateTotals();
        });

        return $booking->fresh();
    }
}
