// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useState } from "react";
import { useOne } from "@refinedev/core";
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
  ArrowLeftOutlined 
} from "@ant-design/icons";
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
  "WiFi": "https://img.icons8.com/ios/50/wifi--v1.png",
  "Parking": "https://img.icons8.com/ios/50/parking.png",
  "Breakfast": "https://img.icons8.com/ios/50/breakfast.png",
  "Swimming Pool": "https://img.icons8.com/ios/50/swimming-pool.png",
  "Air Conditioning": "https://img.icons8.com/ios/50/air-conditioner.png",
  "TV": "https://img.icons8.com/ios/50/tv.png",
  "Mini Bar": "https://img.icons8.com/ios/50/cocktail.png",
};

const roomCommonData = [
  {
    icon: "https://img.icons8.com/ios/50/check-in.png",
    title: "Check-in & Check-out",
    description: "Check-in from 2:00 PM, check-out by 12:00 PM"
  },
  {
    icon: "https://img.icons8.com/ios/50/cancel.png",
    title: "Cancellation Policy",
    description: "Free cancellation before 48 hours. 50% charge after that."
  },
  {
    icon: "https://img.icons8.com/ios/50/no-smoking.png",
    title: "No Smoking",
    description: "This is a non-smoking property"
  },
  {
    icon: "https://img.icons8.com/ios/50/party.png",
    title: "No Parties",
    description: "Parties and events are not allowed"
  }
];

interface RoomApiResponse {
  success: boolean;
  data: Room;
  message: string;
}

export const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState<string>("");
  const [form] = Form.useForm();

  // Sử dụng useOne để lấy chi tiết phòng
  const { data, isLoading, isError } = useOne<RoomApiResponse>({
    resource: "rooms",
    id: id,
  });

  const room = data?.data?.data;

  // Set ảnh chính khi có room
  React.useEffect(() => {
    if (room) {
      const firstImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop";
      setMainImage(firstImage);
    }
  }, [room]);

  // Ảnh mẫu
  const roomImages = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
  ];

  const onFinish = (values: any) => {
    console.log("Booking values:", values);
    if (room) {
      navigate(`/client/booking/${id}`, {
        state: {
          dates: values.dates,
          guests: values.guests,
          room: room
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "100px 64px", textAlign: "center" }}>
        <Spin size="large" />
        <Title level={3} style={{ marginTop: 16 }}>Loading...</Title>
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
  const roomAmenities = room.amenities?.map((amenity: any) => amenity.name) || [
    "WiFi", "Air Conditioning", "TV", "Mini Bar", "Parking"
  ];

  const roomName = room.room_type?.name || `Phòng ${room.room_number}`;
  const roomDescription = room.description || room.room_type?.description || 
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
            <Title level={1} style={{ margin: 0, fontSize: "40px" }}>
              {roomName}
              <Text type="secondary" style={{ fontSize: "16px", marginLeft: "8px" }}>
                ({room.room_type?.category || "Deluxe"})
              </Text>
            </Title>
            <Tag color="orange" style={{ fontSize: "12px", padding: "4px 12px" }}>
              20% OFF
            </Tag>
            <Tag 
              color={getRoomStatusColor(room.status)} 
              style={{ fontSize: "12px", padding: "4px 12px" }}
            >
              {getRoomStatusLabel(room.status)}
            </Tag>
          </Space>

          {/* Rating */}
          <Space size={8}>
            <StarFilled style={{ color: "#fbbf24" }} />
            <Text>4.5</Text>
            <Text type="secondary">• 200+ reviews</Text>
          </Space>

          {/* Address */}
          <Space size={8}>
            <EnvironmentOutlined style={{ color: "#6b7280" }} />
            <Text type="secondary">123 Đường ABC, Quận 1, TP.HCM</Text>
          </Space>
        </Space>

        {/* Room Images */}
        <Row gutter={[24, 24]} style={{ marginTop: "32px" }}>
          <Col xs={24} lg={12}>
            <img
              src={mainImage || roomImages[0]}
              alt="Room"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </Col>
          <Col xs={24} lg={12}>
            <Row gutter={[16, 16]}>
              {roomImages.slice(1).map((image: string, index: number) => (
                <Col xs={12} key={index}>
                  <img
                    onClick={() => setMainImage(image)}
                    src={image}
                    alt={`Room ${index + 2}`}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: mainImage === image ? "3px solid #ff6b35" : "none",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Room Highlights */}
        <div style={{ marginTop: "64px" }}>
          <Row justify="space-between" align="middle">
            <Col xs={24} md={16}>
              <Title level={2} style={{ fontSize: "32px", marginBottom: "24px" }}>
                Experience Luxury Like Never Before
              </Title>
              <Space size={[16, 16]} wrap>
                {roomAmenities.map((item: string, index: number) => (
                  <Tag
                    key={index}
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      background: "#f3f4f6",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={facilityIcons[item] || "https://img.icons8.com/ios/50/checkmark--v1.png"}
                      alt={item}
                      style={{ width: "20px", height: "20px" }}
                    />
                    {item}
                  </Tag>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "right" }}>
              <Title level={2} style={{ fontSize: "32px", margin: 0 }}>
                {formatPrice(room.price)}
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  /night
                </Text>
              </Title>
            </Col>
          </Row>
        </div>

        {/* Booking Form */}
        <Card
          style={{
            marginTop: "64px",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={[24, 24]} align="bottom">
              <Col xs={24} md={6}>
                <Form.Item
                  label="Check-In"
                  name="dates"
                  rules={[{ required: true, message: "Please select check-in date" }]}
                >
                  <RangePicker 
                    style={{ width: "100%" }} 
                    size="large"
                    placeholder={['Check-in', 'Check-out']}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  label="Guests"
                  name="guests"
                  initialValue={2}
                  rules={[{ required: true, message: "Please enter number of guests" }]}
                >
                  <InputNumber
                    min={1}
                    max={10}
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
                    style={{
                      background: "#1677ff",
                      height: "48px",
                      fontSize: "16px",
                    }}
                    disabled={room.status !== "available"}
                  >
                    {room.status === "available" ? "Check Availability" : "Room Booked"}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Common Specifications */}
        <div style={{ marginTop: "80px" }}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {roomCommonData.map((spec: any, index: number) => (
              <Space key={index} align="start" size={16}>
                <img
                  src={spec.icon}
                  alt={spec.title}
                  style={{ width: "26px", height: "26px" }}
                />
                <div>
                  <Title level={5} style={{ margin: 0, marginBottom: "4px" }}>
                    {spec.title}
                  </Title>
                  <Text type="secondary">{spec.description}</Text>
                </div>
              </Space>
            ))}
          </Space>
        </div>

        {/* Description */}
        <div
          style={{
            maxWidth: "800px",
            borderTop: "1px solid #e5e7eb",
            borderBottom: "1px solid #e5e7eb",
            margin: "80px 0",
            padding: "40px 0",
          }}
        >
          <Paragraph style={{ fontSize: "16px", color: "#6b7280" }}>
            {roomDescription}
          </Paragraph>
        </div>

        {/* Host Information */}
        <Space direction="vertical" size={16}>
          <Space size={16}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Host"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <Title level={4} style={{ margin: 0, marginBottom: "8px" }}>
                Hosted by {roomName}
              </Title>
              <Space size={8}>
                <StarFilled style={{ color: "#fbbf24" }} />
                <Text>4.5</Text>
                <Text type="secondary">• 200+ reviews</Text>
              </Space>
            </div>
          </Space>
          <Button
            type="primary"
            size="large"
            style={{
              background: "#1677ff",
              marginTop: "16px",
            }}
          >
            Contact Now
          </Button>
        </Space>
      </div>
    </div>
  );
};