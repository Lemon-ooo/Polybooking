/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  List,
  Avatar,
  Typography,
} from "antd";
import {
  MessageOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../providers/data/axiosConfig";

const { Text } = Typography;

interface ChatMessage {
  id?: number;
  message: string;
  sender_type: "user" | "admin";
}

export const ClientChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = !!localStorage.getItem("token");

const loadMessages = async () => {
  try {
    const res = await axiosInstance.get("/chat");
    if (res.data?.data?.[0]) {
      const chatId = res.data.data[0].id;
      const r = await axiosInstance.get(`/chat/${chatId}`);
      setMessages(r.data.data.messages ?? []);
    }
  } catch (err) {
    console.error("Load messages error", err);
  }
};


  /* AUTO SCROLL */
 useEffect(() => {
  if (!open) return;

  // load lần đầu khi mở chat
  loadMessages();

  // auto reload mỗi 5 giây
  const interval = setInterval(() => {
    loadMessages();
  }, 5000);

  // cleanup khi đóng chat
  return () => clearInterval(interval);
}, [open]);



  /* SEND */
 const handleSend = async () => {
  if (!text.trim()) return;

  const tempText = text;

  setMessages((prev) => [
    ...prev,
    { message: tempText, sender_type: "user" },
  ]);
  setText("");

  await axiosInstance.post("/chat/send", { message: tempText });

  // load lại để đồng bộ với server
  loadMessages();
};


  return (
    <>
      {/* FLOAT BUTTON */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#a8765a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            zIndex: 999,
          }}
        >
          <MessageOutlined style={{ color: "#fff", fontSize: 22 }} />
        </div>
      )}

      {/* CHAT BOX */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 320,
            height: 450,
            background: "#a8765a",
            borderRadius: 16,
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "10px 12px",
              background: "#a8765a",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CustomerServiceOutlined />
              <Text style={{ color: "#fff", fontSize: 14 }}>
                Admin
              </Text>
            </div>
            <CloseOutlined
              onClick={() => setOpen(false)}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: 8,
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            <List
              dataSource={messages}
              renderItem={(item) => {
                const isUser = item.sender_type === "user";

                return (
                  <List.Item
                    style={{
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      border: "none",
                      padding: "4px 0",
                    }}
                  >
                    {!isUser && (
                      <Avatar
                        size={22}
                        icon={<CustomerServiceOutlined />}
                        style={{ marginRight: 4 }}
                      />
                    )}

                    <div
                      style={{
                        background: isUser ? "#a8765a" : "#fff",
                        color: isUser ? "#fff" : "#333",
                        padding: "6px 10px",
                        borderRadius: 14,
                        maxWidth: "72%",
                        fontSize: 12,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                      }}
                    >
                      {item.message}
                    </div>

                    {isUser && isLoggedIn && (
                      <Avatar
                        size={22}
                        icon={<UserOutlined />}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </List.Item>
                );
              }}
            />
            <div ref={messageEndRef} />
          </div>

          {/* INPUT */}
          <div
            style={{
              padding: 6,
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 4,
            }}
          >
            <Input
              size="small"
              placeholder="Nhập tin nhắn..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPressEnter={handleSend}
            />
            <Button
            style={{
                 background: "#a8765a",
            }}
              size="small"
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
            />
          </div>
        </div>
      )}
    </>
  );
};
