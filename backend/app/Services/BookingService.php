<?php
/**
 * app/Services/BookingService.php
 *
 * Dịch vụ nghiệp vụ cho quy trình Booking:
 * - Tạo booking cùng các booking_rooms (chỉ định room_type) và booking_services (dịch vụ kèm)
 * - Kiểm tra tồn kho theo room_type trên khoảng ngày [check_in_date, check_out_date)
 * - Gán phòng thật (room_id) cho từng booking_room và chặn chồng chéo
 *
 * Yêu cầu:
 * - Bảng: bookings (booking_id pk), booking_rooms (room_type_id), booking_services
 * - Bảng tham chiếu: users(id), room_types(id), rooms(room_id, room_type_id), services(id)
 * - Enum trạng thái: App\Enums\BookingStatus (pending|confirmed|checked_in|checked_out|cancelled)
 */

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\BookingService as BookingServiceModel; // tránh trùng tên
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\RoomType;



class BookingService
{
    /**
     * Tạo một booking mới cùng danh sách phòng theo ROOM TYPE và dịch vụ kèm.
     *
     * @param array{
     *   user_id:int,
     *   special_request?:string|null,
     *   items: array<int, array{
     *      room_type_id:int,
     *      check_in_date:string (Y-m-d),
     *      check_out_date:string (Y-m-d),
     *      num_guests:int,
     *      price:numeric
     *   }>,
     *   services?: array<int, array{
     *      service_id:int,
     *      quantity?:int,
     *      price:numeric
     *   }>
     * } $payload
     *
     * @return \App\Models\Booking
     * @throws \RuntimeException khi hết phòng theo room_type ở khoảng ngày yêu cầu
     */
    public function createBooking(array $payload): Booking
{
    return DB::transaction(function () use ($payload) {
        // 1) Kiểm tra tồn kho cho TỪNG item theo room_type
        foreach ($payload['items'] as $it) {
            $this->assertRoomTypeAvailability(
                (int)$it['room_type_id'],
                Carbon::parse($it['check_in_date']),
                Carbon::parse($it['check_out_date'])
            );
        }

        // 2) Tạo booking rỗng tổng, sinh booking_code
        $booking = new Booking();
        $booking->user_id         = (int)$payload['user_id'];
        $booking->booking_code    = $this->generateCode();

        // Nếu bro dùng enum thì đổi lại cho phù hợp, ở đây xài string
        $booking->status          = 'pending';

        $booking->special_request = $payload['special_request'] ?? null;
        $booking->total_price     = 0;
        $booking->save();

        $total = 0.0;

        // 3) Tạo các booking_rooms – GIÁ LẤY THEO room_types.base_pirce
        foreach ($payload['items'] as $it) {
            /** @var \App\Models\RoomType $roomType */
            $roomType = RoomType::findOrFail((int)$it['room_type_id']);

            // 👇 GIÁ 1 ĐÊM LẤY TỪ CỘT base_pirce
            $nightPrice = (float)$roomType->base_price;

            if ($nightPrice <= 0) {
                throw new \RuntimeException(
                    'Loại phòng ID '.$roomType->id.' chưa có base_pirce hợp lệ.'
                );
            }

            $br = new BookingRoom([
                'booking_id'     => $booking->booking_id,
                'room_type_id'   => (int)$it['room_type_id'],
                'room_id'        => null, // sẽ gán sau
                'check_in_date'  => $it['check_in_date'],
                'check_out_date' => $it['check_out_date'],
                'num_guests'     => (int)$it['num_guests'],
                'price'          => $nightPrice, // snapshot giá loại phòng
            ]);
            $br->save();

            // Số đêm (ít nhất 1)
            $nights = Carbon::parse($it['check_in_date'])
                ->diffInDays(Carbon::parse($it['check_out_date']));
            $nights = max($nights, 1);

            $total += $nights * $nightPrice;
        }

        // 4) Tạo / gộp booking_services (nếu có)
$services = $payload['services'] ?? [];

foreach ($services as $sv) {
    // ❗ BỎ QUA NHỮNG DỊCH VỤ KHÔNG ĐƯỢC CHỌN
    if (empty($sv['service_id'])) {
        continue;
    }

    $qty   = max(1, (int)($sv['quantity'] ?? 1));
    $price = (float)($sv['price'] ?? 0);

    // Bỏ qua luôn nếu giá <= 0 (tuỳ bro, nhưng thường dịch vụ phải có giá)
    if ($price <= 0) {
        continue;
    }

    $bs = BookingServiceModel::where('booking_id', $booking->booking_id)
        ->where('service_id', (int)$sv['service_id'])
        ->first();

    if ($bs) {
        $bs->quantity = $bs->quantity + $qty;
        $bs->price    = $price;
        $bs->save();
    } else {
        BookingServiceModel::create([
            'booking_id' => $booking->booking_id,
            'service_id' => (int)$sv['service_id'],
            'quantity'   => $qty,
            'price'      => $price,
        ]);
    }

    $total += $qty * $price;
}


        // 5) Cập nhật tổng
        $booking->total_price = $this->roundMoney($total);
        $booking->save();

        return $booking;
    });
}



    /**
     * Kiểm tra còn phòng theo ROOM TYPE trong khoảng ngày [in, out).
     *
     * Quy tắc overlap (nửa-mở):
     *   overlap ⇔ (old_in < new_out) && (old_out > new_in)
     *
     * @param int $typeId room_types.id
     * @param \Carbon\Carbon $in
     * @param \Carbon\Carbon $out
     * @param int|null $ignoreBookingId (nếu dùng khi cập nhật một booking đã tồn tại)
     * @throws \RuntimeException
     */
    public function assertRoomTypeAvailability(int $typeId, Carbon $in, Carbon $out, ?int $ignoreBookingId = null): void
    {
        // Tổng số phòng thuộc room_type này
        $totalRooms = Room::where('room_type_id', $typeId)->count();

        // Tên cột trạng thái trên bảng bookings (status | booking_status)
        $statusCol = Schema::hasColumn('bookings', 'status') ? 'status' : 'booking_status';

        // Trạng thái còn hiệu lực giữ chỗ
        $activeStatuses = [
            BookingStatus::Pending->value,
            BookingStatus::Confirmed->value,
            BookingStatus::CheckedIn->value,
        ];

        $inStr  = $in->toDateString();
        $outStr = $out->toDateString();

        // Số booking_rooms đang chiếm chỗ (có overlap)
        $occupied = DB::table('booking_rooms as br')
            ->join('bookings as b', 'b.booking_id', '=', 'br.booking_id')
            ->where('br.room_type_id', $typeId)
            ->whereIn("b.$statusCol", $activeStatuses) // bind giá trị, không raw
            ->when($ignoreBookingId, fn ($q) => $q->where('b.booking_id', '<>', $ignoreBookingId))
            ->where(function ($q) use ($inStr, $outStr) {
                $q->where('br.check_in_date', '<', $outStr)
                  ->where('br.check_out_date', '>', $inStr);
            })
            ->count();

        if ($occupied >= $totalRooms) {
            throw new \RuntimeException('Hết phòng loại này trong khoảng ngày yêu cầu.');
        }
    }

    /**
     * Gán phòng thật (room_id) cho một booking_room.
     * - Khóa hàng booking_room để tránh race condition.
     * - Chặn gán nếu phòng đã bị chiếm trong khoảng ngày.
     * - Chặn gán nếu phòng không thuộc đúng room_type.
     *
     * @param int $bookingRoomId
     * @param int $roomId
     * @return void
     * @throws \RuntimeException
     */
    public function assignRoom(int $bookingRoomId, int $roomId): void
    {
        DB::transaction(function () use ($bookingRoomId, $roomId) {

            /** @var BookingRoom $br */
            $br = BookingRoom::lockForUpdate()->findOrFail($bookingRoomId);

            $in   = Carbon::parse($br->check_in_date)->toDateString();
            $out  = Carbon::parse($br->check_out_date)->toDateString();

            // Tên cột trạng thái
            $statusCol = Schema::hasColumn('bookings', 'status') ? 'status' : 'booking_status';

            // 1) Kiểm tra phòng có bị chiếm trong khoảng ngày không (overlap)
            $overlap = DB::table('booking_rooms as br2')
                ->join('bookings as b', 'b.booking_id', '=', 'br2.booking_id')
                ->where('br2.room_id', $roomId)
                ->where('br2.booking_room_id', '<>', $bookingRoomId)
                ->whereIn("b.$statusCol", ['pending', 'confirmed', 'checked_in'])
                ->where(function ($q) use ($in, $out) {
                    $q->where('br2.check_in_date', '<', $out)
                      ->where('br2.check_out_date', '>', $in);
                })
                ->exists();

            if ($overlap) {
                throw new \RuntimeException('Phòng này đã bị chiếm trong khoảng ngày yêu cầu.');
            }

            // 2) Kiểm tra phòng thuộc đúng room_type
            $room = Room::where('room_id', $roomId)->firstOrFail();
            if ((int)$room->room_type_id !== (int)$br->room_type_id) {
                throw new \RuntimeException('Phòng gán không thuộc đúng loại phòng (room_type).');
            }

            // 3) Gán
            $br->room_id = $roomId;
            $br->save();
        });
    }

    /**
     * Cập nhật lại tổng giá cho một booking (khi thay đổi items/services).
     *
     * @param int $bookingId
     * @return void
     */
    public function recalcTotal(int $bookingId): void
    {
        DB::transaction(function () use ($bookingId) {
            /** @var Booking $booking */
            $booking = Booking::lockForUpdate()->findOrFail($bookingId);
            $booking->load(['items', 'services']);

            $total = 0.0;

            // Tính từ items (booking_rooms)
            foreach ($booking->items as $it) {
                $nights = Carbon::parse($it->check_in_date)
                    ->diffInDays(Carbon::parse($it->check_out_date));
                $nights = max($nights, 1);
                $total += $nights * (float)$it->price;
            }

            // Tính từ services
            foreach ($booking->services as $sv) {
                $qty = (int)$sv->quantity;
                $total += $qty * (float)$sv->price;
            }

            $booking->total_price = $this->roundMoney($total);
            $booking->save();
        });
    }

    /**
     * Sinh mã booking dạng BK-YYYYMMDD-XXXXXX
     */
    protected function generateCode(): string
    {
        return 'BK-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }

    /**
     * Chuẩn hoá số tiền (2 chữ số thập phân).
     */
    protected function roundMoney(float $amount): float
    {
        return (float)number_format($amount, 2, '.', '');
    }
     /**
     * Tự động cập nhật trạng thái booking theo ngày hiện tại.
     *
     * Quy tắc:
     *  - pending  -> cancelled  nếu mọi phòng có check_in_date < hôm nay
     *  - confirmed -> checked_in nếu có ít nhất 1 phòng check_in_date <= hôm nay
     *  - checked_in -> checked_out nếu tất cả phòng check_out_date <= hôm nay
     */
    public function autoUpdateStatusesForToday(?Carbon $today = null): void
    {
        $today = ($today ?? Carbon::today())->toDateString();

        // Nếu status lưu dạng enum, lấy value; nếu là string thì dùng trực tiếp
        $pending     = \defined('\App\Enums\BookingStatus::Pending')
            ? \App\Enums\BookingStatus::Pending->value : 'pending';
        $confirmed   = \defined('\App\Enums\BookingStatus::Confirmed')
            ? \App\Enums\BookingStatus::Confirmed->value : 'confirmed';
        $checkedIn   = \defined('\App\Enums\BookingStatus::CheckedIn')
            ? \App\Enums\BookingStatus::CheckedIn->value : 'checked_in';
        $checkedOut  = \defined('\App\Enums\BookingStatus::CheckedOut')
            ? \App\Enums\BookingStatus::CheckedOut->value : 'checked_out';
        $cancelled   = \defined('\App\Enums\BookingStatus::Cancelled')
            ? \App\Enums\BookingStatus::Cancelled->value : 'cancelled';

        // 1) pending -> cancelled nếu mọi phòng check_in_date < hôm nay
        Booking::where('status', $pending)
            ->whereHas('items', function ($q) {
                // booking phải có ít nhất 1 phòng
            })
            ->whereDoesntHave('items', function ($q) use ($today) {
                // nếu còn phòng nào có check_in_date >= hôm nay → chưa hủy
                $q->whereDate('check_in_date', '>=', $today);
            })
            ->update(['status' => $cancelled]);

        // 2) confirmed -> checked_in nếu có ít nhất 1 phòng check_in_date <= hôm nay
        Booking::where('status', $confirmed)
            ->whereHas('items', function ($q) use ($today) {
                $q->whereDate('check_in_date', '<=', $today);
            })
            ->update(['status' => $checkedIn]);

        // 3) checked_in -> checked_out nếu tất cả phòng check_out_date <= hôm nay
        Booking::where('status', $checkedIn)
            ->whereHas('items', function ($q) {
                // có phòng
            })
            ->whereDoesntHave('items', function ($q) use ($today) {
                // nếu còn phòng nào có check_out_date > hôm nay → vẫn đang ở
                $q->whereDate('check_out_date', '>', $today);
            })
            ->update(['status' => $checkedOut]);
    }
}
