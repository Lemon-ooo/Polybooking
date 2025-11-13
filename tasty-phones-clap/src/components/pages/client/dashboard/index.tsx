// src/components/pages/client/dashboard/ClientDashboard.tsx
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
  Spin,
  Empty,
  message,
} from "antd";
import {
  SearchOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import heroImage from "../../../../assets/heroImage.png";
import {
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
} from "../../../../interfaces/rooms";

const { Title, Paragraph, Text } = Typography;

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [rooms, setRooms] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setIsLoading(true);

      const [roomsRes, servicesRes, amenitiesRes] = await Promise.all([
        axiosInstance.get("/rooms"),
        axiosInstance.get("/services"),
        axiosInstance.get("/amenities"),
      ]);

      setRooms(roomsRes.data.data || []);
      setServices(servicesRes.data.data || []);
      setAmenities(amenitiesRes.data.data || []);

      const mockPlaces = [
        {
          id: 1,
          name: "Bãi biển Mỹ Khê",
          description: "Một trong những bãi biển đẹp nhất Việt Nam.",
          image:
            "https://havi-web.s3.ap-southeast-1.amazonaws.com/bien_my_khe_da_nang_2_11zon_1_a3a8e98ee1.webp",
        },
        {
          id: 2,
          name: "Cầu Rồng",
          description:
            "Biểu tượng nổi tiếng của Đà Nẵng, phun lửa mỗi cuối tuần.",
          image:
            "https://vietluxtour.com/Upload/images/2024/khamphatrongnuoc/C%E1%BA%A7u%20R%E1%BB%93ng%20%C4%90%C3%A0%20N%E1%BA%B5ng/cau-rong-da-nang-main-min.jpg",
        },
        {
          id: 3,
          name: "Ngũ Hành Sơn",
          description:
            "Thắng cảnh nổi tiếng với hệ thống chùa chiền và hang động kỳ thú.",
          image:
            "https://booking.muongthanh.com/upload_images/images/H%60/nui-ngu-hanh-son.jpg",
        },
      ];

      const mockTestimonials = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          address: "Hà Nội",
          rating: 5,
          review: "Phòng rất đẹp và sạch sẽ, nhân viên phục vụ chu đáo!",
          image: "https://randomuser.me/api/portraits/men/75.jpg",
        },
        {
          id: 2,
          name: "Trần Thị B",
          address: "Hồ Chí Minh",
          rating: 4,
          review: "Dịch vụ tuyệt vời, tôi sẽ quay lại lần sau.",
          image: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
          id: 3,
          name: "Phạm Minh C",
          address: "Đà Nẵng",
          rating: 5,
          review: "Trải nghiệm tuyệt vời, đáng đồng tiền!",
          image: "https://randomuser.me/api/portraits/men/20.jpg",
        },
      ];

      setPlaces(mockPlaces);
      setTestimonials(mockTestimonials);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải dữ liệu từ server!");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const onFinish = (values: any) => {
    console.log("Search params:", values);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "120px 0" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <>
      {/* ---------- HERO SECTION ---------- */}
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
          color: "#fff",
          marginBottom: "48px",
          marginTop: "-64px",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <Text
            style={{
              background: "rgba(73,185,255,0.5)",
              padding: "4px 14px",
              borderRadius: "999px",
              display: "inline-block",
              color: "#fff",
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
            Discover Your Perfect Getaway Destination
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

        {/* ---------- SEARCH FORM ---------- */}
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
          <Space
            direction={isMobile ? "vertical" : "horizontal"}
            size={16}
            align="end"
            wrap
          >
            <Form.Item
              name="destination"
              rules={[{ required: true, message: "Vui lòng chọn điểm đến" }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Chọn thành phố"
                showSearch
                style={{ width: isMobile ? "100%" : 200 }}
                options={[
                  { label: "Hà Nội", value: "hanoi" },
                  { label: "Đà Nẵng", value: "danang" },
                  { label: "Hồ Chí Minh", value: "hcm" },
                ]}
              />
            </Form.Item>

            <Form.Item name="checkIn" style={{ marginBottom: 0 }}>
              <DatePicker
                style={{ width: isMobile ? "100%" : 200 }}
                placeholder="Ngày nhận phòng"
              />
            </Form.Item>

            <Form.Item name="checkOut" style={{ marginBottom: 0 }}>
              <DatePicker
                style={{ width: isMobile ? "100%" : 200 }}
                placeholder="Ngày trả phòng"
              />
            </Form.Item>

            <Form.Item name="guests" style={{ marginBottom: 0 }}>
              <InputNumber
                min={1}
                max={10}
                placeholder="Số khách"
                style={{ width: isMobile ? "100%" : 100 }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{
                  background: "#000",
                  borderColor: "#000",
                  height: "auto",
                  padding: "12px 16px",
                  borderRadius: "6px",
                }}
              >
                Tìm Phòng
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </div>

      {/* ---------- FEATURED ROOMS ---------- */}
      <section
        className="featured-rooms-section"
        style={{ padding: "80px 64px" }}
      >
        <div className="container">
          <Title level={2} style={{ textAlign: "center" }}>
            Phòng được yêu thích nhất
          </Title>
          <Paragraph style={{ textAlign: "center", marginBottom: 40 }}>
            Tận hưởng không gian yên bình trong từng căn phòng
          </Paragraph>

          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Đang tải danh sách phòng nổi bật...
              </Text>
            </div>
          ) : rooms.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Chưa có phòng nào được hiển thị.
              </Text>
            </div>
          ) : (
            <Row gutter={[32, 32]}>
              {rooms.slice(0, 4).map((room) => (
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
                              onClick={() =>
                                navigate(`/client/rooms`)
                              }
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
                              <WifiOutlined /> <Text>WiFi miễn phí</Text>
                            </div>
                            <div className="feature-item">
                              <CarOutlined /> <Text>Bãi đỗ xe</Text>
                            </div>
                            <div className="feature-item">
                              <CoffeeOutlined /> <Text>Bữa sáng</Text>
                            </div>
                            <div className="feature-item">
                              <EnvironmentOutlined />{" "}
                              <Text>Trung tâm thành phố</Text>
                            </div>
                          </div>

                          <div className="room-footer">
                            <div className="room-price">
                              <Text className="price-from">Từ </Text>
                              <Text className="price-amount">
                                {formatPrice(room.price)}
                              </Text>
                              <Text className="price-unit"> /đêm</Text>
                            </div>

                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>

      {/* ---------- OTHER SECTIONS ---------- */}
      {/* ---------- FEATURED SERVICES (DỊCH VỤ NỔI BẬT) ---------- */}
      <section style={{ padding: "80px 64px", background: "#ffffff" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <Title
            level={2}
            style={{
              fontSize: "36px",
              fontWeight: 600,
              color: "#1f2937",
              marginBottom: "16px",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Dịch vụ nổi bật
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              color: "#6b7280",
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            Trải nghiệm những dịch vụ được yêu thích nhất tại khách sạn của
            chúng tôi — mang đến sự thư giãn, tiện nghi và đẳng cấp.
          </Paragraph>
        </div>

        {services.length === 0 ? (
          <Empty description="Hiện chưa có dịch vụ nào" />
        ) : (
          <Row
            gutter={[40, 40]}
            style={{ maxWidth: "1280px", margin: "0 auto" }}
          >
            {services.slice(0, 3).map((service: any) => (
              <Col xs={24} sm={12} lg={8} key={service.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={
                          service.image ||
                          service.icon_url ||
                          "https://images.unsplash.com/photo-1591017403286-fd8493524d2f?w=800"
                        }
                        alt={service.name}
                        style={{
                          width: "100%",
                          height: "240px",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                      {service.price && (
                        <Tag
                          color="gold"
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            fontSize: "14px",
                            fontWeight: 600,
                            padding: "4px 12px",
                            borderRadius: "999px",
                          }}
                        >
                          {parseFloat(
                            service.price.toString()
                          ).toLocaleString()}
                          ₫
                        </Tag>
                      )}
                    </div>
                  }
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  bodyStyle={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Title
                      level={4}
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#1f2937",
                        marginBottom: "8px",
                      }}
                    >
                      {service.name}
                    </Title>
                    <Paragraph
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "24px",
                      }}
                    >
                      {service.description ||
                        "Dịch vụ cao cấp, mang lại trải nghiệm tuyệt vời cho bạn."}
                    </Paragraph>
                  </div>

                  <div style={{ textAlign: "center", marginTop: "auto" }}>
                    <Button
                      type="primary"
                      onClick={() => navigate(`/client/services/${service.id}`)}
                      style={{
                        background: "#1677ff",
                        borderRadius: "999px",
                        padding: "12px 28px",
                        height: "auto",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <Button
            type="default"
            size="large"
            onClick={() => navigate("/client/services")}
            style={{
              borderRadius: "999px",
              padding: "12px 32px",
              fontWeight: 500,
              borderColor: "#1677ff",
              color: "#1677ff",
            }}
          >
            Xem tất cả dịch vụ
          </Button>
        </div>
      </section>

      <Section
        title="Địa điểm khám phá"
        subtitle="Những nơi bạn nên đến gần khách sạn"
        data={places}
        emptyMessage="Không có địa điểm nào để hiển thị"
      />

      {/* ---------- Bình luận của khách hàng ---------- */}
      <div
        style={{
          background: "#f8fafc",
          padding: "80px 64px",
          textAlign: "center",
        }}
      >
        <Title level={1}>BÌNH LUẬN & ĐÁNH GIÁ KHÁCH HÀNG</Title>
        <Paragraph style={{ maxWidth: 600, margin: "0 auto 64px" }}>
          “Lắng nghe trải nghiệm từ những vị khách đáng mến”
        </Paragraph>

        <Row gutter={[24, 24]} justify="center">
          {testimonials.length === 0 ? (
            <Empty description="Chưa có đánh giá nào" />
          ) : (
            testimonials.map((item: any) => (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <Card styles={{ body: { textAlign: "center" } }}>
                  <Space direction="vertical" align="center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <Title level={5}>{item.name}</Title>
                    <Text type="secondary">{item.address}</Text>
                    <Rate disabled defaultValue={item.rating} />
                    <Paragraph>"{item.review}"</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </>
  );
};

// ---------- SECTION COMPONENT ----------
const Section = ({
  title,
  subtitle,
  data,
  emptyMessage,
  onClick,
}: {
  title: string;
  subtitle: string;
  data: any[];
  emptyMessage: string;
  onClick?: (id: number) => void;
}) => (
  <div style={{ padding: "80px 64px", textAlign: "center" }}>
    <Title level={1}>{title}</Title>
    <Paragraph style={{ maxWidth: 600, margin: "0 auto 64px" }}>
      {subtitle}
    </Paragraph>
    <Row gutter={[24, 24]} justify="center">
      {data.length === 0 ? (
        <Empty description={emptyMessage} />
      ) : (
        data.slice(0, 6).map((item: any) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={item.name}
                  src={item.image || item.icon_url || item.images?.[0]}
                  style={{ height: 240, objectFit: "cover" }}
                />
              }
              onClick={() => onClick?.(item.id)}
            >
              <Title level={4}>{item.name}</Title>
              <Paragraph>{item.description || item.category}</Paragraph>
            </Card>
          </Col>
        ))
      )}
    </Row>
  </div>
);
