import React from "react";
import { useTable } from "@refinedev/antd";
import { Row, Col, Typography, Spin, Alert, Pagination, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { formatPrice, Room } from "../../../../interfaces/rooms";
import "./ClientRooms.css";
import "../../../assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, tableQueryResult, setCurrent } = useTable<Room>({
    resource: "rooms",
    pagination: { pageSize: 100, mode: "server" },
    sorters: { initial: [{ field: "room_type.name", order: "asc" }] },
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

  // === PHÂN LOẠI PHÒNG ===
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
      {/* HERO BANNER */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      {/* PREMIER & DELUXE SECTION */}
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
              {/* === TIÊU ĐỀ CHUNG === */}
              <div className="premier-deluxe-header">
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-left.svg"
                  alt="star"
                  className="star-icon"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
                <Title level={1} className="premier-deluxe-title">
                  Premier & Deluxe
                </Title>
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-right.svg"
                  alt="star"
                  className="star-icon"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              </div>

              {/* === PREMIER ROOMS (2 cột) === */}
              {premierRooms.length > 0 && (
                <Row gutter={[32, 32]} className="room-category-grid">
                  {premierRooms.map((room) => {
                    const roomName =
                      room.room_type?.name || `Room ${room.room_number}`;
                    return (
                      <Col xs={24} md={12} key={room.id}>
                        <div
                          className="room-item fade-in"
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
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop")
                              }
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

              {/* === DELUXE ROOMS (2 cột) === */}
              {deluxeRooms.length > 0 && (
                <Row gutter={[32, 32]} className="room-category-grid">
                  {deluxeRooms.map((room) => {
                    const roomName =
                      room.room_type?.name || `Room ${room.room_number}`;
                    return (
                      <Col xs={24} md={12} key={room.id}>
                        <div
                          className="room-item fade-in"
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
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop")
                              }
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

              {/* === PAGINATION (nếu cần) === */}
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
