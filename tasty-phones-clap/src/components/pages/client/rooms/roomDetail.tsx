// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Typography, Row, Col, Button, Empty, Carousel, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import {
  UserOutlined,
  DollarOutlined,
  WifiOutlined,
  CoffeeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./RoomDetail.css";

const { Paragraph } = Typography;
const BASE_URL = "http://localhost:8000/storage/";

export const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);
  const [roomImages, setRoomImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/room-types/${id}`);
        const data = res.data.data || res.data;
        setRoom(data);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomImages = async () => {
      if (!id) return;
      try {
        setLoadingImages(true);
        const res = await axiosInstance.get(`/room-types/${id}/images`, {
          params: { per_page: 50 },
        });
        setRoomImages(res.data.data || []);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchRoomData();
    fetchRoomImages();
  }, [id]);

  if (loading)
    return <div className="loading-page">Loading room details...</div>;
  if (!room) return <div className="loading-page">Room not found.</div>;

  const amenitiesList = Array.isArray(room.amenities) ? room.amenities : [];

  const carouselImages: string[] = [];

  if (room?.room_type_image) carouselImages.push(room.room_type_image);
  roomImages.forEach((img) => {
    if (img.image_url && img.image_url !== room.room_type_image) {
      carouselImages.push(img.image_url);
    }
  });

  return (
    <div className="room-detail-wrapper">
      {/* Banner giữ nguyên */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites</h1>
        </div>
      </div>

      <div className="room-main-title">
        <h2>{room.room_type_name}</h2>
      </div>

      {/* Features */}
      <div className="room-features-grid">
        <div className="feature-box">
          <span className="icon">
            <UserOutlined />
          </span>
          <div className="text">{room.max_guests} Guests</div>
        </div>
        <div className="feature-box">
          <span className="icon">
            <DollarOutlined />
          </span>
          <div className="text">
            {Number(room.base_price).toLocaleString("en-US")} $ / night
          </div>
        </div>
        <div className="feature-box">
          <span className="icon">
            <WifiOutlined />
          </span>
          <div className="text">Free Wi-Fi</div>
        </div>
        <div className="feature-box">
          <span className="icon">
            <CoffeeOutlined />
          </span>
          <div className="text">Buffet Breakfast</div>
        </div>
      </div>

      {/* Overview */}
      <div className="room-overview">
        <Row gutter={[40, 40]} align="top">
          <Col xs={24} lg={12}>
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

            <Button
              className="book-now-btn"
              size="large"
              onClick={() => {
                navigate("/client/bookings");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              BOOK NOW
            </Button>
          </Col>

          <Col xs={24} lg={12}>
            {loadingImages ? (
              <div className="carousel-loading">
                <Spin size="large" />
              </div>
            ) : carouselImages.length > 0 ? (
              <Carousel
                autoplay
                autoplaySpeed={3000}
                effect="fade"
                dots={{ className: "custom-dots" }}
                arrows
                prevArrow={
                  <div className="custom-arrow prev">
                    <LeftOutlined />
                  </div>
                }
                nextArrow={
                  <div className="custom-arrow next">
                    <RightOutlined />
                  </div>
                }
              >
                {carouselImages.map((imageUrl, idx) => (
                  <div className="room-slide" key={idx}>
                    <img
                      src={`${BASE_URL}${imageUrl}`}
                      alt={`${room.room_type_name}-${idx}`}
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <Empty description="No images available" />
            )}
          </Col>
        </Row>
      </div>

      {/* Amenities */}
      <div className="included-amenities-section">
        <h2 className="included-amenities-title">Included Amenities</h2>

        {amenitiesList.length === 0 ? (
          <Empty description="No amenities listed yet" />
        ) : (
          <div className="included-amenities-grid">
            {amenitiesList.map((am: any) => (
              <div className="included-amenity-card" key={am.amenity_id}>
                <div className="amenity-image-wrapper">
                  <img
                    src={`${BASE_URL}${am.amenity_image}`}
                    alt={am.amenity_name}
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
