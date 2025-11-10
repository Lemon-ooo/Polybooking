// src/components/pages/client/rooms/ClientRooms.tsx
import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Spin,
  Alert,
  Pagination,
  Select,
  Input,
  DatePicker,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  StarFilled,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
  Room,
} from "../../../../interfaces/rooms";
import "./ClientRooms.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: "",
    sortBy: "featured",
  });

  const { tableProps, tableQueryResult, setCurrent } = useTable<Room>({
    resource: "rooms",
    pagination: {
      pageSize: 6,
      mode: "server", // Thêm mode server để pagination hoạt động
    },
  });

  // Lấy dữ liệu phòng - FIX: Sử dụng đúng cấu trúc từ tableProps
  const rooms = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 6;
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  // Debug dữ liệu
  console.log("=== PAGINATION DEBUG ===");
  console.log("tableProps:", tableProps);
  console.log("rooms:", rooms);
  console.log("total:", total);
  console.log("currentPage:", currentPage);

  // Dữ liệu mẫu cho filter
  const roomTypes = [
    { value: "", label: "Tất cả loại phòng" },
    { value: "single", label: "Phòng Đơn" },
    { value: "double", label: "Phòng Đôi" },
    { value: "suite", label: "Suite" },
    { value: "deluxe", label: "Deluxe" },
  ];

  const sortOptions = [
    { value: "featured", label: "Nổi bật" },
    { value: "price_low", label: "Giá: Thấp đến cao" },
    { value: "price_high", label: "Giá: Cao đến thấp" },
    { value: "name", label: "Theo tên" },
  ];

  const handleViewDetails = (roomId: number) => {
    navigate(`/client/rooms/${roomId}`);
    window.scrollTo(0, 0);
  };

  const handleBookNow = (roomId: number) => {
    navigate(`/client/booking/${roomId}`);
  };

  const handlePageChange = (page: number) => {
    console.log("Changing to page:", page);
    setCurrent?.(page);
  };

  // Hiển thị lỗi
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
      {/* Hero Banner */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <Title level={1} className="hero-title">
              Phòng Nghỉ & Suite
            </Title>
            <Paragraph className="hero-subtitle">
              Khám phá các phòng nghỉ sang trọng với đầy đủ tiện nghi cao cấp
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="container">
          <Card className="search-filter-card">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={6}>
                <div className="filter-group">
                  <Text strong>Ngày nhận phòng</Text>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày"
                    size="large"
                  />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div className="filter-group">
                  <Text strong>Ngày trả phòng</Text>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày"
                    size="large"
                  />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div className="filter-group">
                  <Text strong>Loại phòng</Text>
                  <Select
                    value={selectedFilters.roomType}
                    onChange={(value) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        roomType: value,
                      }))
                    }
                    style={{ width: "100%" }}
                    size="large"
                  >
                    {roomTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div className="filter-group">
                  <Text strong>Sắp xếp</Text>
                  <Select
                    value={selectedFilters.sortBy}
                    onChange={(value) =>
                      setSelectedFilters((prev) => ({ ...prev, sortBy: value }))
                    }
                    style={{ width: "100%" }}
                    size="large"
                  >
                    {sortOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <Divider />
            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                size="large"
                icon={<SearchOutlined />}
                style={{ minWidth: 200 }}
              >
                Tìm Phòng
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="rooms-grid-section">
        <div className="container">
          {isLoading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Đang tải danh sách phòng...
              </Text>
            </div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <Text type="secondary" style={{ fontSize: 16 }}>
                Không tìm thấy phòng nào phù hợp.
              </Text>
            </div>
          ) : (
            <>
              <Row gutter={[32, 32]}>
                {rooms.map((room) => (
                  <Col xs={24} lg={12} key={room.id}>
                    <Card
                      className="room-card"
                      bodyStyle={{ padding: 0 }}
                      hoverable
                    >
                      <Row gutter={0}>
                        <Col xs={24} md={12}>
                          <div className="room-image-container">
                            <img
                              src={
                                room.room_type?.image_url ||
                                room.image_url ||
                                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop"
                              }
                              alt={
                                room.room_type?.name ||
                                `Phòng ${room.room_number}`
                              }
                              className="room-image"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop";
                              }}
                            />
                            <Tag
                              color={getRoomStatusColor(room.status)}
                              className="room-status-tag"
                            >
                              {getRoomStatusLabel(room.status)}
                            </Tag>
                            <div className="room-overlay">
                              <Button
                                type="primary"
                                className="view-details-btn"
                                onClick={() => handleViewDetails(room.id)}
                              >
                                Xem Chi Tiết
                              </Button>
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div className="room-info">
                            <div className="room-header">
                              <Title level={3} className="room-title">
                                {room.room_type?.name ||
                                  `Phòng ${room.room_number}`}
                              </Title>
                              <div className="room-rating">
                                <StarFilled style={{ color: "#ffc107" }} />
                                <Text strong>4.8</Text>
                                <Text type="secondary">(124 đánh giá)</Text>
                              </div>
                            </div>

                            <Paragraph className="room-description">
                              {room.description ||
                                room.room_type?.description ||
                                "Phòng nghỉ sang trọng với đầy đủ tiện nghi hiện đại..."}
                            </Paragraph>

                            <div className="room-features">
                              <div className="feature-item">
                                <WifiOutlined />
                                <Text>WiFi miễn phí</Text>
                              </div>
                              <div className="feature-item">
                                <CarOutlined />
                                <Text>Bãi đỗ xe</Text>
                              </div>
                              <div className="feature-item">
                                <CoffeeOutlined />
                                <Text>Bữa sáng</Text>
                              </div>
                              <div className="feature-item">
                                <EnvironmentOutlined />
                                <Text>Trung tâm thành phố</Text>
                              </div>
                            </div>

                            <div className="room-footer">
                              <div className="room-price">
                                <Text className="price-from">Từ</Text>
                                <Text className="price-amount">
                                  {formatPrice(room.price)}
                                </Text>
                                <Text className="price-unit">/đêm</Text>
                              </div>
                              <Button
                                type="primary"
                                size="large"
                                className="book-now-btn"
                                onClick={() => handleBookNow(room.id)}
                              >
                                Đặt Ngay
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination - FIXED */}
              {total > pageSize && (
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={handlePageChange}
                    showTotal={(total, range) =>
                      `Hiển thị ${range[0]}-${range[1]} của ${total} phòng`
                    }
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
