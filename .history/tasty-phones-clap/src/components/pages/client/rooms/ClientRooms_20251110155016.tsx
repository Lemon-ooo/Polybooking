// src/components/pages/client/rooms/ClientRooms.tsx
import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Checkbox,
  Radio,
  Collapse,
  Tag,
  Spin,
  Alert,
  Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
  Room,
} from "../../../../interfaces/rooms";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<any>({});

  const { tableProps, tableQueryResult, setCurrent } = useTable<Room>({
    resource: "rooms",
    pagination: { pageSize: 6 },
  });

  // Lấy dữ liệu phòng
  const rooms = tableProps?.dataSource || tableQueryResult?.data?.data || [];
  const total =
    tableProps?.pagination?.total || tableQueryResult?.data?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  // Dữ liệu filter (có thể lấy từ API hoặc hardcode)
  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 1500",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];

  const handleCheckboxChange = (
    type: string,
    value: string,
    checked: boolean
  ) => {
    setSelectedFilters((prev: any) => {
      const prevList = prev[type] || [];
      return {
        ...prev,
        [type]: checked
          ? [...prevList, value]
          : prevList.filter((v: string) => v !== value),
      };
    });
  };

  const handleRadioChange = (type: string, value: string) => {
    setSelectedFilters((prev: any) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleViewDetails = (roomId: number) => {
    navigate(`/client/rooms/${roomId}`);
    window.scrollTo(0, 0);
  };

  // Hiển thị lỗi
  if (isError) {
    return (
      <div style={{ padding: "120px 64px" }}>
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

  // Hiển thị loading
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          padding: "120px 64px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "120px 64px",
        gap: "48px",
        minHeight: "100vh",
      }}
    >
      {/* FILTERS SIDEBAR */}
      <Card
        title="Bộ lọc"
        bordered
        style={{
          width: 280,
          flexShrink: 0,
          borderRadius: 8,
          position: "sticky",
          top: 120,
        }}
        extra={
          <a
            onClick={() => setSelectedFilters({})}
            style={{ fontSize: 12, color: "#6b7280", cursor: "pointer" }}
          >
            Xóa hết
          </a>
        }
      >
        <Collapse
          defaultActiveKey={["1", "2", "3"]}
          ghost
          expandIconPosition="end"
        >
          {/* Loại phòng */}
          <Panel header="Loại phòng" key="1">
            <Space direction="vertical">
              {roomTypes.map((type) => (
                <Checkbox
                  key={type}
                  checked={selectedFilters.roomType?.includes(type)}
                  onChange={(e) =>
                    handleCheckboxChange("roomType", type, e.target.checked)
                  }
                >
                  {type}
                </Checkbox>
              ))}
            </Space>
          </Panel>

          {/* Khoảng giá */}
          <Panel header="Khoảng giá" key="2">
            <Space direction="vertical">
              {priceRanges.map((range) => (
                <Checkbox
                  key={range}
                  checked={selectedFilters.priceRange?.includes(range)}
                  onChange={(e) =>
                    handleCheckboxChange("priceRange", range, e.target.checked)
                  }
                >
                  {range.replace("to", "-")}K
                </Checkbox>
              ))}
            </Space>
          </Panel>

          {/* Sắp xếp */}
          <Panel header="Sắp xếp" key="3">
            <Radio.Group
              value={selectedFilters.sort}
              onChange={(e) => handleRadioChange("sort", e.target.value)}
            >
              <Space direction="vertical">
                {sortOptions.map((option) => (
                  <Radio key={option} value={option}>
                    {option}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Panel>
        </Collapse>
      </Card>

      {/* ROOMS LIST */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Danh sách phòng
          </Title>
          <Paragraph style={{ color: "#6b7280", maxWidth: 600 }}>
            Khám phá các phòng homestay của chúng tôi với đầy đủ tiện nghi và
            dịch vụ tốt nhất. Tận hưởng thời gian nghỉ ngơi thư giãn trong không
            gian thoải mái.
          </Paragraph>
        </div>

        {rooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Hiện chưa có phòng nào.
            </Text>
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {rooms.map((room: any) => (
                <Col xs={24} key={room.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0px 4px 4px rgba(0,0,0,0.05)",
                      border: "1px solid #f0f0f0",
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <Row gutter={[24, 24]} style={{ margin: 0 }}>
                      <Col xs={24} md={10} style={{ padding: 0 }}>
                        <img
                          src={
                            room.room_type?.image_url ||
                            room.image_url ||
                            "https://via.placeholder.com/400x250?text=No+Image"
                          }
                          alt={
                            room.room_type?.name || `Phòng ${room.room_number}`
                          }
                          onClick={() => handleViewDetails(room.id)}
                          style={{
                            width: "100%",
                            height: 220,
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/400x250?text=No+Image";
                          }}
                        />
                      </Col>

                      <Col xs={24} md={14} style={{ padding: "24px" }}>
                        <Space
                          direction="vertical"
                          size={12}
                          style={{ width: "100%" }}
                        >
                          <Tag
                            color={getRoomStatusColor(room.status)}
                            style={{ margin: 0, alignSelf: "flex-start" }}
                          >
                            {getRoomStatusLabel(room.status)}
                          </Tag>

                          <Text type="secondary">
                            {room.room_type?.category || "Phòng cao cấp"}
                          </Text>

                          <Title
                            level={4}
                            style={{ margin: 0, cursor: "pointer" }}
                            onClick={() => handleViewDetails(room.id)}
                          >
                            {room.room_type?.name ||
                              `Phòng ${room.room_number}`}
                          </Title>

                          <Space size={8}>
                            <Text type="secondary">⭐ 4.5 • 200+ đánh giá</Text>
                          </Space>

                          <Space size={8}>
                            <Text type="secondary">
                              {room.description ||
                                room.room_type?.description ||
                                "Không có mô tả"}
                            </Text>
                          </Space>

                          {/* Tiện nghi */}
                          {room.amenities && room.amenities.length > 0 && (
                            <div>
                              {room.amenities
                                .slice(0, 4)
                                .map((amenity: any, idx: number) => (
                                  <Tag
                                    key={idx}
                                    style={{
                                      background: "#f8fafc",
                                      border: "1px solid #e5e7eb",
                                      color: "#374151",
                                      marginBottom: 8,
                                    }}
                                  >
                                    {amenity.name || amenity}
                                  </Tag>
                                ))}
                              {room.amenities.length > 4 && (
                                <Tag style={{ marginBottom: 8 }}>
                                  +{room.amenities.length - 4} khác
                                </Tag>
                              )}
                            </div>
                          )}

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: 8,
                            }}
                          >
                            <Text
                              strong
                              style={{ fontSize: 18, color: "#1890ff" }}
                            >
                              {formatPrice(room.price)} / đêm
                            </Text>
                            <Button
                              type="primary"
                              onClick={() => handleViewDetails(room.id)}
                              style={{
                                borderRadius: 6,
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {total > 6 && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Pagination
                  current={currentPage}
                  pageSize={tableProps.pagination?.pageSize || 6}
                  total={total}
                  showSizeChanger={false}
                  onChange={(page) => setCurrent?.(page)}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} phòng`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
