import React from "react";
import { useTable } from "@refinedev/core";
import { Row, Col, Typography, Spin, Alert, Button, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { RoomType } from "../../../../interfaces/roomTypes"; // interface mới
import "./ClientRooms.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  // --- useTable lấy dữ liệu roomtypes ---
  const { tableQueryResult, setCurrent } = useTable<RoomType>({
    resource: "roomtypes",
    pagination: { pageSize: 10, mode: "server" },
    sorters: { initial: [{ field: "room_type_name", order: "asc" }] },
    parseResponse: (response: any) => ({
      data: response.data,
      total: response.total,
    }),
  });

  const roomTypes = tableQueryResult?.data || [];
  const total = tableQueryResult?.total || 0;
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
            <>
              <Row gutter={[32, 32]} className="room-category-grid">
                {roomTypes.map((roomType) => {
                  const mainImage =
                    roomType.images?.find((img) => img.image_type === "main")
                      ?.image_url ||
                    roomType.room_type_image ||
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
                            alt={roomType.room_type_name}
                            className="room-thumbnail"
                            onError={(e) =>
                              ((e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop")
                            }
                          />
                        </div>
                        <div className="room-content">
                          <Title level={4} className="room-name">
                            {roomType.room_type_name.toUpperCase()}
                          </Title>
                          <Paragraph className="room-desc">
                            {roomType.description ||
                              "Phòng được trang bị đầy đủ tiện nghi, nội thất sang trọng và hiện đại."}
                          </Paragraph>
                          <Text strong style={{ fontSize: 16 }}>
                            Giá từ:{" "}
                            {Number(roomType.base_price).toLocaleString()} VND
                          </Text>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {/* PAGINATION */}
              {total > 10 && (
                <div
                  className="pagination-container luxury-pagination"
                  style={{ marginTop: 32, textAlign: "center" }}
                >
                  <Pagination
                    current={tableQueryResult?.current || 1}
                    pageSize={10}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
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
