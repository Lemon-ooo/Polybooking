import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Card, Row, Col, Divider } from "antd";

import "../../../../../src/assets/fonts/fonts.css";

const { Title, Paragraph, Text } = Typography;

interface EventType {
  event_id: number;
  event_name: string;
  description: string;
  event_image: string;
  start_date: string;
  end_date: string;
}

/* =======================
   FAKE DATA
======================= */
const fakeEvents: EventType[] = [
  {
    event_id: 1,
    event_name: "Luxury Wedding Ceremony",
    description:
      "An elegant wedding event with premium decoration, lighting, music and full-service planning. Every detail is carefully designed to create unforgettable memories for your special day. Our luxury wedding package includes professional coordination, bespoke styling, gourmet catering, and a stunning venue ambiance.",
    event_image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600",
    start_date: "2026-02-10",
    end_date: "2026-02-11",
  },
  {
    event_id: 2,
    event_name: "Corporate Business Meeting",
    description:
      "A professional environment for meetings, conferences, and corporate events. Equipped with modern technology, flexible seating arrangements, and premium services to ensure a productive and successful business experience.",
    event_image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600",
    start_date: "2026-03-05",
    end_date: "2026-03-05",
  },
  {
    event_id: 3,
    event_name: "Annual Gala Dinner",
    description:
      "A prestigious gala dinner featuring fine dining, live entertainment, elegant decor, and an exclusive guest list. Perfect for celebrations, charity events, and high-profile social gatherings.",
    event_image:
      "https://ngununggula.com/img/asset/YXNzZXRzL2FydGlzdHMvMjUwNV9uZ3VudW5nZ3VsYV9nYWxhX3I1Xy03MzU4LWVuaGFuY2VkLW5yLmpwZw==?w=2000&h=950&fit=crop&s=83007eaa696c46ce8da0d70cf5c1a36b",
    start_date: "2026-04-18",
    end_date: "2026-04-18",
  },
];

export const ClientEventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = fakeEvents.find(
    (e) => e.event_id === Number(id)
  );

  if (!event) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        <Text>Event not found</Text>
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
          src={event.event_image}
          alt={event.event_name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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
            {event.event_name}
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
