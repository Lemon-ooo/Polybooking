// src/components/pages/client/rooms/ClientRooms.tsx
import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Spin,
  Alert,
  Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import { formatPrice, Room } from "../../../../interfaces/rooms";
import "./ClientRooms.css";

const { Title, Text, Paragraph } = Typography;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, tableQueryResult, setCurrent } = useTable<Room>({
    resource: "rooms",
    pagination: {
      pageSize: 100, // Lấy hết để nhóm
      mode: "server",
    },
    sorters: {
      initial: [
        {
          field: "room_type.name",
          order: "asc",
        },
      ],
    },
  });

  const rooms = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 100;
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const handleViewDetails = (roomId: number) => {
    navigate(`/client/rooms/${roomId}`);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (page: number) => {
    setCurrent?.(page);
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

  // Lọc và nhóm phòng
  const premierRooms = rooms.filter((r) =>
    (r.room_type?.name || "").toLowerCase().includes("premier")
  );
  const deluxeRooms = rooms.filter(
    (r) =>
      (r.room_type?.name || "").toLowerCase().includes("deluxe") &&
      !(r.room_type?.name || "").toLowerCase().includes("premier")
  );

  const hasPremierOrDeluxe = premierRooms.length > 0 || deluxeRooms.length > 0;

  return (
    <div className="client-rooms-container">
      {/* Hero Banner */}
      <div className="rooms-hero-banner">
        <div
          className="hero-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://ruedelamourhotel.com/wp-content/uploads/2025/05/QTX09567-copy-scaled.jpg')`,
          }}
        />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      {/* Premier & Deluxe Section - Giống hệt web */}
      <div className="rooms-grid-section luxury-rooms">
        <div className="container">
          {isLoading ? (
            <div className="loading-container luxury-loading">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Loading luxury accommodations...
              </Text>
            </div>
          ) : !hasPremierOrDeluxe ? (
            <div className="empty-state luxury-empty">
              <Text type="secondary" style={{ fontSize: 16 }}>
                No rooms found.
              </Text>
            </div>
          ) : (
            <>
              {/* Tiêu đề Premier & Deluxe */}
              <div className="premier-deluxe-header">
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-left.svg"
                  alt="star"
                  className="star-icon"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <Title level={1} className="premier-deluxe-title">
                  Premier & Deluxe
                </Title>
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-right.svg"
                  alt="star"
                  className="star-icon"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>

              {/* Premier Rooms - 2 cột */}
              {premierRooms.length > 0 && (
                <Row gutter={[32, 32]} className="room-category-grid">
                  {premierRooms.map((room) => {
                    const roomName =
                      room.room_type?.name || `Room ${room.room_number}`;
                    return (
                      <Col xs={24} md={12} key={room.id}>
                        <div
                          className="room-item"
                          onClick={() => handleViewDetails(room.id)}
                        >
                          <div className="room-image-wrapper">
                            <img
                              src={
                                room.room_type?.image_url ||
                                room.image_url ||
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
                              }
                              alt={roomName}
                              className="room-thumbnail"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";
                              }}
                            />
                          </div>
                          <div className="room-content">
                            <Title level={4} className="room-name">
                              {roomName.toUpperCase()}
                            </Title>
                            <Paragraph className="room-desc">
                              {room.description ||
                                room.room_type?.description ||
                                "Phòng có cửa sổ nhìn ra thành phố. Nội thất theo phong cách Đông Dương, thiết kế độc lập, tinh tế đến từng chi tiết."}
                            </Paragraph>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              )}

              {/* Deluxe Rooms - 2 cột */}
              {deluxeRooms.length > 0 && (
                <Row gutter={[32, 32]} className="room-category-grid">
                  {deluxeRooms.map((room) => {
                    const roomName =
                      room.room_type?.name || `Room ${room.room_number}`;
                    return (
                      <Col xs={24} md={12} key={room.id}>
                        <div
                          className="room-item"
                          onClick={() => handleViewDetails(room.id)}
                        >
                          <div className="room-image-wrapper">
                            <img
                              src={
                                room.room_type?.image_url ||
                                room.image_url ||
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
                              }
                              alt={roomName}
                              className="room-thumbnail"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";
                              }}
                            />
                          </div>
                          <div className="room-content">
                            <Title level={4} className="room-name">
                              {roomName.toUpperCase()}
                            </Title>
                            <Paragraph className="room-desc">
                              {room.description ||
                                room.room_type?.description ||
                                "Phòng ấm cúng, đầy đủ tiện nghi, thích hợp cho chuyến đi công tác hoặc kỳ nghỉ yên bình tại thủ đô nhộn nhịp."}
                            </Paragraph>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              )}

              {/* Pagination nếu cần (ít dùng ở đây) */}
              {total > pageSize && (
                <div className="pagination-container luxury-pagination">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={handlePageChange}
                    showTotal={(total, range) =>
                      `Showing ${range[0]}-${range[1]} of ${total} rooms`
                    }
                    size="small"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
