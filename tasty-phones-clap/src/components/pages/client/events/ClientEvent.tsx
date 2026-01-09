import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Card, Spin, Empty, Tag, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { CalendarOutlined, ArrowRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../../../../providers/data/axiosConfig";

import "./ClientEvent.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Paragraph, Text } = Typography;

interface EventType {
  id: number;
  title: string;
  description: string;
  banner: string;
  start_date: string;
  end_date: string;
  is_active: number;
}

const BASE_IMAGE_URL = "http://localhost:8000/storage/";

export const ClientEvent: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events");
        setEvents(res.data.data || []);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleViewDetails = (eventId: number) => {
    navigate(`/client/events/${eventId}`);
    window.scrollTo(0, 0);
  };

  const activeEvents = events.filter((e) => e.is_active === 1);

  return (
    <div
      className="client-events-container"
      style={{ backgroundColor: "#f9fbfd", minHeight: "100vh" }}
    >
      {/* ================= HERO ================= */}
      <div
        className="events-hero-banner"
        style={{ height: "400px", position: "relative" }}
      >
        <div
          className="hero-overlay"
          style={{ background: "rgba(0,0,0,0.4)" }}
        />
        <div className="hero-content">
          <h1
            className="hero-title"
            style={{
              fontSize: "56px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Grand Events
          </h1>
          <Text style={{ color: "#fff", fontSize: "18px", opacity: 0.9 }}>
            Crafting unforgettable moments and professional gatherings
          </Text>
        </div>
      </div>

      {/* ================= EVENTS SECTION ================= */}
      <section
        style={{ maxWidth: "1300px", margin: "0 auto", padding: "80px 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title
            level={2}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 42,
              marginBottom: 16,
            }}
          >
            Our Special Events
          </Title>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "#8a6e5b",
              margin: "0 auto 20px",
            }}
          ></div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px" }}>
            <Spin size="large" tip="Loading events..." />
          </div>
        ) : activeEvents.length === 0 ? (
          <Empty description="No events scheduled at the moment" />
        ) : (
          <Row gutter={[32, 40]}>
            {activeEvents.map((event) => (
              <Col xs={24} sm={12} lg={8} key={event.id}>
                <Card
                  hoverable
                  onClick={() => handleViewDetails(event.id)}
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
                    height: "100%", // Quan trọng: Chiều cao card chiếm hết Col
                  }}
                  bodyStyle={{
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    height: "520px", // Cố định tổng chiều cao của Card nội dung
                  }}
                >
                  {/* 1. IMAGE AREA - FIXED HEIGHT */}
                  <div
                    style={{ height: 220, overflow: "hidden", flexShrink: 0 }}
                  >
                    <img
                      src={`${BASE_IMAGE_URL}${event.banner}`}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800";
                      }}
                    />
                  </div>

                  {/* 2. CONTENT AREA */}
                  <div
                    style={{
                      padding: "24px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Time & Date */}
                    <Space
                      style={{
                        marginBottom: 12,
                        color: "#8a6e5b",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      <CalendarOutlined />
                      {dayjs(event.start_date).format("MMM DD")} -{" "}
                      {dayjs(event.end_date).format("MMM DD, YYYY")}
                    </Space>

                    {/* Title - Fixed height for 2 lines */}
                    <Title
                      level={4}
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 20,
                        marginBottom: 12,
                        color: "#1a1a1a",
                        height: "56px", // Cố định chiều cao cho tiêu đề (khoảng 2 dòng)
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {event.title}
                    </Title>

                    {/* Description - Fixed height for 3 lines */}
                    <div
                      style={{
                        height: "66px", // Cố định chiều cao cho mô tả (khoảng 3 dòng)
                        marginBottom: "20px",
                        overflow: "hidden",
                      }}
                    >
                      <Paragraph
                        ellipsis={{ rows: 3 }}
                        style={{
                          color: "#666",
                          fontSize: 14,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {event.description}
                      </Paragraph>
                    </div>

                    {/* Footer Action - Pushed to the bottom */}
                    <div
                      style={{
                        marginTop: "auto",
                        paddingTop: 20,
                        borderTop: "1px solid #f0f0f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8a6e5b",
                          fontWeight: 700,
                          fontSize: 12,
                          letterSpacing: 1,
                        }}
                      >
                        VIEW DETAILS
                      </Text>
                      <ArrowRightOutlined style={{ color: "#8a6e5b" }} />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </div>
  );
};

export default ClientEvent;
