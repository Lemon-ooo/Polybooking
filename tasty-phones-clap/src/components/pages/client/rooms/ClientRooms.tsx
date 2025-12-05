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
            <Row gutter={[32, 32]} justify="center">
              {rooms.map((room) => (
                <Col xs={24} sm={12} md={8} lg={6} key={room.room_type_id}>
                  <div className="room-card-wrapper">
                    <div className="room-card" onClick={() => handleViewDetails(room.room_type_id)}>
                      <div className="room-image">
                        <img
                          src={getImage(room.room_type_image)}
                          alt={room.room_type_name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80";
                          }}
                        />
                      </div>

                      <div className="room-body">
                        <h3 className="room-name">{room.room_type_name}</h3>

                        <p className="room-desc">
                          {room.description || "Phòng nghỉ sang trọng với thiết kế tinh tế và tiện nghi cao cấp."}
                        </p>

                        {room.price_per_night && (
                          <div className="room-price">
                            {Number(room.price_per_night).toLocaleString("vi-VN")}₫ / đêm
                          </div>
                        )}

                        <div className="details-btn">
                          <button>Xem chi tiết →</button>
                        </div>
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