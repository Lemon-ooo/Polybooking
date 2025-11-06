import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Rate,
  Tag,
  Input,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  UserOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  CarOutlined,
  SearchOutlined,
  StarFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import heroImage from "../../../../assets/heroImage.png";

// @ts-ignore - assets.js không có type definitions
import {
  cities,
  assets,
  roomsDummyData,
  exclusiveOffers,
  testimonials,
} from "../../../../assets/assets";

const { Title, Paragraph, Text } = Typography;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onFinish = (values: any) => {
    // TODO: hook search action
    console.log("Search params:", values);
  };

  return (
    <>
      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "88px 64px 24px",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
          marginBottom: "48px",
          marginTop: "-64px",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        {/* Text Section - Left Aligned */}
        <div style={{ maxWidth: "600px" }}>
          <Text
            style={{
              background: "rgba(73,185,255,0.5)",
              padding: "4px 14px",
              borderRadius: "999px",
              display: "inline-block",
              color: "#fff",
              marginTop: "80px",
              fontSize: "14px",
            }}
          >
            The Ultimate HomeStay Experience
          </Text>

          <Title
            level={1}
            style={{
              color: "#fff",
              marginTop: 16,
              marginBottom: 8,
              fontSize: "56px",
              lineHeight: "56px",
              fontWeight: 800,
              maxWidth: "576px",
            }}
          >
            Discover Your Perfect Gateway Destination
          </Title>

          <Paragraph
            style={{
              color: "#fff",
              fontSize: "16px",
              maxWidth: "520px",
              marginBottom: "32px",
            }}
          >
            Unparalleled luxury and comfort await at the world's most exclusive
            homestays. Start your journey today.
          </Paragraph>
        </div>

        {/* Search Form */}
        <Form
          form={form}
          onFinish={onFinish}
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "16px 24px",
            marginTop: "32px",
            width: "auto",
            maxWidth: "fit-content",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "16px",
              alignItems: isMobile ? "flex-start" : "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Form.Item
              name="destination"
              rules={[{ required: true, message: "Please select destination" }]}
              style={{ marginBottom: 0 }}
            >
              <Space direction="vertical" size={4}>
                <Space size={8}>
                  <img
                    src={assets.calenderIcon}
                    alt=""
                    style={{ height: "16px", width: "16px" }}
                  />
                  <label style={{ color: "#6b7280", fontSize: "14px" }}>
                    Destination
                  </label>
                </Space>
                <Select
                  placeholder="Type here"
                  showSearch
                  style={{ width: isMobile ? "100%" : 200 }}
                  filterOption={(input, option) =>
                    (option?.label as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={cities.map((c: string) => ({
                    label: c,
                    value: c,
                  }))}
                />
              </Space>
            </Form.Item>

            <Form.Item name="checkIn" style={{ marginBottom: 0 }}>
              <Space direction="vertical" size={4}>
                <Space size={8}>
                  <img
                    src={assets.calenderIcon}
                    alt=""
                    style={{ height: "16px", width: "16px" }}
                  />
                  <label style={{ color: "#6b7280", fontSize: "14px" }}>
                    Check in
                  </label>
                </Space>
                <DatePicker style={{ width: isMobile ? "100%" : 200 }} />
              </Space>
            </Form.Item>

            <Form.Item name="checkOut" style={{ marginBottom: 0 }}>
              <Space direction="vertical" size={4}>
                <Space size={8}>
                  <img
                    src={assets.calenderIcon}
                    alt=""
                    style={{ height: "16px", width: "16px" }}
                  />
                  <label style={{ color: "#6b7280", fontSize: "14px" }}>
                    Check out
                  </label>
                </Space>
                <DatePicker style={{ width: isMobile ? "100%" : 200 }} />
              </Space>
            </Form.Item>

            <Form.Item name="guests" style={{ marginBottom: 0 }}>
              <Space
                direction={isMobile ? "horizontal" : "vertical"}
                size={isMobile ? 8 : 4}
                style={{
                  alignItems: isMobile ? "center" : "flex-start",
                }}
              >
                <label style={{ color: "#6b7280", fontSize: "14px" }}>
                  Guests
                </label>
                <InputNumber
                  min={1}
                  max={4}
                  placeholder="0"
                  style={{ width: isMobile ? "100%" : 100 }}
                />
              </Space>
            </Form.Item>

            <Form.Item
              style={{
                marginBottom: 0,
                width: isMobile ? "100%" : "auto",
                marginTop: isMobile ? 0 : "auto",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  background: "#000",
                  borderColor: "#000",
                  height: "auto",
                  padding: "12px 16px",
                  width: isMobile ? "100%" : "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  borderRadius: "6px",
                }}
              >
                <img
                  src={assets.searchIcon}
                  alt="searchIcon"
                  style={{ height: "28px", width: "28px" }}
                />
                <span>Search</span>
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Featured Destinations Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 64px",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <Title level={1} style={{ fontSize: "40px", marginBottom: "8px" }}>
            Featured Destinations
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              color: "#6b7280",
              maxWidth: "696px",
              margin: "0 auto",
            }}
          >
            Discover our handpicked selection of exceptional properties around
            the world, offering unparalleled luxury and unforgettable
            experiences.
          </Paragraph>
        </div>

        <Row
          gutter={[24, 24]}
          style={{ width: "100%", maxWidth: "1200px", marginBottom: "64px" }}
        >
          {roomsDummyData.slice(0, 4).map((room: any, index: number) => (
            <Col xs={24} sm={12} md={12} lg={6} key={room._id}>
              <Link
                to={`/rooms/${room._id}`}
                onClick={() => window.scrollTo(0, 0)}
                style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0px 4px 4px rgba(0,0,0,0.05)",
                  }}
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt={room.hotel?.name}
                        src={room.images?.[0]}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      {index % 2 === 0 && (
                        <Tag
                          color="#fff"
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            color: "#374151",
                            border: "none",
                            fontWeight: 500,
                          }}
                        >
                          Best Seller
                        </Tag>
                      )}
                    </div>
                  }
                >
                  <div style={{ padding: "0" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Title
                        level={5}
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: 500,
                          color: "#374151",
                        }}
                      >
                        {room.hotel?.name}
                      </Title>
                      <Space size={4}>
                        <StarFilled style={{ color: "#fbbf24" }} />
                        <span style={{ color: "#6b7280" }}>4.5</span>
                      </Space>
                    </div>

                    <Space
                      size={8}
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "16px",
                      }}
                    >
                      <img
                        src={assets.locationIcon}
                        alt="Location"
                        style={{ height: "16px", width: "16px" }}
                      />
                      <span>{room.hotel?.address}</span>
                    </Space>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "16px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 500,
                            color: "#374151",
                          }}
                        >
                          ${room.pricePerNight}
                        </span>
                        <span style={{ color: "#6b7280", fontSize: "14px" }}>
                          /night
                        </span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/rooms/${room._id}`);
                          window.scrollTo(0, 0);
                        }}
                        style={{
                          borderColor: "#d1d5db",
                          color: "#374151",
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        <Button
          onClick={() => {
            navigate("/rooms");
            window.scrollTo(0, 0);
          }}
          style={{
            borderColor: "#d1d5db",
            color: "#374151",
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          View All Destinations
        </Button>
      </div>

      {/* Exclusive Offers Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "1200px",
            marginBottom: "48px",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <Title level={1} style={{ fontSize: "40px", marginBottom: "8px" }}>
              Exclusive Offers
            </Title>
            <Paragraph
              style={{
                fontSize: "16px",
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              Take advantage of our limited-time offers and special packages to
              enhance your stay and create unforgettable memories.
            </Paragraph>
          </div>
          <Button
            type="link"
            icon={<ArrowRightOutlined />}
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#374151",
              marginTop: isMobile ? "48px" : "0",
            }}
            iconPosition="end"
          >
            View All Offers
          </Button>
        </div>

        <Row gutter={[24, 24]} style={{ width: "100%", maxWidth: "1200px" }}>
          {exclusiveOffers.map((item: any) => (
            <Col xs={24} md={12} lg={8} key={item._id}>
              <Card
                hoverable
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                  height: "100%",
                  minHeight: "300px",
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "48px 16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                bodyStyle={{
                  padding: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: "#fff",
                }}
              >
                <Tag
                  color="#fff"
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    color: "#374151",
                    border: "none",
                    fontWeight: 500,
                  }}
                >
                  {item.priceOff}% OFF
                </Tag>

                <div>
                  <Title
                    level={3}
                    style={{
                      color: "#fff",
                      fontSize: "24px",
                      fontWeight: 500,
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: "#fff", marginBottom: "12px" }}>
                    {item.description}
                  </Paragraph>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                    }}
                  >
                    Expires {item.expiryDate}
                  </Text>
                </div>

                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 500,
                    padding: 0,
                    marginTop: "16px",
                    marginBottom: "20px",
                  }}
                  iconPosition="end"
                >
                  View Offers
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Testimonials Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 64px",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <Title level={1} style={{ fontSize: "40px", marginBottom: "8px" }}>
            What Our Customers Say
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              color: "#6b7280",
              maxWidth: "696px",
              margin: "0 auto",
            }}
          >
            Discover why discerning travelers consistently choose PolyStay for
            their exclusive and luxurious accommodations around the world.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} style={{ width: "100%", maxWidth: "1200px" }}>
          {testimonials.map((testimonial: any) => (
            <Col xs={24} sm={12} md={8} key={testimonial.id}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0px 4px 4px rgba(0,0,0,0.05)",
                  height: "100%",
                }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Space size={12}>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <Title
                        level={5}
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: 500,
                          color: "#374151",
                        }}
                      >
                        {testimonial.name}
                      </Title>
                      <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                        {testimonial.address}
                      </Text>
                    </div>
                  </Space>

                  <Rate
                    disabled
                    defaultValue={testimonial.rating}
                    style={{ fontSize: "16px" }}
                  />

                  <Paragraph
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      margin: 0,
                      maxWidth: "360px",
                    }}
                  >
                    "{testimonial.review}"
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Newsletter Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "120px 16px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "1280px",
            width: "100%",
            borderRadius: "16px",
            padding: "48px 16px 64px",
            background: "#111827",
            color: "#fff",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title
              level={1}
              style={{
                fontSize: "40px",
                marginBottom: "8px",
                color: "#fff",
              }}
            >
              Stay Inspired
            </Title>
            <Paragraph
              style={{
                fontSize: "16px",
                color: "#9ca3af",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Join our newsletter and be the first to discover new destinations,
              exclusive offers, and travel inspiration.
            </Paragraph>
          </div>

          <Form
            onFinish={(values) => {
              console.log("Subscribe:", values);
            }}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "16px",
              width: "100%",
              maxWidth: "528px",
              marginTop: "24px",
            }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input
                placeholder="Enter your email"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "10px 16px",
                }}
                className="newsletter-input"
              />
              <style>
                {`
                  .newsletter-input::placeholder {
                    color: rgba(255,255,255,0.5) !important;
                  }
                  .newsletter-input input::placeholder {
                    color: rgba(255,255,255,0.5) !important;
                  }
                `}
              </style>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<ArrowRightOutlined />}
                style={{
                  background: "#000",
                  borderColor: "#000",
                  padding: "10px 28px",
                  height: "auto",
                  width: isMobile ? "100%" : "auto",
                }}
                iconPosition="end"
              >
                Subscribe
              </Button>
            </Form.Item>
          </Form>

          <Text
            style={{
              color: "#6b7280",
              fontSize: "12px",
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </Text>
        </div>
      </div>
    </>
  );
};
