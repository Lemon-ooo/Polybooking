import React, { useEffect, useRef } from "react";

interface Message {
  id?: number;
  message: string;
  sender_type: "user" | "admin";
}

interface Props {
  messages: Message[];
}

const ChatWindow: React.FC<Props> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ Auto scroll khi có tin mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ height: 450, overflowY: "auto", marginBottom: 12 }}>
      {messages.map((msg, index) => (
        <div
          key={msg.id ?? index} // ✅ tránh crash nếu id null
          style={{
            textAlign: msg.sender_type === "admin" ? "right" : "left",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 8,
              background:
                msg.sender_type === "admin" ? "#1677ff" : "#f0f0f0",
              color: msg.sender_type === "admin" ? "#fff" : "#000",
              maxWidth: "75%",
              wordBreak: "break-word",
            }}
          >
            {msg.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
