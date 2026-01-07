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
  const lastMessageIdRef = useRef<number | null>(null);

  /* =====================
     AUTO SCROLL CHỈ KHI CÓ TIN MỚI
  ====================== */
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const lastId = lastMsg.id ?? null;

    if (lastId !== lastMessageIdRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      lastMessageIdRef.current = lastId;
    }
  }, [messages]);

  return (
    <div
      style={{
        height: 450,
        overflowY: "auto",
        marginBottom: 12,
        paddingRight: 8,
      }}
    >
      {messages.map((msg, index) => (
        <div
          key={msg.id ?? index}
          style={{
            textAlign: msg.sender_type === "admin" ? "right" : "left",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 12,
              background: msg.sender_type === "admin" ? "#1677ff" : "#f5f5f5",
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
