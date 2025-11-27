import React from "react";
import { useTable } from "@refinedev/antd";
import { Row, Col, Typography, Spin, Alert, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { RoomType } from "../../../../interfaces/roomTypes";
import "./ClientRooms.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, tableQueryResult } = useTable<RoomType>({
    resource: "room-types",
  });

  const rooms = tableProps?.dataSource || [];
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;
  const API_URL = "http://localhost:8000/storage/"; // hoặc URL server của bạn

  const getRoomTypeImage = (roomType: RoomType) =>
    roomType.room_type_image
      ? `${API_URL}${roomType.room_type_image}`
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";

  const handleViewDetails = (roomTypeId: number) => {
    navigate(`/client/room-types/${roomTypeId}`);
    window.scrollTo(0, 0);
  };

  if (isError) {
    return (
      <div style={{ padding: "80px 20px" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối đến server."}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => tableQueryResult?.refetch()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="client-rooms-container">
      {/* ================== HERO BANNER ================== */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      {/* ================== ROOM CARDS ================== */}
      <section
        className="featured-rooms-section"
        style={{ padding: "40px 64px" }}
      >
        <div className="container">
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontFamily: "'Playfair Display', serif",
              fontSize: 42,
              color: "#000",
            }}
          >
            Accommodations
          </Title>

          <Paragraph
            style={{
              textAlign: "center",
              marginBottom: 40,
              color: "#000",
              fontSize: 16,
            }}
          >
            Luxurious and sophisticated effects in every resort space
          </Paragraph>

          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Loading room types...
              </Text>
            </div>
          ) : rooms.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                No room types available.
              </Text>
            </div>
          ) : (
            <Row gutter={[32, 32]} justify="center">
  {rooms.map((roomType) => (
    <Col xs={24} sm={12} md={8} lg={6} key={roomType.room_type_id}>
      <Card
        bodyStyle={{ padding: 0 }}
        hoverable
        style={{
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          cursor: "pointer", // Thêm icon chuột
        }}
        onClick={() => handleViewDetails(roomType.room_type_id)} // Click card
      >
        <div style={{ width: "100%", height: 220, overflow: "hidden" }}>
          <img
            src={getRoomTypeImage(roomType)}
            alt={roomType.room_type_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) =>
              ((e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop")
            }
          />
        </div>

        <div style={{ padding: "20px" }}>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#8a6e5b",
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            {roomType.room_type_name}
          </h3>
          <p
            style={{
              color: "#444",
              fontSize: 14,
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {roomType.description || "A luxurious room with elegant design."}
          </p>
          <div style={{ textAlign: "right" }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#8a6e5b",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              ROOM DETAILS
            </button>
          </div>
        </div>
      </Card>
    </Col>
  ))}
</Row>

          )}
        </div>
      </section>
    </div>
  );
};
