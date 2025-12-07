import React from "react";
import { useTable } from "@refinedev/antd";
import { Row, Col, Typography, Spin, Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { RoomType } from "../../../../interfaces/roomTypes";
import "./ClientRooms.css";

const { Title, Text } = Typography;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, tableQueryResult } = useTable<RoomType>({
    resource: "room-types",
  });

  const rooms = tableProps?.dataSource || [];
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const API_URL = "http://localhost:8000/storage/";

  const getImage = (path: string | null) =>
    path ? `${API_URL}${path}` : "https://ruedelamourhotel.com/wp-content/uploads/2025/05/QTX09567-copy-scaled.jpg";

  const handleViewDetails = (id: number) => {
    navigate(`/client/rooms/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối"}
          type="error"
          showIcon
          action={<Button onClick={() => tableQueryResult?.refetch()}>Thử lại</Button>}
        />
      </div>
    );
  }

  return (
    <div className="client-rooms-container">
      {/* ================== HERO BANNER – GIỐNG HỆT SERVICES ================== */}
      <div className="rooms-hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      {/* ================== DANH SÁCH PHÒNG ================== */}
      <section className="rooms-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
              Accommodations
            </Title>
            <p>Luxurious and sophisticated effects in every resort space</p>
          </div>

          {isLoading ? (
            <div className="loading">
              <Spin size="large" />
              <Text style={{ marginTop: 20, display: "block" }}>Đang tải loại phòng...</Text>
            </div>
          ) : rooms.length === 0 ? (
            <div className="empty">
              <Text type="secondary">Chưa có loại phòng nào</Text>
            </div>
          ) : (
           <Row gutter={[32, 80]} justify="center">
  {rooms.map((room) => (
    <Col xs={24} lg={12} key={room.room_type_id}>
      <div className="room-item" onClick={() => handleViewDetails(room.room_type_id)}>
        <div className="room-item-image">
          <img
            src={getImage(room.room_type_image)}
            alt={room.room_type_name}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80";
            }}
          />
        </div>

        <div className="room-item-content">
          <h3 className="room-item-title">{room.room_type_name}</h3>
          <p className="room-item-desc">
            {room.description || "Phòng nghỉ sang trọng với thiết kế tinh tế và tiện nghi cao cấp."}
          </p>

          <div className="room-features">
            <div className="room-feature-item">
              <svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"/></svg>
              <span>Room Size: {room.size || 36} sqm</span>
            </div>
            <div className="room-feature-item">
              <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm2-13c0 .28-.21.52-.5.5A5.98 5.98 0 0 0 7 12c0 2.76 2.24 5 5 5 .28 0 .5-.22.5-.5s-.22-.5-.5-.5c-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4 .28 0 .5.22.5.5s-.22.5-.5.5z"/></svg>
              <span>City View</span>
            </div>
            <div className="room-feature-item">
              <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 12h4v5h6v-5h4l-7-7-7 7zm5-10v4h4V2z"/></svg>
              <span>1 King-size bed</span>
            </div>
            <div className="room-feature-item">
              <svg fill="currentColor" viewBox="0 0 20 20"><path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9.5 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
              <span>Bathtub & standing shower</span>
            </div>
          </div>

          <div className="room-item-footer">
            {room.price_per_night && (
              <div className="room-price">
                {Number(room.price_per_night).toLocaleString("vi-VN")}₫ / đêm
              </div>
            )}
            <button className="room-details-btn">Room Details</button>
          </div>
        </div>
      </div>
    </Col>
  ))}
</Row>
          )}
        </div>
      </section>
    </div>
  );
};