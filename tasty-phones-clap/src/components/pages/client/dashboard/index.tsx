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
      onClick={() => console.log("Go search rooms")}
    >
      FIND ROOM
    </button>
  </div>
</section>

      {/* ====== BACKGROUND WRAPPER CHUNG ====== */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* LAYER BACKGROUND (mờ) */}
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
        {/* LAYER OVERLAY */}
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
        {/* TẤT CẢ NỘI DUNG */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* ========================================== */}
          {/* ---------- (VỊ TRÍ B) INTRO SECTION ------- */}
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
              {/* SLIDE ẢNH BÊN TRÁI */}
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

              {/* TEXT BÊN PHẢI */}
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
                  of becoming the leading Boutique hotel chain in Vietnam.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* -------------- PHẦN DƯỚI ----------------- */}
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
              {/* TEXT LEFT */}
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

              {/* SLIDE ẢNH PHẢI */}
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
                    "https://muongthanh.com/images/trademark/intro/2019/04/normal/grand_2_1554889159.jpg",
                    "https://muongthanh.com/images/trademark/intro/2019/04/normal/grand_1_1554889131.jpg",
                    "https://q-xx.bstatic.com/xdata/images/hotel/max500/572052538.jpg?k=2ecaea7ec84a8d111ce4b7aff393333d968d6087f4746925e6753cd908b9fb41&o=",
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
            style={{
              padding: "20px 64px",
            }}
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
                Tận hưởng sự sang trọng và tinh tế trong từng không gian nghỉ
                dưỡng
              </Paragraph>

              {isLoading ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                  <Text style={{ marginTop: 16, display: "block" }}>
                    Đang tải danh sách phòng...
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
                  {rooms.slice(0, 3).map((room) => (
                    <Col xs={24} md={12} lg={8} key={room.id}>
                      <Card
                        bodyStyle={{ padding: 0 }}
                        style={{
                          border: "none",
                          background: "#fff",
                          boxShadow: "none",
                        }}
                      >
                        {/* IMAGE */}
                        <div
                          style={{
                            width: "100%",
                            height: 260,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={
                              room.room_type?.image_url ||
                              room.image_url ||
                              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
                            }
                            alt={room.room_type?.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "0.4s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "scale(1.06)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "scale(1.0)")
                            }
                          />
                        </div>

                        {/* CONTENT */}
                        <div style={{ padding: "24px 28px" }}>
                          <h3
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              color: "#8a6e5b",
                              fontSize: 24,
                              marginBottom: 12,
                            }}
                          >
                            {room.room_type?.name ||
                              `Phòng ${room.room_number}`}
                          </h3>

                          <p
                            style={{
                              color: "#444",
                              fontSize: 15,
                              lineHeight: 1.6,
                              marginBottom: 24,
                            }}
                          >
                            {room.description ||
                              room.room_type?.description ||
                              "Phòng sang trọng, thiết kế tinh tế và đầy đủ tiện nghi để mang đến trải nghiệm nghỉ dưỡng hoàn hảo."}
                          </p>

                          <div style={{ textAlign: "right" }}>
                            <button
                              onClick={() =>
                                navigate(`/client/rooms/${room.id}`)
                              }
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#8a6e5b",
                                fontSize: 14,
                                fontWeight: 600,
                                letterSpacing: 1,
                                cursor: "pointer",
                                textTransform: "uppercase",
                                transition: "0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#6b4e3d")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#8a6e5b")
                              }
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

          <section style={{ padding: "80px 64px" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Title
                level={2}
                style={{
                  fontSize: "36px",
                  fontWeight: 600,
                  color: "#e6d0c4",
                  marginBottom: "16px",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Dịch vụ nổi bật
              </Title>
              <Paragraph
                style={{
                  fontSize: "16px",
                  color: "#e6d0c4",
                  maxWidth: "640px",
                  margin: "0 auto",
                }}
              >
                Trải nghiệm những dịch vụ được yêu thích nhất tại khách sạn của
                chúng tôi.
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
                        <div
                          style={{ position: "relative", overflow: "hidden" }}
                        >
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
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
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
                          onClick={() =>
                            navigate(`/client/services/${service.id}`)
                          }
                          style={{
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
        </div>{" "}
        {/* END CONTENT WRAPPER */}
      </div>{" "}
      {/* END BACKGROUND WRAPPER */}
      <Section
        title="Địa điểm khám phá"
        subtitle="Những nơi bạn nên đến gần khách sạn"
        data={places}
        emptyMessage="Không có địa điểm nào để hiển thị"
      />
      {/* ---------- TESTIMONIALS ---------- */}
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "80px 64px",
          textAlign: "center",
          backgroundImage:
            'url("https://kimfurniture.com/wp-content/uploads/2022/10/phong-khach-mau-xam-13.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay đen làm mờ (giống đúng hình bạn đưa) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.55)", // độ mờ
            backdropFilter: "blur(2px)", // thêm độ blur giống mẫu
            zIndex: 0,
          }}
        ></div>

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 1, color: "white" }}>
          <Title level={1} style={{ color: "white" }}>
            BÌNH LUẬN & ĐÁNH GIÁ KHÁCH HÀNG
          </Title>

          <Paragraph
            style={{ maxWidth: 600, margin: "0 auto 64px", color: "#f1f1f1" }}
          >
            “Lắng nghe trải nghiệm từ những vị khách đáng mến”
          </Paragraph>

          <Row gutter={[24, 24]} justify="center">
            {testimonials.length === 0 ? (
              <Empty description="Chưa có đánh giá nào" />
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
