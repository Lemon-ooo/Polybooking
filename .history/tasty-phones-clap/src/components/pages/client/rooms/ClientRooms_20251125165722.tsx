import React from "react";
import { useTable } from "@refinedev/core";
import { Row, Col, Typography, Spin, Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { RoomType } from "../../../../interfaces/roomTypes"; // interface mới
import "./ClientRooms.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  // Lấy room types thay vì rooms
  const { tableQueryResult, setCurrent } = useTable<RoomType>({
    resource: "roomtypes",
    pagination: { pageSize: 100, mode: "server" },
    sorters: { initial: [{ field: "name", order: "asc" }] },
  });

  const roomTypes = tableQueryResult?.data?.data || [];
  const total = tableQueryResult?.data?.total || 0;
  const currentPage = tableQueryResult?.data?.current_page || 1;
  const pageSize = tableQueryResult?.data?.per_page || 100;
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const handleViewDetails = (roomTypeId: number) => {
    navigate(`/client/rooms/${roomTypeId}`);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (page: number) => setCurrent?.(page);

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
      {/* HERO BANNER */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="rooms-grid-section luxury-rooms">
        <div className="container">
          {isLoading ? (
            <div className="loading-container luxury-loading">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Loading luxury accommodations...
              </Text>
            </div>
          ) : roomTypes.length === 0 ? (
            <div className="empty-state luxury-empty">
              <Text type="secondary" style={{ fontSize: 16 }}>
                No room types found.
              </Text>
            </div>
          ) : (
            <Row gutter={[32, 32]} className="room-category-grid">
              {roomTypes.map((roomType) => {
                // Lấy ảnh chính (main) hoặc fallback
                const mainImage =
                  roomType.images?.find((img) => img.image_type === "main")
                    ?.image_url ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";

                return (
                  <Col xs={24} md={12} key={roomType.room_type_id}>
                    <div
                      className="room-item fade-in"
                      onClick={() => handleViewDetails(roomType.room_type_id)}
                    >
                      <div className="room-image-wrapper">
                        <img
                          src={mainImage}
                          alt={roomType.name}
                          className="room-thumbnail"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop")
                          }
                        />
                      </div>
                      <div className="room-content">
                        <Title level={4} className="room-name">
                          {roomType.name.toUpperCase()}
                        </Title>
                        <Paragraph className="room-desc">
                          {roomType.description ||
                            "Phòng được trang bị đầy đủ tiện nghi, nội thất sang trọng và hiện đại."}
                        </Paragraph>
                        <Text strong style={{ fontSize: 16 }}>
                          Giá từ: {roomType.base_price?.toLocaleString()} VND
                        </Text>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}

          {/* PAGINATION */}
          {total > pageSize && (
            <div className="pagination-container luxury-pagination">
              <Spin spinning={isLoading} />
              {/* nếu dùng pagination của Antd, bạn có thể map page change */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
