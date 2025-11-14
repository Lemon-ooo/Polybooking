import React, { useState } from "react";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  assets,
  facilityIcons,
  roomsDummyData,
} from "../../../../assets/assets";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>({});

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
        style={{
          width: 280,
          flexShrink: 0,
          borderRadius: 8,
        }}
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
          {/* Room Type */}
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

          {/* Price Range */}
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

          {/* Sort By */}
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
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {roomsDummyData.map((room) => (
            <Col xs={24} key={room._id}>
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
                      src={room.images[0]}
                      alt="room"
                      onClick={() => {
                        navigate(`/client/rooms/${room._id}`);
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
                      <Text type="secondary">{room.hotel.city}</Text>
                      <Title
                        level={4}
                        style={{ margin: 0, cursor: "pointer" }}
                        onClick={() => {
                          navigate(`/client/rooms/${room._id}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {room.hotel.name}
                      </Title>

                      <Space size={8}>
                        <Text type="secondary">⭐ 4.5 • 200+ reviews</Text>
                      </Space>

                      <Space size={8}>
                        <img
                          src={assets.locationIcon}
                          alt="location"
                          style={{ width: 16, height: 16 }}
                        />
                        <Text type="secondary">{room.hotel.address}</Text>
                      </Space>

                      <div>
                        {room.amenities.map((item: string, idx: number) => (
                          <Tag
                            key={idx}
                            icon={
                              <img
                                src={facilityIcons[item]}
                                alt={item}
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
                            {item}
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
                          ${room.pricePerNight} /night
                        </Text>
                        <Button
                          onClick={() => {
                            navigate(`/client/rooms/${room._id}`);
                            window.scrollTo(0, 0);
                          }}
                          style={{
                            borderColor: "#d1d5db",
                            color: "#374151",
                          }}
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
      </div>
    </div>
  );
};
