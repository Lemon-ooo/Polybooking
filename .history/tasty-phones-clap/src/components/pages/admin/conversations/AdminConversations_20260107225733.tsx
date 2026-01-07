import React, { useEffect, useState } from "react";
import { Row, Col, Card, message as antdMessage } from "antd";
import axiosInstance from "../../../../providers/data/axiosConfig";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

/* =====================
   TYPE
===================== */
interface Conversation {
  id: number;
  user_id: number;
  user?: {
    user_id: number;
    user_name: string;
    email?: string;
  };
}

interface Message {
  id: number;
  message: string;
  sender_type: "user" | "admin";
}

const AdminConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  /* =========================
     LOAD DANH SÁCH CONVERSATION
  ========================== */
  useEffect(() => {
    axiosInstance
      .get("/chat")
      .then((res) => {
        setConversations(res.data.data ?? []);
      })
      .catch(() => {
        antdMessage.error("Không tải được danh sách chat");
      });
  }, []);

  /* =========================
     LOAD MESSAGE
  ========================== */
  const loadMessages = async (conversationId: number) => {
    try {
      setLoadingMessages(true);
      const res = await axiosInstance.get(`/chat/${conversationId}`);
      setMessages(res.data.data.messages ?? []);
    } catch {
      antdMessage.error("Không tải được tin nhắn");
    } finally {
      setLoadingMessages(false);
    }
  };

  /* =========================
     ADMIN GỬI TIN NHẮN
  ========================== */
  const sendMessage = async (text: string) => {
    if (!selectedConversation || !text.trim()) return;

    try {
      const res = await axiosInstance.post(
        `/chat/${selectedConversation.id}/reply`,
        { message: text }
      );

      setMessages((prev) => [...prev, res.data]);
    } catch {
      antdMessage.error("Gửi tin nhắn thất bại");
    }
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Danh sách chat">
          <ConversationList
            conversations={conversations}
            onSelect={(conv) => {
              setSelectedConversation(conv);
              loadMessages(conv.id);
            }}
          />
        </Card>
      </Col>

      <Col span={16}>
        <Card
          title={
            selectedConversation
              ? `Chat với ${
                  selectedConversation.user?.user_name ??
                  `User #${selectedConversation.user_id}`
                }`
              : "Chọn cuộc hội thoại"
          }
          style={{ height: 600 }}
          loading={loadingMessages}
        >
          <ChatWindow messages={messages} />
          {selectedConversation && (
            <MessageInput onSend={sendMessage} />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default AdminConversations;
