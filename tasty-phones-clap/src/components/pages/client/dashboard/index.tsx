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
  Rate,
  Tag,
  Spin,
  Empty,
  message,
  Carousel,
} from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import "../../../../assets/fonts/fonts.css";

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

  const getRoomTypeImage = (roomType: any) =>
    `http://localhost:8000/storage/${roomType.room_type_image}`;

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setIsLoading(true);

      const [roomsRes, servicesRes, amenitiesRes] = await Promise.all([
        axiosInstance.get("/room-types"),
        axiosInstance.get("/services"),
        axiosInstance.get("/amenities"),
      ]);

      setRooms(roomsRes.data.data || []);
      setServices(servicesRes.data.data || []);
      setAmenities(amenitiesRes.data.data || []);

      const mockPlaces = [
        {
          id: 1,
          name: "My Khe Beach",
          description: "One of Vietnam's most beautiful beaches.",
          image:
            "https://havi-web.s3.ap-southeast-1.amazonaws.com/bien_my_khe_da_nang_2_11zon_1_a3a8e98ee1.webp",
        },
        {
          id: 2,
          name: "Dragon Bridge",
          description:
            "A famous Danang landmark that breathes fire on weekends.",
          image:
            "https://vietluxtour.com/Upload/images/2024/khamphatrongnuoc/C%E1%BA%A7u%20R%E1%BB%93ng%20%C4%90%C3%A0%20N%E1%BA%B5ng/cau-rong-da-nang-main-min.jpg",
        },
        {
          id: 3,
          name: "Marble Mountains",
          description:
            "A popular attraction with temples and interesting caves to explore.",
          image:
            "https://booking.muongthanh.com/upload_images/images/H%60/nui-ngu-hanh-son.jpg",
        },
      ];

      const mockTestimonials = [
        {
          id: 1,
          name: "Nguyen Van A",
          address: "Hanoi",
          rating: 5,
          review:
            "The room was beautiful and clean, and the staff were very attentive!",
          image: "https://randomuser.me/api/portraits/men/75.jpg",
        },
        {
          id: 2,
          name: "Tran Thi B",
          address: "Ho Chi Minh City",
          rating: 4,
          review: "Excellent service — I will definitely come back.",
          image: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
          id: 3,
          name: "Pham Minh C",
          address: "Da Nang",
          rating: 5,
          review: "Wonderful experience, great value for money!",
          image: "https://randomuser.me/api/portraits/men/20.jpg",
        },
      ];

      setPlaces(mockPlaces);
      setTestimonials(mockTestimonials);
    } catch (err) {
      console.error(err);
      message.error("Unable to load data from server!");
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
      {/* ===================== BOOKING BAR ===================== */}
      <section
        style={{
          width: "100%",
          background: "white",
          padding: "20px 0",
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "12px",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          {/* CHECK-IN */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "8px 12px",
              background: "#fff",
            }}
          >
            <label style={{ fontSize: 13, color: "#666" }}>Check-in</label>
            <input
              type="date"
              style={{
                border: "none",
                width: "100%",
                marginTop: 4,
                fontWeight: 600,
                outline: "none",
              }}
              defaultValue="2025-11-19"
            />
          </div>

          {/* CHECK-OUT */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "8px 12px",
              background: "#fff",
            }}
          >
            <label style={{ fontSize: 13, color: "#666" }}>Check-out</label>
            <input
              type="date"
              style={{
                border: "none",
                width: "100%",
                marginTop: 4,
                fontWeight: 600,
                outline: "none",
              }}
              defaultValue="2025-11-20"
            />
          </div>

          {/* GUESTS */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "8px 12px",
              background: "#fff",
            }}
          >
            <label style={{ fontSize: 13, color: "#666" }}>Guests</label>
            <select
              style={{
                border: "none",
                width: "100%",
                marginTop: 4,
                fontWeight: 600,
                outline: "none",
                background: "transparent",
              }}
            >
              <option>2 adults, 0 children</option>
              <option>2 adults, 1 child</option>
              <option>1 adult</option>
            </select>
          </div>

          {/* PROMO CODE */}
          <button
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 6,
              border: "1px solid #d9d9d9",
              background: "#efe5e0",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            I have a promo code
          </button>

          {/* BUTTON FIND ROOM */}
          <button
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 6,
              border: "none",
              background: "#b89585",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => console.log("Search rooms")}
          >
            FIND ROOM
          </button>
        </div>
      </section>
      {/* ====== SHARED BACKGROUND WRAPPER ====== */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* BACKGROUND LAYER (blurred) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              'url("https://kimfurniture.com/wp-content/uploads/2022/10/phong-khach-mau-xam-12.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            transform: "scale(1.1)",
            zIndex: 0,
          }}
        ></div>
        {/* OVERLAY LAYER */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.35)",
            zIndex: 1,
          }}
        ></div>
        {/* ALL CONTENT */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* ========================================== */}
          {/* ---------- INTRO SECTION (AREA B) ------- */}
          {/* ========================================== */}

          <section
            style={{
              width: "100%",
              padding: "60px 0 0 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "1000px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "60px",
                alignItems: "center",
              }}
            >
              {/* LEFT IMAGE SLIDER */}
              <div
                style={{
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "14px",
                }}
              >
                <Carousel
                  autoplay
                  dots={true}
                  autoplaySpeed={3500}
                  speed={900}
                  easing="ease-in-out"
                  swipeToSlide
                  draggable
                  pauseOnHover={false}
                >
                  {[
                    "https://muongthanh.com/images/trademark/intro/2019/04/normal/luxury_1_1554258787.jpg",
                    "https://muongthanh.com/images/trademark/intro/2019/04/normal/luxury_2_1554258928.jpg",
                    "https://muongthanh.com/images/slideshow/2019/05/22/slideshow_large/luxury-slider_1_1558490470.jpg",
                  ].map((img, index) => (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#000",
                      }}
                    >
                      <img
                        src={img}
                        alt={`slide-${index}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "14px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* RIGHT TEXT */}
              <div style={{ color: "#e6d0c4", textAlign: "left" }}>
                <h2
                  style={{
                    fontFamily: "UTM-Yen-Tu",
                    fontSize: "38px",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Rue De L’amour{" "}
                  <span style={{ fontStyle: "italic" }}>Boutique</span>
                </h2>

                <h3
                  style={{
                    fontFamily: "UTM-Yen-Tu",
                    fontSize: "24px",
                    fontWeight: 400,
                    marginBottom: "20px",
                    color: "#ffffff",
                    letterSpacing: 1,
                  }}
                >
                  Hotel Hanoi
                </h3>

                <p
                  style={{
                    color: "#c7c7c7",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    maxWidth: "500px",
                  }}
                >
                  Bringing guests unique and memorable experiences with the goal
                  of becoming the leading boutique hotel chain in Vietnam.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* -------------- LOWER SECTION -------------- */}
          {/* ========================================== */}

          <section
            style={{
              width: "100%",
              padding: "0 0 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "90%",
                maxWidth: "1000px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "40px",
                alignItems: "center",
              }}
            >
              {/* LEFT TEXT */}
              <div style={{ color: "#e6d0c4", textAlign: "left" }}>
                <h2
                  style={{
                    fontFamily: "UTM-Yen-Tu",
                    fontSize: "42px",
                    fontWeight: 600,
                    marginBottom: "12px",
                    color: "#e6d0c4",
                  }}
                >
                  Path <span style={{ fontStyle: "italic" }}>of</span> Love
                </h2>

                <h3
                  style={{
                    fontFamily: "UTM-Yen-Tu",
                    fontSize: "26px",
                    fontWeight: 400,
                    marginBottom: "16px",
                    color: "#ffffff",
                  }}
                >
                  Rue De L’amour Boutique Hotel Hanoi
                </h3>

                <p
                  style={{
                    color: "#c7c7c7",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    maxWidth: "480px",
                  }}
                >
                  Located on Phan Dinh Phung Street — one of the most beautiful
                  & romantic streets in Hanoi. 05–15 minutes from the Old
                  Quarter.
                </p>

                <p style={{ marginTop: "16px", color: "#e6d0c4" }}>VIEW MORE</p>
              </div>

              {/* RIGHT IMAGE SLIDER */}
              <div
                style={{
                  width: "100%",
                  height: "480px",
                  overflow: "hidden",
                  borderRadius: "12px",
                }}
              >
                <Carousel
                  autoplay
                  dots={true}
                  autoplaySpeed={3500}
                  speed={900}
                  easing="ease-in-out"
                  swipeToSlide
                  draggable
                  pauseOnHover={false}
                >
                  {[
                    "https://img.dothi.net/2020/07/31/Z9BcC3fq/khach-san-dep-8-1a9e.jpg",
                    "https://img.dothi.net/2020/07/31/Z9BcC3fq/khach-san-dep-7-8271.jpg",
                    "https://img.dothi.net/2020/07/31/Z9BcC3fq/khach-san-dep-9-8a24.jpg",
                  ].map((img, index) => (
                    <div key={index} style={{ width: "100%", height: "480px" }}>
                      <img
                        src={img}
                        alt={`slide-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                          transition: "transform .6s ease-in-out",
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* ------------ ACCOMMODATIONS -------------- */}
          {/* ========================================== */}

          <section
            className="featured-rooms-section"
            style={{ padding: "40px 64px" }}
          >
            <div className="container">
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: 16,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 42,
                  color: "#e6d0c4",
                }}
              >
                Accommodations
              </Title>

              <Paragraph
                style={{
                  textAlign: "center",
                  marginBottom: 40,
                  color: "#c7c7c7",
                  fontSize: 16,
                }}
              >
                Luxurious and sophisticated effects in every resort space
              </Paragraph>

              {isLoading ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                  <Text style={{ marginTop: 16, display: "block" }}>
                    Loading room types...
                  </Text>
                </div>
              ) : rooms.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    No room types available.
                  </Text>
                </div>
              ) : (
                <Row gutter={[32, 32]} justify="center">
                  {rooms.slice(0, 3).map((roomType) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      key={roomType.room_type_id}
                    >
                      <Card
                        bodyStyle={{ padding: 0 }}
                        hoverable
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#fff",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: 220,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={getRoomTypeImage(roomType)}
                            alt={roomType.room_type_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <div style={{ padding: "20px" }}>
                          <h3
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              color: "#8a6e5b",
                              fontSize: 22,
                              marginBottom: 8,
                            }}
                          >
                            {roomType.room_type_name}
                          </h3>
                          <p
                            style={{
                              color: "#444",
                              fontSize: 14,
                              lineHeight: 1.5,
                              marginBottom: 16,
                            }}
                          >
                            {roomType.description ||
                              "A luxurious room with elegant design."}
                          </p>
                          <div style={{ textAlign: "right" }}>
                            <button
                              onClick={() =>
                                navigate(
                                  `/client/rooms/${roomType.room_type_id}`
                                )
                              }
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#8a6e5b",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                textTransform: "uppercase",
                              }}
                            >
                              ROOM DETAILS
                            </button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </section>

          {/* ========================================== */}
          {/* ------------ OTHER SECTIONS -------------- */}
          {/* ========================================== */}
          <section
            className="featured-services-section"
            style={{ padding: "40px 64px" }}
          >
            <div className="container">
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: 16,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 42,
                  color: "#e6d0c4",
                }}
              >
                Outstanding Services
              </Title>

              <Paragraph
                style={{
                  textAlign: "center",
                  marginBottom: 40,
                  color: "#c7c7c7",
                  fontSize: 16,
                }}
              >
                Experience our hotel's most popular services.
              </Paragraph>

              {services.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    No services available.
                  </Text>
                </div>
              ) : (
                <Row gutter={[32, 32]} justify="center">
                  {services.slice(0, 3).map((service: any) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={service.id}>
                      <Card
                        hoverable
                        bodyStyle={{ padding: 0 }}
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#fff",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {/* IMAGE */}
                        <div
                          style={{
                            width: "100%",
                            height: 220,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={
                              service.service_image
                                ? `http://localhost:8000/storage/${service.service_image}`
                                : "https://images.unsplash.com/photo-1591017403286-fd8493524d2f?w=800"
                            }
                            alt={service.name}
                            style={{
                              width: "100%",
                              height: "100%",
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
                        </div>

                        {/* CONTENT */}
                        <div style={{ padding: "20px" }}>
                          <h3
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              color: "#8a6e5b",
                              fontSize: 22,
                              marginBottom: 8,
                            }}
                          >
                            {service.name}
                          </h3>

                          <p
                            style={{
                              color: "#444",
                              fontSize: 14,
                              lineHeight: 1.5,
                              marginBottom: 16,
                            }}
                          >
                            {service.description ||
                              "High-quality hotel service."}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {service.price && (
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: "#8a6e5b",
                                }}
                              >
                                {parseFloat(
                                  service.price.toString()
                                ).toLocaleString()}
                                ₫
                              </span>
                            )}

                            <button
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#8a6e5b",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                textTransform: "uppercase",
                              }}
                              onClick={() =>
                                console.log("Service Details:", service.id)
                              }
                            >
                              SERVICES DETAILS
                            </button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </section>
        </div>{" "}
        {/* END CONTENT WRAPPER */}
      </div>{" "}
      {/* END BACKGROUND WRAPPER */}
      <Section
        title="Discovery locations"
        subtitle="Places you should visit near the hotel"
        data={places}
        emptyMessage="No locations to display"
      />
      {/* ---------- TESTIMONIALS ---------- */}
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "80px 64px",
          textAlign: "center",
          backgroundImage:
            'url("https://shac.vn/wp-content/uploads/2024/10/thiet-ke-sanh-khach-san-dep-dang-cap-cung-son-ha-group-2-800x600.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay (similar to the provided design) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(2px)",
            zIndex: 0,
          }}
        ></div>

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 1, color: "white" }}>
          <Title level={1} style={{ color: "white" }}>
            CUSTOMER REVIEWS & RATINGS
          </Title>

          <Paragraph
            style={{ maxWidth: 600, margin: "0 auto 64px", color: "#f1f1f1" }}
          >
            "Hear experiences from our valued guests"
          </Paragraph>

          <Row gutter={[24, 24]} justify="center">
            {testimonials.length === 0 ? (
              <Empty description="No reviews yet" />
            ) : (
              testimonials.map((item: any) => (
                <Col xs={24} sm={12} lg={8} key={item.id}>
                  <Card
                    styles={{ body: { textAlign: "center" } }}
                    style={{
                      backdropFilter: "blur(6px)",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "white",
                    }}
                  >
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
                      <Title level={5} style={{ color: "white" }}>
                        {item.name}
                      </Title>
                      <Text style={{ color: "#e0e0e0" }}>{item.address}</Text>
                      <Rate disabled defaultValue={item.rating} />
                      <Paragraph style={{ color: "#ddd" }}>
                        "{item.review}"
                      </Paragraph>
                    </Space>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
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
