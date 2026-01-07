import React, { useEffect, useState } from "react";
import {
  FloatButton,
  Drawer,
  Input,
  Button,
  List,
  message as antdMessage,
} from "antd";
import { MessageOutlined } from "@ant-design/icons";
import axiosInstance from "../../providers/data/axiosConfig";

interface ChatMessage {
  id?: number;
  message: string;
  sender_type: "user" | "admin";
}

export const ClientChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  /* =========================
     LOAD MESSAGES BY CONVERSATION
  ========================== */
  const loadMessages = async (convId: number) => {
    try {
      const res = await axiosInstance.get(`/chat/${convId}`);
      if (res.data?.data?.messages) {
        setMessages(res.data.data.messages);
      }
    } catch {
      // silent fail
    }
  };

  /* =========================
     LOAD CONVERSATION + MESSAGES
     WHEN OPENING THE CHAT WIDGET
  ========================== */
  useEffect(() => {
    if (!open) return;

    axiosInstance
      .get("/chat")
      .then((res) => {
        const conversations = res.data.data;
        if (!conversations || conversations.length === 0) return;

        const conv = conversations[0]; // client has only one conversation
        setConversationId(conv.id);
        loadMessages(conv.id);
      })
      .catch(() => {
        antdMessage.error("Failed to load chat history");
      });
  }, [open]);

  /* =========================
     REALTIME POLLING (3s)
  ========================== */
  useEffect(() => {
    if (!conversationId || !open) return;

    const interval = setInterval(() => {
      loadMessages(conversationId);
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, open]);

  /* =========================
     SEND MESSAGE
  ========================== */
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setSending(true);

      await axiosInstance.post("/chat/send", {
        message: text,
      });

      setText("");
    } catch {
      antdMessage.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        onClick={() => setOpen(true)}
        style={{ right: 24, bottom: 24 }}
      />

      <Drawer
        title="Chat with Us"
        placement="right"
        width={360}
        open={open}
        onClose={() => setOpen(false)}
      >
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              style={{
                justifyContent:
                  item.sender_type === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background:
                    item.sender_type === "user" ? "#1677ff" : "#f5f5f5",
                  color: item.sender_type === "user" ? "#fff" : "#000",
                  padding: "8px 12px",
                  borderRadius: 8,
                  maxWidth: "75%",
                }}
              >
                {item.message}
              </div>
            </List.Item>
          )}
        />

        <Input.TextArea
          rows={2}
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          type="primary"
          block
          loading={sending}
          style={{ marginTop: 8 }}
          onClick={handleSend}
        >
          Send
        </Button>
      </Drawer>
    </>
  );
};
