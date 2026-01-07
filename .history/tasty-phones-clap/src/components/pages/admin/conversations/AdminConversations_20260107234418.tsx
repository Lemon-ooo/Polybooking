import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card, message as antdMessage } from "antd";
import axiosInstance from "../../../../providers/data/axiosConfig";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

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

  const lastMessageIdRef = useRef<number | null>(null);

  /* LOAD CONVERSATIONS */
  useEffect(() => {
    axiosInstance
      .get("/chat")
      .then((res) => setConversations(res.data.data))
      .catch(() => antdMessage.error("Không tải được danh sách chat"));
  }, []);

  /* LOAD + POLL MESSAGE */
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/chat/${selectedConversation.id}`);

        const newMessages = res.data.data.messages ?? [];
        if (!newMessages.length) return;

        const lastId = newMessages[newMessages.length - 1].id;

        if (lastMessageIdRef.current === lastId) return;

        lastMessageIdRef.current = lastId;
        setMessages(newMessages);
      } catch {
        antdMessage.error("Không tải được tin nhắn");
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  /* SEND MESSAGE */
  const sendMessage = async (text: string) => {
    if (!selectedConversation) return;

    try {
      const res = await axiosInstance.post(
        `/chat/${selectedConversation.id}/reply`,
        { message: text }
      );

      setMessages((prev) => [...prev, res.data]);
      lastMessageIdRef.current = res.data.id;
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
              setMessages([]);
              lastMessageIdRef.current = null;
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
        >
          <ChatWindow messages={messages} />
          {selectedConversation && <MessageInput onSend={sendMessage} />}
        </Card>
      </Col>
    </Row>
  );
};

export default AdminConversations;
