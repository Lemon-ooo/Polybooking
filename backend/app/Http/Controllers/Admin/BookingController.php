<?php
// app/Http/Controllers/Admin/BookingController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BookingStoreRequest;
use App\Http\Requests\Admin\AssignRoomRequest;
use App\Services\BookingService;
use App\Models\{Booking, BookingRoom, Room};
use App\Enums\BookingStatus;
use Illuminate\Http\Request;
use App\Models\RoomType;
use App\Models\User;
use App\Models\Service;
use Illuminate\Support\Facades\DB;


class BookingController extends Controller
{
    public function __construct(private BookingService $svc) {}

    public function index(Request $r)
    {
        // 👉 Mỗi lần vào danh sách, cập nhật trạng thái theo ngày hiện tại
        $this->svc->autoUpdateStatusesForToday();

        $bookings = Booking::with(['user'])
            ->when($r->status, fn($q) => $q->where('status', $r->status))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->appends($r->query());

        return view('admin.bookings.index', compact('bookings'));
    }

    public function create()
    {
        // users: dùng cột id (chuẩn Laravel)
        $users     = User::select('id','name')->orderBy('name')->get();
        $roomTypes = RoomType::select('id','name','base_price')->orderBy('name')->get();
        $services  = Service::select('id','name','price')->orderBy('name')->get();
        
        return view('admin.bookings.create', compact('users','roomTypes','services'));
    }

    public function store(BookingStoreRequest $req) {
        try {
            $booking = $this->svc->createBooking($req->validated());
            return redirect()->route('admin.bookings.show', $booking)->with('ok','Tạo booking thành công');
        } catch (\Throwable $e) {
            return back()->withErrors(['items'=>$e->getMessage()])->withInput();
        }
    }

    public function show(Booking $booking)
    {
        // Cập nhật toàn hệ thống 1 lần trước khi hiển thị chi tiết
        $this->svc->autoUpdateStatusesForToday();

        // Reload lại booking cho chắc (vì status có thể vừa đổi)
        $booking->refresh()->load([
            'user',
            'items.type',
            'items.room',
            'services.service',
        ]);

        return view('admin.bookings.show', compact('booking'));
    }

    // public function setStatus(Request $r, Booking $booking) {
    //     $r->validate(['status'=>'required|in:pending,confirmed,checked_in,checked_out,cancelled']);
    //     $booking->update(['status'=>$r->status]);
    //     return back()->with('ok','Đã đổi trạng thái');
    // }
    public function setStatus(Request $request, Booking $booking)
{
    // validate trạng thái mới
    $data = $request->validate([
        'status' => ['required', 'in:pending,confirmed,checked_in,checked_out,cancelled'],
    ]);

    $newStatus = $data['status'];
    $oldStatus = $booking->status;

    // Quy tắc đơn giản:
    // - Đã cancelled hoặc checked_out thì không cho đổi nữa
    if (in_array($oldStatus, ['cancelled', 'checked_out']) && $oldStatus !== $newStatus) {
        return back()->with('error', 'Booking đã '.$oldStatus.' nên không thể đổi trạng thái.');
    }

    $booking->status = $newStatus;
    $booking->save();

    return back()->with('ok', 'Đã chuyển trạng thái booking từ "'.$oldStatus.'" sang "'.$newStatus.'".');
}

    // public function assignRoom(AssignRoomRequest $r, BookingRoom $bookingRoom) {
    //     try {
    //         $this->svc->assignRoom($bookingRoom->booking_room_id, (int)$r->room_id);
    //         return back()->with('ok','Đã gán phòng');
    //     } catch (\Throwable $e) {
    //         return back()->withErrors(['room_id'=>$e->getMessage()]);
    //     }
    // }
    public function assignRoom(BookingRoom $bookingRoom, Request $request)
    {
        // Validate room_id gửi lên
        $data = $request->validate([
            'room_id' => ['required','integer','exists:rooms,room_id'],
        ]);

        try {
            // Gọi service để kiểm tra overlap + đúng room_type
            $this->svc->assignRoom($bookingRoom->booking_room_id, (int)$data['room_id']);

            return back()->with('ok', 'Gán phòng thành công.');
        } catch (\Throwable $e) {
            // Nếu trùng lịch hoặc sai loại phòng, service ném RuntimeException → ta báo lỗi lại
            return back()->with('error', $e->getMessage())->withInput();
        }
    }
    public function destroy(Booking $booking)
{
    try {
        DB::transaction(function () use ($booking) {
            // Xoá booking_rooms
            $booking->items()->delete();

            // Xoá booking_services
            $booking->services()->delete();

            // Xoá booking
            $booking->delete();
        });

        return redirect()
            ->route('admin.bookings.index')
            ->with('ok', 'Xóa booking thành công.');
    } catch (\Throwable $e) {
        return back()->withErrors(['err' => $e->getMessage()]);
    }
}


}
