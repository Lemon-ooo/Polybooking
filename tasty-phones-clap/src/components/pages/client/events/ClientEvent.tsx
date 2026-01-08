import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Card, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";

import "./ClientEvent.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Paragraph } = Typography;

/* =======================
   EVENT TYPE (API)
======================= */
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

  /* =======================
     FETCH EVENTS
  ======================= */
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
    <div className="client-events-container">
      {/* ================= HERO ================= */}
      <div className="events-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Events & Meetings</h1>
        </div>
      </div>

      {/* ================= EVENTS ================= */}
      <section style={{ padding: "40px 56px" }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            fontFamily: "'Playfair Display', serif",
            fontSize: 38,
            marginBottom: 8,
          }}
        >
          Special Events
        </Title>

        <Paragraph
          style={{
            textAlign: "center",
            marginBottom: 40,
            fontSize: 15,
          }}
        >
          Professional meetings & memorable experiences.
        </Paragraph>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", margin: "80px 0" }}>
            <Spin size="large" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && activeEvents.length === 0 && (
          <Empty description="No events available" />
        )}

        {/* LIST */}
        {!loading && activeEvents.length > 0 && (
          <Row gutter={[24, 24]} justify="center">
            {activeEvents.map((event) => (
              <Col xs={24} sm={12} md={8} key={event.id}>
                <Card
                  hoverable
                  onClick={() => handleViewDetails(event.id)}
                  bodyStyle={{
                    padding: 0,
                    height: 320,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                    cursor: "pointer",
                  }}
                >
                  {/* IMAGE */}
                  <div style={{ height: 180, overflow: "hidden" }}>
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
                          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800";
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div
                    style={{
                      padding: 16,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 20,
                          color: "#8a6e5b",
                          marginBottom: 8,
                        }}
                      >
                        {event.title}
                      </h3>

                      <p
                        style={{
                          fontSize: 13,
                          color: "#555",
                          lineHeight: 1.6,
                        }}
                      >
                        {event.description}
                      </p>
                    </div>

                    <div style={{ textAlign: "right", marginTop: 12 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#8a6e5b",
                          letterSpacing: 1,
                        }}
                      >
                        VIEW DETAILS →
                      </span>
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
