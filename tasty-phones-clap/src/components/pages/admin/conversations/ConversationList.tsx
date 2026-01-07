import React from "react";
import { List, Avatar } from "antd";

interface Conversation {
  id: number;
  user_id: number;
  user?: {
    user_id: number;
    user_name: string;
    avatar?: string;
  };
}

interface Props {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
}

const ConversationList: React.FC<Props> = ({ conversations, onSelect }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={conversations}
      renderItem={(item) => {
        const userName = item.user?.user_name ?? `User #${item.user_id}`;

        const avatarUrl = item.user?.avatar
          ? `http://localhost:8000/storage/${item.user.avatar}`
          : undefined;

        return (
          <List.Item
            onClick={() => onSelect(item)}
            style={{ cursor: "pointer" }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    item.user?.avatar
                      ? `http://localhost:8000/storage/${item.user.avatar}`
                      : undefined
                  }
                >
                  {!item.user?.avatar && userName.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={userName}
              description={item.last_message}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ConversationList;
