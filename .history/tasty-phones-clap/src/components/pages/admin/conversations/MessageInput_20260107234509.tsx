import React, { useState } from "react";
import { Input, Button } from "antd";

interface Props {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const message = text.trim();
    if (!message || sending) return;

    try {
      setSending(true);
      onSend(message);
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <Input.TextArea
        value={text}
        rows={2}
        placeholder="Nhập tin nhắn..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <Button
        type="primary"
        onClick={handleSend}
        disabled={!text.trim() || sending}
        loading={sending}
      >
        Gửi
      </Button>
    </div>
  );
};

export default MessageInput;
