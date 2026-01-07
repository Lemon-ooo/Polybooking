import React, { useEffect, useState } from "react";
import { FloatButton, Drawer, Input, Button, List, message as antdMessage } from "antd";
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
     LOAD CHAT CŨ KHI MỞ WIDGET
  ========================== */
  useEffect(() => {
    if (!open) return;

    // 1️⃣ lấy conversation của user
    axiosInstance
      .get("/chat")
      .then((res) => {
        const conversations = res.data.data;

        if (!conversations || conversations.length === 0) return;

        const conv = conversations[0]; // client chỉ có 1 conversation
        setConversationId(conv.id);

        // 2️⃣ load messages
        return axiosInstance.get(`/chat/${conv.id}`);
      })
      .then((res) => {
        if (res?.data?.data?.messages) {
          setMessages(res.data.data.messages);
        }
      })
      .catch(() => {
        antdMessage.error("Không tải được lịch sử chat");
      });
  }, [open]);

  /* =========================
     GỬI TIN NHẮN
  ========================== */
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setSending(true);

      const res = await axiosInstance.post("/chat/send", {
        message: text,
      });

      if (res.data.conversation_id) {
        setConversationId(res.data.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        { message: text, sender_type: "user" },
      ]);

      setText("");
    } catch (err) {
      antdMessage.error("Không gửi được tin nhắn");
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
        title="Chat với Admin"
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
          placeholder="Nhập tin nhắn..."
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
          Gửi
        </Button>
      </Drawer>
    </>
  );
};
