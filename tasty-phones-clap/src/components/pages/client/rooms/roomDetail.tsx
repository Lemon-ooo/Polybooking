// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Typography, Row, Col, Button, Empty, Carousel, Spin } from "antd";
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
  const [roomImages, setRoomImages] = useState<any[]>([]); // Ảnh từ RoomTypeImage (main + secondary)
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/room-types/${id}`);
        const data = res.data.data || res.data;
        setRoom(data);
      } catch (err) {
        console.error("Error loading room details:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomImages = async () => {
      if (!id) return;
      try {
        setLoadingImages(true);
        const res = await axiosInstance.get(`/room-types/${id}/images`, {
          params: { per_page: 50 }, // Lấy đủ ảnh, không cần phân trang ở client
        });
        // Backend trả về { data: [...], total: ... } do paginate
        const images = res.data.data || [];
        setRoomImages(images);
        console.log("Room Images API:", res.data);

      } catch (err) {
        console.error("Error loading room images:", err);
        setRoomImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchRoomData();
    fetchRoomImages();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "120px", fontSize: "20px" }}>
        Loading room details...
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ textAlign: "center", padding: "120px", fontSize: "20px", color: "#999" }}>
        Room not found.
      </div>
    );
  }

  const amenitiesList = room.amenities && room.amenities.length > 0 ? room.amenities : [];

  // Xây dựng danh sách ảnh cho carousel
  // Ưu tiên: ảnh từ RoomTypeImage (đã được backend sort: main trước, rồi secondary theo sort_order)
  // Nếu không có ảnh nào trong RoomTypeImage → fallback về ảnh chính từ room_type_image
 const carouselImages: string[] = [];

if (room && room.room_type_image) {
  carouselImages.push(room.room_type_image);
}

if (roomImages && roomImages.length > 0) {
  for (let i = 0; i < roomImages.length; i++) {
    const img = roomImages[i];
    if (
      img &&
      img.image_url &&
      img.image_url !== room?.room_type_image
    ) {
      carouselImages.push(img.image_url);
    }
  }
}


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
            {loadingImages ? (
              <div style={{ height: "620px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spin size="large" />
              </div>
            ) : carouselImages.length > 0 ? (
              <Carousel
                autoplay
                autoplaySpeed={3000}
                effect="fade"
                dots={{ className: "custom-dots" }}
                arrows
                prevArrow={<div className="custom-arrow prev"><LeftOutlined /></div>}
                nextArrow={<div className="custom-arrow next"><RightOutlined /></div>}
              >
                {carouselImages.map((imageUrl: string, index: number) => (
                  <div className="room-slide" key={index}>
                    <img
                      src={`${BASE_URL}${imageUrl}`}
                      alt={`${room.room_type_name} - Image ${index + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200";
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No images available for this room type"
              />
            )}
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