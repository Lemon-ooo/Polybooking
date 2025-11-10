import React from "react";
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
  Empty,
} from "antd";
import { useNavigate } from "react-router-dom";
import { assets, facilityIcons } from "../../../../assets/assets";
import { useTable } from "@refinedev/core";
import { Room } from "../../../../interfaces/rooms";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Dùng refine hook useTable để lấy danh sách phòng
  const {
    tableQueryResult,
    setFilters,
    setSorters,
    current,
    setCurrent,
    pageCount,
  } = useTable<Room>({
    resource: "rooms",
    pagination: {
      pageSize: 10,
    },
  });

  const data = tableQueryResult?.data;
  const isLoading = tableQueryResult?.isLoading;
  const rooms = data?.data ?? [];

  const [selectedFilters, setSelectedFilters] = React.useState<any>({});

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

  // 🔹 Xử lý lọc theo loại phòng
  const handleCheckboxChange = (
    type: string,
    value: string,
    checked: boolean
  ) => {
    setSelectedFilters((prev: any) => {
      const prevList = prev[type] || [];
      const updated = checked
        ? [...prevList, value]
        : prevList.filter((v: string) => v !== value);
      return { ...prev, [type]: updated };
    });
  };

  // 🔹 Xử lý sort
  const handleRadioChange = (type: string, value: string) => {
    setSelectedFilters((prev: any) => ({ ...prev, [type]: value }));

    if (type === "sort") {
      if (value === "Price: Low to High") {
        setSorters([{ field: "price", order: "asc" }]);
      } else if (value === "Price: High to Low") {
        setSorters([{ field: "price", order: "desc" }]);
      } else if (value === "Newest First") {
        setSorters([{ field: "created_at", order: "desc" }]);
      }
    }
  };

  // 🔹 Gọi filter API khi người dùng chọn loại phòng
  React.useEffect(() => {
    if (selectedFilters.roomType?.length) {
      setFilters([
        {
          field: "room_type.name",
          operator: "in",
          value: selectedFilters.roomType,
        },
      ]);
    } else {
      setFilters([]);
    }
  }, [selectedFilters.roomType]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "120px 64px",
        gap: "48px",
      }}
    >
      {/* FILTERS */}
      <Card
        title="Filters"
        bordered
        style={{ width: 280, flexShrink: 0, borderRadius: 8 }}
        extra={
          <a
            onClick={() => setSelectedFilters({})}
            style={{ fontSize: 12, color: "#6b7280" }}
          >
            Clear
          </a>
        }
      >
        <Collapse
          defaultActiveKey={["1", "2", "3"]}
          ghost
          expandIconPosition="end"
        >
          <Panel header="Room Type" key="1">
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

          <Panel header="Price Range" key="2">
            <Space direction="vertical">
              {priceRanges.map((range) => (
                <Checkbox
                  key={range}
                  checked={selectedFilters.priceRange?.includes(range)}
                  onChange={(e) =>
                    handleCheckboxChange("priceRange", range, e.target.checked)
                  }
                >
                  ${range}
                </Checkbox>
              ))}
            </Space>
          </Panel>

          <Panel header="Sort By" key="3">
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
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Homestay Rooms
          </Title>
          <Paragraph style={{ color: "#6b7280", maxWidth: 600 }}>
            Take advantage of our limited-time offers and special packages.
          </Paragraph>
        </div>

        {isLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
          >
            <Spin size="large" />
          </div>
        ) : rooms.length === 0 ? (
          <Empty description="No rooms available" />
        ) : (
          <Row gutter={[24, 24]}>
            {rooms.map((room: any) => (
              <Col xs={24} key={room.room_id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0px 4px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={10}>
                      <img
                        src={room.room_type?.image_url || assets.defaultRoom}
                        alt="room"
                        onClick={() => {
                          navigate(`/client/rooms/${room.room_id}`);
                          window.scrollTo(0, 0);
                        }}
                        style={{
                          width: "100%",
                          height: 220,
                          objectFit: "cover",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                      />
                    </Col>

                    <Col xs={24} md={14}>
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        <Title
                          level={4}
                          style={{ margin: 0, cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/client/rooms/${room.room_id}`)
                          }
                        >
                          {room.room_type?.name}
                        </Title>

                        <Text type="secondary">{room.description}</Text>

                        <div>
                          {room.amenities?.map((item: any) => (
                            <Tag
                              key={item.amenity_id}
                              icon={
                                <img
                                  src={
                                    item.icon_url || facilityIcons[item.name]
                                  }
                                  alt={item.name}
                                  style={{ width: 16, height: 16 }}
                                />
                              }
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #e5e7eb",
                                color: "#374151",
                                marginBottom: 8,
                              }}
                            >
                              {item.name}
                            </Tag>
                          ))}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 16,
                          }}
                        >
                          <Text strong style={{ fontSize: 18 }}>
                            {parseFloat(room.price).toLocaleString("vi-VN")} VND
                            /night
                          </Text>
                          <Button
                            onClick={() =>
                              navigate(`/client/rooms/${room.room_id}`)
                            }
                            style={{ borderColor: "#d1d5db", color: "#374151" }}
                          >
                            View Details
                          </Button>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
