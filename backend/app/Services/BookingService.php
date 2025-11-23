<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class BookingService
{
    /**
     * Tạo booking mới cho 1 user
     *
     * $data gồm:
     * - check_in (Y-m-d)
     * - check_out (Y-m-d)
     * - guest_number (int)
     * - room_type_ids (array)
     * - quantities (array) – cùng index với room_type_ids
     */
    public function createBookingForUser(User $user, array $data): Booking
    {
        $checkIn      = Carbon::parse($data['check_in']);
        $checkOut     = Carbon::parse($data['check_out']);
        $guestNumber  = (int) $data['guest_number'];
        $roomTypeIds  = $data['room_type_ids'] ?? [];
        $quantities   = $data['quantities'] ?? [];

        if ($checkOut->lessThanOrEqualTo($checkIn)) {
            throw new RuntimeException('Ngày check-out phải sau ngày check-in.');
        }

        $numberOfNights = $checkIn->diffInDays($checkOut);

        if ($numberOfNights <= 0) {
            throw new RuntimeException('Số đêm lưu trú phải lớn hơn 0.');
        }

        // Ghép room_type_id với quantity
        $itemsData = $this->buildItemsData($roomTypeIds, $quantities);

        if (empty($itemsData)) {
            throw new RuntimeException('Bạn phải chọn ít nhất một loại phòng.');
        }

        // Lấy thông tin RoomType
        $roomTypes = RoomType::whereIn('room_type_id', array_column($itemsData, 'room_type_id'))
            ->get()
            ->keyBy('room_type_id');

        // 1) Validate sức chứa
        $this->validateCapacity($roomTypes, $itemsData, $guestNumber);

        // 2) Validate số lượng phòng trống
        $this->validateAvailability($roomTypes, $itemsData, $checkIn, $checkOut);

        // 3) Tạo booking + booking_items trong transaction
        return DB::transaction(function () use (
            $user,
            $checkIn,
            $checkOut,
            $guestNumber,
            $numberOfNights,
            $roomTypes,
            $itemsData
        ) {
            $booking = Booking::create([
                'user_id'               => $user->user_id,
                'check_in'              => $checkIn,
                'check_out'             => $checkOut,
                'guest_number'          => $guestNumber,
                'room_total_amount'     => 0,
                'service_total_amount'  => 0,
                'penalty_total_amount'  => 0,
                'booking_total_amount'  => 0,
                'remaining_balance'     => 0,
                'status'                => Booking::STATUS_UNPAID,
            ]);

            // Tạo từng booking_item
            foreach ($itemsData as $item) {
                $roomTypeId = $item['room_type_id'];
                $quantity   = $item['quantity'];

                /** @var RoomType $rt */
                $rt = $roomTypes->get($roomTypeId);

                $basePrice = $rt->base_price;
                $amount    = $basePrice * $numberOfNights * $quantity;

                BookingItem::create([
                    'booking_id'        => $booking->booking_id,
                    'room_type_id'      => $roomTypeId,
                    'quantity'          => $quantity,
                    'number_of_nights'  => $numberOfNights,
                    'base_price'        => $basePrice,
                    'amount'            => $amount,
                ]);
            }

            // Tính lại total (room_total_amount, booking_total_amount, remaining_balance, ...)
            $booking->recalculateTotals();

            return $booking;
        });
    }

    /**
     * Ghép room_type_ids & quantities thành mảng thống nhất
     */
    protected function buildItemsData(array $roomTypeIds, array $quantities): array
    {
        $items = [];

        foreach ($roomTypeIds as $index => $roomTypeId) {
            $roomTypeId = (int) $roomTypeId;
            $qty        = isset($quantities[$index]) ? (int) $quantities[$index] : 0;

            if ($roomTypeId > 0 && $qty > 0) {
                $items[] = [
                    'room_type_id' => $roomTypeId,
                    'quantity'     => $qty,
                ];
            }
        }

        return $items;
    }

    /**
     * Validate sức chứa tổng: guest_number ≤ Σ(quantity * max_guests)
     */
    protected function validateCapacity($roomTypes, array $itemsData, int $guestNumber): void
    {
        $totalCapacity = 0;

        foreach ($itemsData as $item) {
            $roomTypeId = $item['room_type_id'];
            $quantity   = $item['quantity'];

            /** @var RoomType|null $rt */
            $rt = $roomTypes->get($roomTypeId);

            if (!$rt) {
                throw new RuntimeException("Loại phòng {$roomTypeId} không tồn tại.");
            }

            $maxGuests = (int) $rt->max_guests;
            $totalCapacity += $maxGuests * $quantity;
        }

        if ($guestNumber > $totalCapacity) {
            throw new RuntimeException("Số khách ({$guestNumber}) vượt quá sức chứa tối đa ({$totalCapacity}).");
        }
    }

    /**
     * Validate availability cho từng room_type trong khoảng [checkIn, checkOut)
     * Dựa trên:
     *  - tổng số phòng vật lý của room_type
     *  - tổng quantity của các booking trùng ngày có status = paid|confirmed
     */
    protected function validateAvailability($roomTypes, array $itemsData, Carbon $checkIn, Carbon $checkOut): void
    {
        foreach ($itemsData as $item) {
            $roomTypeId = $item['room_type_id'];
            $quantity   = $item['quantity'];

            $available = $this->getAvailableRoomsCount($roomTypeId, $checkIn, $checkOut);

            if ($quantity > $available) {
                throw new RuntimeException(
                    "Loại phòng ID {$roomTypeId} chỉ còn {$available} phòng trống trong khoảng ngày đã chọn."
                );
            }
        }
    }

    /**
     * Số phòng trống = tổng phòng - phòng đã được giữ trong booking trùng ngày (paid|confirmed)
     */
    public function getAvailableRoomsCount(int $roomTypeId, Carbon $checkIn, Carbon $checkOut): int
    {
        // Tổng số phòng của loại này
        $totalRooms = Room::where('room_type_id', $roomTypeId)->count();

        if ($totalRooms === 0) {
            return 0;
        }

        // Số lượng phòng đã "bị giữ" bởi booking cùng loại, trùng ngày, đã thanh toán/confirm
        $bookedQuantity = BookingItem::where('room_type_id', $roomTypeId)
            ->whereHas('booking', function ($q) use ($checkIn, $checkOut) {
                $q->whereIn('status', [Booking::STATUS_PAID, Booking::STATUS_CONFIRMED])
                  ->where('check_in', '<', $checkOut)   // overlap condition
                  ->where('check_out', '>', $checkIn);
            })
            ->sum('quantity');

        $available = $totalRooms - $bookedQuantity;

        return max($available, 0);
    }
}
