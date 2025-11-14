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
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  StarFilled,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
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
      mode: "server",
    },
  });

  const rooms = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 6;
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  console.log("=== PAGINATION DEBUG ===");
  console.log("tableProps:", tableProps);
  console.log("rooms:", rooms);
  console.log("total:", total);
  console.log("currentPage:", currentPage);

  const roomTypes = [
    { value: "", label: "Tất cả loại phòng" },
    { value: "suite", label: "Suite" },
    { value: "premier", label: "Premier" },
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

      {/* Minimal Filter Section - Elegant */}
      <div className="search-filter-section luxury-filter">
        <div className="container">
          <Card className="search-filter-card luxury-card" bordered={false}>
            <Row gutter={[24, 24]} align="middle" justify="center">
              <Col xs={24} sm={8} md={6}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong className="filter-label">
                    Check-in
                  </Text>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select date"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={8} md={6}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong className="filter-label">
                    Check-out
                  </Text>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select date"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={8} md={6}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong className="filter-label">
                    Room Type
                  </Text>
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
                </Space>
              </Col>
              <Col xs={24} sm={8} md={6}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong className="filter-label">
                    Sort By
                  </Text>
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
                </Space>
              </Col>
            </Row>
            <Divider style={{ margin: "24px 0" }} />
            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                size="large"
                icon={<SearchOutlined />}
                style={{
                  minWidth: 200,
                  background: "#c9a96e",
                  borderColor: "#c9a96e",
                }}
              >
                Discover Rooms
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Rooms List - Sequential Elegant Cards */}
      <div className="rooms-grid-section luxury-rooms">
        <div className="container">
          {isLoading ? (
            <div className="loading-container luxury-loading">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Loading luxury accommodations...
              </Text>
            </div>
          ) : rooms.length === 0 ? (
            <div className="empty-state luxury-empty">
              <Text type="secondary" style={{ fontSize: 16 }}>
                No rooms found matching your criteria.
              </Text>
            </div>
          ) : (
            <>
              <Row gutter={[0, 48]} justify="center">
                {rooms.map((room, index) => (
                  <Col xs={24} key={room.id}>
                    <Card
                      className="room-card luxury-room-card"
                      hoverable
                      bordered={false}
                      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    >
                      <Row gutter={[32, 32]} align="top">
                        <Col xs={24} md={10}>
                          <div className="room-image-container luxury-image">
                            <img
                              src={
                                room.room_type?.image_url ||
                                room.image_url ||
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
                              }
                              alt={
                                room.room_type?.name ||
                                `Room ${room.room_number}`
                              }
                              className="room-image luxury-room-image"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";
                              }}
                            />
                          </div>
                        </Col>
                        <Col xs={24} md={14}>
                          <div className="room-info luxury-room-info">
                            <Title
                              level={2}
                              className="room-title luxury-title"
                            >
                              {room.room_type?.name ||
                                `Room ${room.room_number}`}
                            </Title>
                            <Paragraph className="room-description luxury-description">
                              {room.description ||
                                room.room_type?.description ||
                                "Indulge in modern luxury with timeless comfort."}
                            </Paragraph>

                            <div className="room-features luxury-features">
                              <Space
                                direction="vertical"
                                size={12}
                                style={{ width: "100%" }}
                              >
                                <Space size={16} wrap>
                                  <Text strong>Room Size:</Text>
                                  <Text>
                                    {room.room_type?.size || "28 sqm"}
                                  </Text>
                                </Space>
                                <Space size={16} wrap>
                                  <Text strong>View:</Text>
                                  <Text>City view</Text>
                                </Space>
                                <Space size={16} wrap>
                                  <Text strong>Bed:</Text>
                                  <Text>
                                    {room.room_type?.bed || "1 King‑size bed"}
                                  </Text>
                                </Space>
                                <Space size={16} wrap>
                                  <Text strong>Bathroom:</Text>
                                  <Text>
                                    A separate bathtub & a standing shower
                                  </Text>
                                </Space>
                              </Space>
                            </div>

                            <Divider
                              style={{
                                margin: "24px 0",
                                borderColor: "rgba(201,169,110,0.3)",
                              }}
                            />

                            <div className="room-footer luxury-footer">
                              <Space
                                split={
                                  <Divider
                                    type="vertical"
                                    style={{
                                      height: "30px",
                                      borderColor: "rgba(201,169,110,0.3)",
                                    }}
                                  />
                                }
                                align="center"
                              >
                                <div className="room-price luxury-price">
                                  <Text className="price-from luxury-price-from">
                                    From
                                  </Text>
                                  <Text className="price-amount luxury-price-amount">
                                    {formatPrice(room.price)}
                                  </Text>
                                  <Text className="price-unit luxury-price-unit">
                                    /night
                                  </Text>
                                </div>
                                <Space>
                                  <Button
                                    onClick={() => handleViewDetails(room.id)}
                                    className="view-details-btn luxury-btn"
                                    ghost
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    type="primary"
                                    size="large"
                                    className="book-now-btn luxury-book-btn"
                                    onClick={() => handleBookNow(room.id)}
                                    style={{
                                      background: "#c9a96e",
                                      borderColor: "#c9a96e",
                                    }}
                                  >
                                    Book Now
                                  </Button>
                                </Space>
                              </Space>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>

              {total > pageSize && (
                <div className="pagination-container luxury-pagination">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={handlePageChange}
                    showTotal={(total, range) =>
                      `Showing ${range[0]}‑${range[1]} of ${total} rooms`
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
