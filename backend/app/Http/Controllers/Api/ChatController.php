<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * =========================
     * CLIENT GỬI TIN NHẮN
     * POST /api/chat/send
     * =========================
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // tạo hoặc lấy conversation theo user_id
        $conversation = Conversation::firstOrCreate([
            'user_id' => $user->user_id,
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'        => $user->user_id,
            'sender_type'      => 'user',
            'message'          => $request->message,
        ]);

        return response()->json([
            'message' => 'Gửi tin nhắn thành công',
            'conversation_id' => $conversation->id,
        ]);
    }

    /**
     * =========================
     * DANH SÁCH CHAT
     * GET /api/chat
     * =========================
     */
    public function list()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // =========================
        // ADMIN: xem tất cả chat
        // =========================
        if ($user->role === 'admin') {
            $conversations = Conversation::with([
                    'user',
                    'messages' => function ($q) {
                        $q->latest()->limit(1);
                    }
                ])
                ->latest()
                ->get()
                ->map(function ($conv) {
                    return [
                        'id'           => $conv->id,
                        'user_id'      => $conv->user_id,
                        'user'         => $conv->user,
                        'last_message' => optional($conv->messages->first())->message,
                    ];
                });
        }
        // =========================
        // CLIENT: chỉ chat của mình
        // =========================
        else {
            $conversations = Conversation::with([
                    'messages' => function ($q) {
                        $q->latest()->limit(1);
                    }
                ])
                ->where('user_id', $user->user_id)
                ->latest()
                ->get()
                ->map(function ($conv) {
                    return [
                        'id'           => $conv->id,
                        'user_id'      => $conv->user_id,
                        'last_message' => optional($conv->messages->first())->message,
                    ];
                });
        }

        return response()->json([
            'data' => $conversations,
        ]);
    }

    /**
     * =========================
     * CHI TIẾT 1 CUỘC CHAT
     * GET /api/chat/{id}
     * =========================
     */
    public function show($id)
    {
        $conversation = Conversation::with([
            'user',
            'messages' => function ($q) {
                $q->orderBy('created_at', 'asc');
            }
        ])->findOrFail($id);

        return response()->json([
            'data' => $conversation,
        ]);
    }

    /**
     * =========================
     * ADMIN TRẢ LỜI
     * POST /api/chat/{id}/reply
     * =========================
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $message = Message::create([
            'conversation_id' => $id,
            'sender_id'        => $admin->user_id,
            'sender_type'      => 'admin',
            'message'          => $request->message,
        ]);

        // gán admin_id cho conversation nếu chưa có
        Conversation::where('id', $id)
            ->whereNull('admin_id')
            ->update(['admin_id' => $admin->user_id]);

        return response()->json($message);
    }
}