// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Typography, Row, Col, Button, Empty, Carousel } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  WifiOutlined,
  CoffeeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./RoomDetail.css";

const { Title, Paragraph } = Typography;
const BASE_URL = "http://localhost:8000/storage/";

export const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/room-types/${id}`);
        const data = res.data.data || res.data;
        setRoom(data);
      } catch (err) {
        console.error("Error loading room details:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!room) {
    return (
      <div style={{ textAlign: "center", padding: "120px", fontSize: "20px" }}>
        Loading...
      </div>
    );
  }

  const roomImageOnly = `${BASE_URL}${room.room_type_image}`;

  const amenitiesList =
    room.amenities && room.amenities.length > 0 ? room.amenities : [];

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

      {/* Quick features */}
      <div className="room-features-grid">
        <div className="feature-box">
          <span className="icon"><UserOutlined /></span>
          <div className="text">{room.max_guests} Guests</div>
        </div>
        <div className="feature-box">
          <span className="icon"><DollarOutlined /></span>
          <div className="text">
            {Number(room.base_price).toLocaleString("en-US")} $ / night
          </div>
        </div>
        <div className="feature-box">
          <span className="icon"><WifiOutlined /></span>
          <div className="text">Free Wi-Fi</div>
        </div>
        <div className="feature-box">
          <span className="icon"><CoffeeOutlined /></span>
          <div className="text">Buffet Breakfast</div>
        </div>
      </div>

      {/* Description + Room images */}
      <div className="room-overview">
        <Row gutter={[40, 40]} align="top">
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Paragraph className="room-info-text">
              {room.description ||
                "Comfortable single room, suitable for business travelers or short stays."}
            </Paragraph>

            <div className="room-highlight-list">
              <div>Spacious room from 35 – 45 m²</div>
              <div>City or garden view</div>
              <div>King-size bed or 2 single beds</div>
              <div>Private bathroom with standing shower</div>
            </div>

            <Button className="book-now-btn" size="large">
              BOOK NOW
            </Button>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            {/* Auto-playing slideshow */}
            <Carousel
              autoplay
              autoplaySpeed={2000}
              effect="fade"
              dots={{ className: "custom-dots" }}
              arrows
              prevArrow={<div className="custom-arrow prev"><LeftOutlined /></div>}
              nextArrow={<div className="custom-arrow next"><RightOutlined /></div>}
            >
              {/* Main image */}
              <div className="room-slide">
                <img src={`${BASE_URL}${room.room_type_image}`} alt={room.room_type_name} />
              </div>

              {/* Sample additional images - replace with real ones when backend supports gallery */}
              <div className="room-slide">
                <img src="https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=1200" alt="Room view" />
              </div>
              <div className="room-slide">
                <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200" alt="Bed detail" />
              </div>
              <div className="room-slide">
                <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200" alt="Bathroom" />
              </div>
              <div className="room-slide">
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200" alt="Balcony" />
              </div>
            </Carousel>
          </Col>
        </Row>
      </div>

      {/* ==================== INCLUDED AMENITIES SECTION ==================== */}
      <div className="included-amenities-section">
        <h2 className="included-amenities-title">Included Amenities</h2>

        {amenitiesList.length === 0 ? (
          <Empty description="No amenities listed yet" style={{ margin: "80px 0" }} />
        ) : (
          <div className="included-amenities-grid">
            {amenitiesList.map((am: any) => (
              <div className="included-amenity-card" key={am.amenity_id}>
                <div className="amenity-image-wrapper">
                  <img
                    src={`${BASE_URL}${am.amenity_image}`}
                    alt={am.amenity_name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1582719471384-8949374d3c8b?w=600";
                    }}
                  />
                </div>
                <div className="amenity-content">
                  <h4>{am.amenity_name}</h4>
                  <p>
                    {am.description || "Premium amenity, free for all bookings"}
                  </p>
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