<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * User gửi tin nhắn cho admin
     */
    public function sendMessage(Request $request)
{
    $data = $request->validate([
        'user_id' => 'required|exists:users,user_id',
        'message' => 'required|string',
    ]);

    $conversation = Conversation::firstOrCreate([
        'user_id' => $data['user_id'],
    ]);

    Message::create([
        'conversation_id' => $conversation->id,
        'sender_id' => $data['user_id'],
        'sender_type' => 'user',
        'message' => $data['message'],
    ]);

    return response()->json([
        'message' => 'Gửi tin nhắn thành công',
    ]);
}

    /**
     * Xem cuộc hội thoại
     */
    public function show($id)
    {
        $conversation = Conversation::with('messages')->findOrFail($id);

        return response()->json([
            'data' => $conversation,
        ]);
    }

    /**
     * Admin trả lời
     */
    public function reply(Request $request, $id)
{
    $data = $request->validate([
        'admin_id' => 'required|exists:users,user_id',
        'message' => 'required|string',
    ]);

    Message::create([
        'conversation_id' => $id,
        'sender_id' => $data['admin_id'],
        'sender_type' => 'admin',
        'message' => $data['message'],
    ]);

    return response()->json([
        'message' => 'Admin trả lời thành công',
    ]);
}
}
