import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Typography, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const BASE_URL = "http://localhost:8000/storage/";

export const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(`/room-types/${id}`);
      setRoom(res.data.data);
    };
    fetchData();
  }, [id]);

  if (!room) return <div>Loading...</div>;

  const images =
    room._newImages && room._newImages.length > 0
      ? room._newImages
      : room.images && room.images.length > 0
      ? room.images.map((img: any) => BASE_URL + img.image_url)
      : [BASE_URL + room.room_type_image];

  return (
    <div style={{ width: "100%", background: "#fff", fontFamily: "serif" }}>
      {/* ================== HERO BANNER ================== */}
      <div className="rooms-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Rooms & Suites Detail</h1>
        </div>
      </div>

      {/* TITLE */}
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <Title
          style={{
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: 0.5,
            color: "#333",
          }}
        >
          {room.room_type_name}
        </Title>

        {/* ICON LIST */}
        <div
          style={{
            marginTop: 25,
            display: "flex",
            justifyContent: "center",
            gap: 90,
            flexWrap: "wrap",
            color: "#5b5b5b",
            fontSize: 16,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>🧑‍🤝‍🧑</div>
            {room.max_guests} guests
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>💵</div>
            {Number(room.base_price).toLocaleString("vi-VN")} VND / night
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>📶</div>
            Free wifi
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>❄️</div>
            Air conditioner
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <div style={{ width: "70%", margin: "60px auto" }}>
        <Row gutter={50}>
          <Col span={12}>
            <Paragraph
              style={{
                fontSize: 18,
                lineHeight: 1.9,
                color: "#555",
                letterSpacing: 0.2,
              }}
            >
              {room.description}
            </Paragraph>

            <div
              style={{
                marginTop: 35,
                lineHeight: 2.2,
                fontSize: 18,
                color: "#444",
              }}
            >
              <div>📐 Room Size: 35 – 45 sqm</div>
              <div>🌇 Basic city view</div>
              <div>🛏️ 1 King-size or 2 Twin beds</div>
              <div>🛁 Private bathroom with shower</div>
            </div>

            <button
              style={{
                marginTop: 35,
                padding: "12px 30px",
                background: "#a8765a",
                color: "#fff",
                border: "none",
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: 0.4,
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              BOOK NOW
            </button>
          </Col>

          <Col span={12}>
            <img
              src={images[0]}
              style={{
                width: "100%",
                height: "430px",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 18,
                overflowX: "auto",
                paddingBottom: 6,
              }}
            >
              {images.map((url: string, idx: number) => (
                <img
                  key={idx}
                  src={url}
                  style={{
                    width: 110,
                    height: 75,
                    objectFit: "cover",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "0.25s",
                    border:
                      idx === 0 ? "3px solid #a8765a" : "2px solid transparent",
                  }}
                  onClick={() => {
                    const newOrder = [...images];
                    const selected = newOrder.splice(idx, 1)[0];
                    newOrder.unshift(selected);
                    setRoom((prev: any) => ({
                      ...prev,
                      _newImages: newOrder,
                    }));
                  }}
                />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
