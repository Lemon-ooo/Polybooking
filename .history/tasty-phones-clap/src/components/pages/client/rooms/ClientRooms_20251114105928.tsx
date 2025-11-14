// src/components/pages/client/rooms/ClientRooms.tsx
import React from "react";
import { Row, Col, Card, Typography, Button, Space, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  BedOutlined,
  ShowerOutlined,
  RulerOutlined,
} from "@ant-design/icons"; // ĐÃ SỬA
import "./ClientRooms.css";

const { Title, Paragraph, Text } = Typography;

interface RoomData {
  id: number;
  name: string;
  title: string;
  description: string;
  size: string;
  view: string;
  bed: string;
  bathroom: string;
  image1: string;
  image2: string;
}

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  const rooms: RoomData[] = [
    // ... (giữ nguyên data)
  ];

  const handleViewDetails = (id: number) => {
    navigate(`/client/rooms/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="rue-client-rooms">
      {/* BANNER */}
      <div className="rue-hero-banner">
        <div className="rue-hero-content">
          <Title level={1} className="rue-page-title">
            Suite Room
          </Title>
        </div>
      </div>

      {/* ROOMS LIST */}
      <div className="rue-rooms-container">
        <div className="container">
          <Row gutter={[48, 64]} justify="center">
            {rooms.map((room) => (
              <Col xs={24} md={12} key={room.id}>
                <Card className="rue-room-card" bordered={false} hoverable>
                  <Row gutter={[24, 24]}>
                    <Col span={12}>
                      <img
                        src={room.image1}
                        alt={room.name}
                        className="rue-room-img"
                      />
                    </Col>
                    <Col span={12}>
                      <img
                        src={room.image2}
                        alt={room.name}
                        className="rue-room-img"
                      />
                    </Col>
                  </Row>

                  <Divider
                    style={{ margin: "24px 0", borderColor: "#e8e8e8" }}
                  />

                  <div className="rue-room-content">
                    <Title level={4} className="rue-room-name">
                      {room.name}
                    </Title>
                    <Paragraph className="rue-room-desc">
                      {room.description}
                    </Paragraph>

                    <Space
                      direction="vertical"
                      size={8}
                      className="rue-room-features"
                    >
                      <Space>
                        <RulerOutlined />
                        <Text>Room Size: {room.size}</Text>
                      </Space>
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{room.view}</Text>
                      </Space>
                      <Space>
                        <BedOutlined />
                        <Text>{room.bed}</Text>
                      </Space>
                      <Space>
                        <ShowerOutlined /> {/* ĐÃ SỬA */}
                        <Text>{room.bathroom}</Text>
                      </Space>
                    </Space>

                    <Button
                      type="link"
                      className="rue-details-btn"
                      onClick={() => handleViewDetails(room.id)}
                      block
                    >
                      ROOM DETAILS
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CONNECTING ROOMS */}
          <div className="rue-connecting">
            <Title level={3} className="rue-connecting-title">
              Connecting rooms
            </Title>
            <Paragraph className="rue-connecting-desc">
              Một lựa chọn tuyệt vời cho kỳ nghỉ gia đình của bạn. Vui lòng liên
              hệ với chúng tôi qua đường dây nóng{" "}
              <Text strong>(+84) 24 5555 5599</Text> hoặc email:{" "}
              <Text strong>sales@ruedelamourhotel.com</Text>
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};
