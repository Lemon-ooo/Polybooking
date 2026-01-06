<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use RuntimeException;

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

    private function error($code, $message, $details = [], $httpCode = 400)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => $code,
                'message' => $message,
                'details' => $details,
            ],
        ], $httpCode);
    }

    public function store(Request $request)
    {
        if (!$request->user()) {
            return $this->error(
                'UNAUTHENTICATED',
                'Bạn chưa đăng nhập hoặc token không hợp lệ',
                [],
                401
            );
        }

        $validator = Validator::make($request->all(), [
            'check_in'  => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',

            'adults'   => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',

            'room_types' => 'required|array|min:1',
            'room_types.*.room_type_id' => 'required|exists:room_types,room_type_id',
            'room_types.*.quantity'     => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->error(
                'VALIDATION_ERROR',
                'Dữ liệu không hợp lệ',
                $validator->errors(),
                422
            );
        }

        $data = $validator->validated();

        $checkIn  = Carbon::parse($data['check_in'])->startOfDay();
        $checkOut = Carbon::parse($data['check_out'])->startOfDay();
        $nights   = $checkIn->diffInDays($checkOut);

        if ($nights <= 0) {
            throw new RuntimeException('Số đêm không hợp lệ');
        }

        DB::beginTransaction();

        try {
            $totalPrice = 0;

            foreach ($data['room_types'] as $item) {
                $roomType = RoomType::where(
                    'room_type_id',
                    $item['room_type_id']
                )->firstOrFail();

                $totalPrice +=
                    $roomType->base_price *
                    $item['quantity'] *
                    $nights;
            }

            $user = $request->user();

            if (!$user) {
                return $this->error(
                    'UNAUTHENTICATED',
                    'Vui lòng đăng nhập để đặt phòng',
                    [],
                    401
                );
            }

            $booking = Booking::create([
                'user_id'     => $request->user()->user_id,
                'adults'      => $data['adults'],
                'children'    => $data['children'] ?? 0,
                'check_in'    => $checkIn->toDateString(),
                'check_out'   => $checkOut->toDateString(),
                'nights'      => $nights,
                'total_price' => $totalPrice,
                'status'      => Booking::STATUS_PENDING_PAYMENT,
            ]);

            foreach ($data['room_types'] as $item) {
                $roomType = RoomType::where(
                    'room_type_id',
                    $item['room_type_id']
                )->first();

                BookingItem::create([
                    'booking_id'   => $booking->id,
                    'room_type_id' => $roomType->room_type_id,
                    'quantity'     => $item['quantity'],    
                    'base_price'   => $roomType->base_price,
                    'number_of_nights' =>$booking->nights,
                    'amount' => $roomType->base_price * $item['quantity'] * $nights,
                ]);
            }

            DB::commit();

            return $this->success(
                $booking->load('items'),
                'Tạo booking thành công'
            );
        } catch (\Throwable $e) {
            DB::rollBack();

            return $this->error(
                'BOOKING_FAILED',
                $e->getMessage(),
                [],
                500
            );
        }
    }
}