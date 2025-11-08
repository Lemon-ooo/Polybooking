import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Space, Button, Tag, Row, Col, Card, Form, DatePicker, InputNumber } from "antd";
import { StarFilled, EnvironmentOutlined } from "@ant-design/icons";
import {
  assets,
  facilityIcons,
  roomCommonData,
  roomsDummyData,
} from "../../../../assets/assets";

const { Title, Paragraph, Text } = Typography;

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const foundRoom = roomsDummyData.find((room: any) => room._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.images[0]);
    }
  }, [id]);

  const onFinish = (values: any) => {
    console.log("Booking values:", values);
    // TODO: Handle booking submission
  };

  if (!room) {
    return (
      <div style={{ padding: "100px 64px", textAlign: "center" }}>
        <Title level={3}>Loading...</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: "100px 64px 64px" }}>
      {/* Room Header */}
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Space align="center" wrap>
          <Title level={1} style={{ margin: 0, fontSize: "40px" }}>
            {room.hotel.name}
            <Text type="secondary" style={{ fontSize: "16px", marginLeft: "8px" }}>
              ({room.roomType})
            </Text>
          </Title>
          <Tag color="orange" style={{ fontSize: "12px", padding: "4px 12px" }}>
            20% OFF
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
          <Text type="secondary">{room.hotel.address}</Text>
        </Space>
      </Space>

      {/* Room Images */}
      <Row gutter={[24, 24]} style={{ marginTop: "32px" }}>
        <Col xs={24} lg={12}>
          <img
            src={mainImage || room.images[0]}
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
            {room.images.length > 1 &&
              room.images.map((image: string, index: number) => (
                <Col xs={12} key={index}>
                  <img
                    onClick={() => setMainImage(image)}
                    src={image}
                    alt={`Room ${index + 1}`}
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
              {room.amenities.map((item: string, index: number) => (
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
                    src={facilityIcons[item]}
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
              ${room.pricePerNight}
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
                name="checkIn"
                rules={[{ required: true, message: "Please select check-in date" }]}
              >
                <DatePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Check-Out"
                name="checkOut"
                rules={[{ required: true, message: "Please select check-out date" }]}
              >
                <DatePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Guests"
                name="guests"
                rules={[{ required: true, message: "Please enter number of guests" }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="0"
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
                >
                  Check Availability
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
          Customers will be allocated on the ground floor according to availability. 
          You get a comfortable Two bedroom apartment has a true city feeling. The 
          price quoted is for two customers, at the customers slot please mark the 
          number of guests to get the exact price for groups. The customers will be 
          allocated ground floor according to availability. You get the comfortable 
          two bedroom apartment that has a true city feeling.
        </Paragraph>
      </div>

      {/* Host Information */}
      <Space direction="vertical" size={16}>
        <Space size={16}>
          <img
            src={room.hotel.owner.image}
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
              Hosted by {room.hotel.name}
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
  );
};

export default RoomDetails;
