// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Typography, Row, Col, Button, Empty, Carousel } from "antd";
import { UserOutlined, DollarOutlined, WifiOutlined, CoffeeOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./RoomDetail.css";

const { Title, Paragraph } = Typography;
const BASE_URL = "http://localhost:8000/storage/";

export const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/room-types/${id}`);
        const data = res.data.data || res.data;
        setRoom(data);
        // Chỉ dùng ảnh phòng làm ảnh chính
        setMainImage(`${BASE_URL}${data.room_type_image}`);
      } catch (err) {
        console.error("Lỗi tải chi tiết loại phòng:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!room) {
    return <div style={{ textAlign: "center", padding: "120px", fontSize: "20px" }}>Đang tải...</div>;
  }

  // CHỈ DÙNG ẢNH PHÒNG CHO THUMBNAIL (không trộn với tiện ích nữa)
  const roomImageOnly = `${BASE_URL}${room.room_type_image}`;

  // Danh sách tiện nghi
  const amenitiesList = room.amenities && room.amenities.length > 0 
    ? room.amenities 
    : [];

  return (
    <div className="room-detail-wrapper">
      {/* Hero Banner */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      <div className="room-main-title">
        <h2>{room.room_type_name}</h2>
      </div>

      {/* Các tính năng nhanh */}
      <div className="room-features-grid">
        <div className="feature-box"><span className="icon"><UserOutlined /></span><div className="text">{room.max_guests} khách</div></div>
        <div className="feature-box"><span className="icon"><DollarOutlined /></span><div className="text">{Number(room.base_price).toLocaleString("vi-VN")} ₫ / đêm</div></div>
        <div className="feature-box"><span className="icon"><WifiOutlined /></span><div className="text">Wi-Fi miễn phí</div></div>
        <div className="feature-box"><span className="icon"><CoffeeOutlined /></span><div className="text">Bữa sáng tự chọn</div></div>
      </div>

      {/* Phần mô tả + ảnh phòng */}
     <div className="room-overview">
  <Row gutter={[40, 40]} align="top">  {/* Giảm gutter một chút cho chặt chẽ hơn */}
    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
      {/* Phần text - giữ nguyên */}
      <Paragraph className="room-info-text">
        {room.description || "Phòng đơn tiện nghi, phù hợp cho khách đi công tác hoặc nghỉ ngần ngày."}
      </Paragraph>

      <div className="room-highlight-list">
        <div> Phòng rộng rãi từ 35 – 45 m²</div>
        <div> Tầm nhìn thành phố hoặc vườn</div>
        <div> Giường King-size hoặc 2 giường đơn</div>
        <div> Phòng tắm riêng với vòi sen đứng</div>
      </div>

      <Button className="book-now-btn" size="large">
        BOOK NOW
      </Button>
    </Col>

  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
  {/* Slideshow tự động chạy */}
  <Carousel 
    autoplay 
    autoplaySpeed={2000} // 4 giây chuyển ảnh
    effect="fade" // Hiệu ứng fade mượt (hoặc "scrollx" nếu muốn slide ngang)
    dots={{ className: "custom-dots" }} // Tùy chỉnh dot bên dưới
    arrows                 // ← THÊM DÒNG NÀY ĐỂ HIỆN MŨI TÊN
    prevArrow={<div className="custom-arrow prev"><LeftOutlined /></div>}
    nextArrow={<div className="custom-arrow next"><RightOutlined /></div>}
  >
    {/* Ảnh chính */}
    <div className="room-slide">
      <img src={`${BASE_URL}${room.room_type_image}`} alt={room.room_type_name} />
    </div>

    {/* Ảnh phụ mẫu - thay bằng ảnh thật khi backend có gallery */}
    <div className="room-slide">
      <img src="https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=1200" alt="View phòng" />
    </div>
    <div className="room-slide">
      <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200" alt="Chi tiết giường" />
    </div>
    <div className="room-slide">
      <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200" alt="Phòng tắm" />
    </div>
    <div className="room-slide">
      <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200" alt="Ban công" />
    </div>
    {/* Thêm bao nhiêu ảnh cũng được */}
  </Carousel>
</Col>
  </Row>
</div>

      {/* ==================== PHẦN TIỆN NGHI ĐI KÈM – SIÊU ĐẸP RIÊNG BIỆT ==================== */}
      <div className="included-amenities-section">
        <h2 className="included-amenities-title">Tiện Nghi Đi Kèm</h2>

        {amenitiesList.length === 0 ? (
          <Empty description="Chưa có tiện nghi đi kèm" style={{ margin: "80px 0" }} />
        ) : (
          <div className="included-amenities-grid">
            {amenitiesList.map((am: any) => (
              <div className="included-amenity-card" key={am.amenity_id}>
                <div className="amenity-image-wrapper">
                  <img
                    src={`${BASE_URL}${am.amenity_image}`}
                    alt={am.amenity_name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1582719471384-8949374d3c8b?w=600";
                    }}
                  />
                </div>
                <div className="amenity-content">
                  <h4>{am.amenity_name}</h4>
                  <p>{am.description || "Tiện nghi cao cấp, miễn phí cho mọi đặt phòng"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetail;