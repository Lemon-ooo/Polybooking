import React, { useState } from "react";
import { Input, Button } from "antd";

interface Props {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    const message = text.trim();
    if (!message) return;

    onSend(message);
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={handleSend}
        placeholder="Nhập tin nhắn..."
      />

      <Button
        type="primary"
        onClick={handleSend}
        disabled={!text.trim()}
      >
        Gửi
      </Button>
    </div>
  );
};

export default MessageInput;
