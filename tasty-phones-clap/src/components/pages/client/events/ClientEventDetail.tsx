import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Card, Row, Col, Divider, Spin, Empty } from "antd";
import axiosInstance from "../../../../providers/data/axiosConfig";

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

export const ClientEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH EVENT DETAIL
  ======================= */
  useEffect(() => {
    if (!id) return;

    const fetchEventDetail = async () => {
      try {
        const res = await axiosInstance.get(`/events/${id}`);
        setEvent(res.data.data || res.data);
      } catch (error) {
        console.error("Error loading event detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return (
      <div style={{ padding: 120, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  /* =======================
     NOT FOUND
  ======================= */
  if (!event) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        <Empty description="Event not found" />
      </div>
    );
  }

  return (
    <>
      {/* ================== HERO IMAGE ================== */}
      <div
        style={{
          position: "relative",
          height: 480,
          width: "100%",
          overflow: "hidden",
        }}
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
              "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600";
          }}
        />

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65))",
          }}
        />

        {/* Title */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Title
            style={{
              color: "#fff",
              fontFamily: "'Playfair Display', serif",
              fontSize: 48,
              marginBottom: 8,
            }}
          >
            {event.title}
          </Title>
          <Text style={{ color: "#eee", fontSize: 16 }}>
            {event.start_date} – {event.end_date}
          </Text>
        </div>
      </div>

      {/* ================== CONTENT ================== */}
      <div style={{ padding: "64px 120px" }}>
        <Row justify="center">
          <Col xs={24} md={18} lg={14}>
            <Button
              type="link"
              onClick={() => navigate(-1)}
              style={{ padding: 0, marginBottom: 24 }}
            >
              ← Back to events
            </Button>

            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                padding: 12,
              }}
            >
              <Title
                level={3}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#8a6e5b",
                }}
              >
                Event Overview
              </Title>

              <Divider />

              <Paragraph
                style={{
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: "#444",
                }}
              >
                {event.description}
              </Paragraph>

              <Divider />

              <Row gutter={24}>
                <Col span={12}>
                  <Text strong>Start Date</Text>
                  <br />
                  <Text>{event.start_date}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>End Date</Text>
                  <br />
                  <Text>{event.end_date}</Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ClientEventDetail;
