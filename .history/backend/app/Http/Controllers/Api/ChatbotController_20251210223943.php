<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use App\Models\RoomType;
use App\Models\Room;
use App\Models\Booking;
use App\Models\Service;

class ChatbotController extends Controller
{
    public function handle(Request $request)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $userMessage = $request->message;

        // Lấy dữ liệu thật từ db
        $roomTypes = RoomType::all();
        $rooms = Room::all();
        $bookings = Booking::all();
        $services = Service::all();
        $amenities = Amenity::all();

        // Tạo prompt tự nhiên, không JSON encode để tránh bị escape ký tự
        $prompt = "
Bạn là một chatbot tư vấn homestay.
Dưới đây là dữ liệu từ hệ thống:

=== ROOM TYPES ===
$roomTypes

=== ROOMS ===
$rooms

=== BOOKINGS ===
$bookings

== SERVICES ==
$services

=== AMENITIES ===
$amenities

Hãy trả lời NGẮN GỌN – TỰ NHIÊN – DỄ HIỂU — hoàn toàn bằng tiếng Việt.
Không được trả lời kiểu mô tả JSON.
Trả lời nhí nhảnh 1 chút cho vui.

Không được dùng dấu ngoặc kép và dấu \ xung quanh tên phòng.
Khách hỏi gì liên quan về cách liên lạc để hỗ trợ thì hãy bảo gọi cho số 0904349668 (quản lý)
Nếu câu hỏi vượt ngoài dữ liệu thì hãy trả lời: 'Hiện tại mình không tìm thấy thông tin này trong hệ thống.'

Câu hỏi của khách: $userMessage
        ";

        $response = Http::withHeaders([
    'Content-Type' => 'application/json',
    'x-goog-api-key' => env('GEMINI_API_KEY'),
])->post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    [
        'contents' => [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ]
    ]
);

// Log để kiểm tra API trả về gì
\Log::info('Gemini response = ', $response->json());

// Parse JSON
$raw = $response->json();

// Nếu có lỗi từ API
if (isset($raw['error'])) {
    return response()->json([
        'success' => false,
        'reply' => 'Gemini trả lỗi: ' . $raw['error']['message'],
        'raw' => $raw
    ]);
}

// Nếu không có lỗi → lấy message AI trả về
$reply = $raw['candidates'][0]['content']['parts'][0]['text']
    ?? 'Hiện tại AI chưa phản hồi.';

// Trim
$reply = trim($reply);

return response()->json([
    'success' => true,
    'reply' => $reply
]);

    }
}
