// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Space,
  Button,
  Tag,
  Row,
  Col,
  Card,
  Form,
  DatePicker,
  InputNumber,
  Spin,
  Alert,
} from "antd";
import {
  StarFilled,
  EnvironmentOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useTable } from "@refinedev/antd";
import {
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
  Room,
} from "../../../../interfaces/rooms";
import "./RoomDetail.css";

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

// Dữ liệu mẫu cho các icon và thông tin chung
const facilityIcons: { [key: string]: string } = {
  WiFi: "https://img.icons8.com/ios/50/wifi--v1.png",
  Parking: "https://img.icons8.com/ios/50/parking.png",
  Breakfast: "https://img.icons8.com/ios/50/breakfast.png",
  "Swimming Pool": "https://img.icons8.com/ios/50/swimming-pool.png",
  "Air Conditioning": "https://img.icons8.com/ios/50/air-conditioner.png",
  TV: "https://img.icons8.com/ios/50/tv.png",
  "Mini Bar": "https://img.icons8.com/ios/50/cocktail.png",
};

const roomCommonData = [
  {
    icon: "https://img.icons8.com/ios/50/check-in.png",
    title: "Check-in & Check-out",
    description: "Check-in from 2:00 PM, check-out by 12:00 PM",
  },
  {
    icon: "https://img.icons8.com/ios/50/cancel.png",
    title: "Cancellation Policy",
    description: "Free cancellation before 48 hours. 50% charge after that.",
  },
  {
    icon: "https://img.icons8.com/ios/50/no-smoking.png",
    title: "No Smoking",
    description: "This is a non-smoking property",
  },
  {
    icon: "https://img.icons8.com/ios/50/party.png",
    title: "No Parties",
    description: "Parties and events are not allowed",
  },
];

export const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState<string>("");
  const [form] = Form.useForm();

  // Sử dụng useTable để lấy dữ liệu
  const { tableProps, tableQueryResult } = useTable<Room>({
    resource: "rooms",
  });

  const { data, isLoading, isError } = tableQueryResult;

  // Tìm phòng theo ID
  const room = React.useMemo(() => {
    if (!data?.data) return null;

    let rooms: Room[] = [];
    if (Array.isArray(data.data)) {
      rooms = data.data;
    } else if (data.data && Array.isArray(data.data)) {
      rooms = data.data;
    }

    return rooms.find((room: Room) => room.id?.toString() === id);
  }, [data, id]);

  // Set ảnh chính khi có room
  useEffect(() => {
    if (room) {
      const firstImage =
        room.room_type?.image_url ||
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop";
      setMainImage(firstImage);
    }
  }, [room]);

  const onFinish = (values: any) => {
    console.log("Booking values:", values);
    if (room) {
      navigate(`/client/booking/${id}`, {
        state: {
          dates: values.dates,
          guests: values.guests,
          room: room,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "100px 64px", textAlign: "center" }}>
        <Spin size="large" />
        <Title level={3} style={{ marginTop: 16 }}>
          Loading...
        </Title>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div style={{ padding: "100px 64px" }}>
        <Alert
          message="Không tìm thấy phòng"
          description={`Không thể tìm thấy phòng với ID: ${id}. Vui lòng kiểm tra lại.`}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate("/client/rooms")}>
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  // Xử lý dữ liệu từ API
  const roomImages = [
    room.room_type?.image_url ||
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
  ];

  const roomAmenities = room.amenities?.map((amenity: any) => amenity.name) || [
    "WiFi",
    "Air Conditioning",
    "TV",
    "Mini Bar",
    "Parking",
  ];

  const roomName = room.room_type?.name || `Phòng ${room.room_number}`;
  const roomDescription =
    room.description ||
    room.room_type?.description ||
    "Customers will be allocated on the ground floor according to availability. You get a comfortable bedroom apartment has a true city feeling. The price quoted is for two customers, at the customers slot please mark the number of guests to get the exact price for groups.";

  return (
    <div className="room-detail-page">
      {/* Header Navigation */}
      <div className="detail-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/client/rooms")}
          className="back-button"
        >
          Quay lại danh sách phòng
        </Button>
      </div>

      <div className="detail-content">
        {/* Room Header */}
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Space align="center" wrap>
            <Title level={1} className="room-main-title">
              {roomName}
              <Text type="secondary" className="room-type">
                ({room.room_type?.category || "Deluxe"})
              </Text>
            </Title>
            <Tag color="orange" className="discount-tag">
              20% OFF
            </Tag>
            <Tag color={getRoomStatusColor(room.status)} className="status-tag">
              {getRoomStatusLabel(room.status)}
            </Tag>
          </Space>

          {/* Rating */}
          <Space size={8}>
            <StarFilled style={{ color: "#fbbf24" }} />
            <Text strong>4.5</Text>
            <Text type="secondary">• 200+ reviews</Text>
          </Space>

          {/* Address */}
          <Space size={8}>
            <EnvironmentOutlined style={{ color: "#6b7280" }} />
            <Text type="secondary">123 Đường ABC, Quận 1, TP.HCM</Text>
          </Space>
        </Space>

        {/* Room Images */}
        <Row gutter={[24, 24]} className="image-section">
          <Col xs={24} lg={12}>
            <img src={mainImage} alt="Room" className="main-image" />
          </Col>
          <Col xs={24} lg={12}>
            <Row gutter={[16, 16]}>
              {roomImages.slice(1).map((image, index) => (
                <Col xs={12} key={index}>
                  <img
                    onClick={() => setMainImage(image)}
                    src={image}
                    alt={`Room ${index + 2}`}
                    className={`thumbnail-image ${
                      mainImage === image ? "active" : ""
                    }`}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Room Highlights */}
        <div className="highlights-section">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={16}>
              <Title level={2} className="section-title">
                Trải Nghiệm Sang Trọng
              </Title>
              <Space size={[16, 16]} wrap>
                {roomAmenities.map((item: string, index: number) => (
                  <Tag key={index} className="amenity-tag">
                    <img
                      src={
                        facilityIcons[item] ||
                        "https://img.icons8.com/ios/50/checkmark--v1.png"
                      }
                      alt={item}
                      className="amenity-icon"
                    />
                    {item}
                  </Tag>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={8} className="price-section">
              <Title level={2} className="price-title">
                {formatPrice(room.price)}
                <Text type="secondary" className="price-unit">
                  /đêm
                </Text>
              </Title>
            </Col>
          </Row>
        </div>

        {/* Booking Form */}
        <Card className="booking-card">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={[24, 24]} align="bottom">
              <Col xs={24} md={6}>
                <Form.Item
                  label="Ngày nhận phòng"
                  name="dates"
                  rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={["Check-in", "Check-out"]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  label="Số khách"
                  name="guests"
                  initialValue={2}
                  rules={[
                    { required: true, message: "Vui lòng nhập số khách" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={room.room_type?.max_guests || 4}
                    placeholder="2"
                    style={{ width: "100%" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className="check-availability-btn"
                    disabled={room.status !== "available"}
                  >
                    {room.status === "available"
                      ? "Kiểm Tra Phòng Trống"
                      : "Phòng Đã Được Đặt"}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Common Specifications */}
        <div className="specifications-section">
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {roomCommonData.map((spec: any, index: number) => (
              <Space key={index} align="start" size={16}>
                <img src={spec.icon} alt={spec.title} className="spec-icon" />
                <div>
                  <Title level={5} className="spec-title">
                    {spec.title}
                  </Title>
                  <Text type="secondary">{spec.description}</Text>
                </div>
              </Space>
            ))}
          </Space>
        </div>

        {/* Description */}
        <div className="description-section">
          <Paragraph className="room-description-text">
            {roomDescription}
          </Paragraph>
        </div>

        {/* Host Information */}
        <div className="host-section">
          <Space direction="vertical" size={16}>
            <Space size={16}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Host"
                className="host-avatar"
              />
              <div>
                <Title level={4} className="host-name">
                  Được quản lý bởi {roomName}
                </Title>
                <Space size={8}>
                  <StarFilled style={{ color: "#fbbf24" }} />
                  <Text strong>4.5</Text>
                  <Text type="secondary">• 200+ reviews</Text>
                </Space>
              </div>
            </Space>
            <Button type="primary" size="large" className="contact-btn">
              Liên Hệ Ngay
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};
