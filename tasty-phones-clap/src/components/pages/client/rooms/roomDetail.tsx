// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Typography, Row, Col, Button, Empty } from "antd";
import { UserOutlined, DollarOutlined, WifiOutlined, CoffeeOutlined } from "@ant-design/icons";
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

  // Tạo danh sách ảnh thumbnail (ảnh phòng + ảnh tiện nghi)
  const thumbnailImages = [
    `${BASE_URL}${room.room_type_image}`,
    ...(room.amenities || [])
      .map((a: any) => `${BASE_URL}${a.amenity_image}`)
      .filter(Boolean)
      .slice(0, 8),
  ];

  // Danh sách tiện nghi để hiển thị
  const amenitiesList = room.amenities && room.amenities.length > 0 
    ? room.amenities 
    : []; // nếu null thì để mảng rỗng

  return (
    <div className="room-detail-wrapper">
      {/* Hero */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      <div className="room-main-title">
        <h2>{room.room_type_name}</h2>
      </div>

      <div className="room-features-grid">
        <div className="feature-box"><span className="icon"><UserOutlined /></span><div className="text">{room.max_guests} khách</div></div>
        <div className="feature-box"><span className="icon"><DollarOutlined /></span><div className="text">{Number(room.base_price).toLocaleString("vi-VN")} ₫ / đêm</div></div>
        <div className="feature-box"><span className="icon"><WifiOutlined /></span><div className="text">Wi-Fi miễn phí</div></div>
        <div className="feature-box"><span className="icon"><CoffeeOutlined /></span><div className="text">Bữa sáng tự chọn</div></div>
      </div>

      <div className="room-overview">
        <Row gutter={[60, 60]}>
          <Col xs={24} lg={12}>
            <Paragraph className="room-info-text">{room.description || "Phòng được thiết kế sang trọng với đầy đủ tiện nghi hiện đại."}</Paragraph>

            <div className="room-highlight-list">
              <div>Phòng rộng rãi từ 35 – 45 m²</div>
              <div>Tầm nhìn thành phố hoặc vườn</div>
              <div>Giường King-size hoặc 2 giường đơn</div>
              <div>Phòng tắm riêng với vòi sen đứng</div>
            </div>

            <Button className="book-now-btn" size="large">
              BOOK NOW
            </Button>
          </Col>

          <Col xs={24} lg={12}>
            <div className="room-image-main">
              <img src={mainImage} alt={room.room_type_name} />
            </div>

            <div className="room-thumbnails">
              {thumbnailImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`thumb ${idx + 1}`}
                  className={url === mainImage ? "active" : ""}
                  onClick={() => setMainImage(url)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618776188272-8c596a1f85b8?w=800";
                  }}
                />
              ))}
            </div>
          </Col>
        </Row>
      </div>

      {/* PHẦN TIỆN NGHI – ĐÃ SỬA ĐẸP + KHÔNG LỖI NỮA */}
    {/* PHẦN TIỆN NGHI ĐI KÈM - SIÊU ĐẸP */}
<div className="included-amenities-section">
  <h2 className="included-amenities-title">Tiện Nghi Đi Kèm</h2>

  <div className="included-amenities-grid">
    {amenitiesList.map((am: any) => (
      <div className="included-amenity-card" key={am.amenity_id}>
        <img 
          src={`${BASE_URL}${am.amenity_image}`}
          alt={am.amenity_name}
          className="included-amenity-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1582719471384-8949374d3c8b?w=600";
          }}
        />
        <h4>{am.amenity_name}</h4>
        <p>{am.description || "Tiện nghi cao cấp, miễn phí cho mọi đặt phòng"}</p>
      </div>
    ))}
  </div>

  {/* Nếu không có tiện nghi nào thì vẫn đẹp */}
  {amenitiesList.length === 0 && (
    <Empty description="Chưa có tiện nghi đi kèm" style={{ margin: "60px 0" }} />
  )}
</div>
    </div>
  );
};

export default RoomDetail;