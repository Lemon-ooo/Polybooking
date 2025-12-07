import React from "react";
import { useTable } from "@refinedev/antd";
import { Row, Col, Typography, Spin, Alert, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

import { EventType } from "../../../../interfaces/eventTypes";

import "./ClientEvent.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

export const ClientEvent: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, tableQueryResult } = useTable<EventType>({
    resource: "events",
  });

  const events = tableProps?.dataSource || [];
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;
  const API_URL = "http://localhost:8000/storage/";

  const getEventImage = (event: EventType) =>
    event.event_image
      ? `${API_URL}${event.event_image}`
      : "https://images.unsplash.com/photo-1533174072545-7a46c2fe5e44?w=600&h=400&fit=crop"; // Ảnh mặc định cho sự kiện

  const handleViewDetails = (eventId: number) => {
    navigate(`/client/events/${eventId}`);
    window.scrollTo(0, 0);
  };

  if (isError) {
    return (
      <div style={{ padding: "80px 20px" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối đến server."}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => tableQueryResult?.refetch()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="client-events-container">
      {/* ================== HERO BANNER ================== */}
      <div className="events-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Events & Meetings</h1>
        </div>
      </div>

      {/* ================== EVENT CARDS ================== */}
      <section
        className="featured-events-section"
        style={{ padding: "40px 64px" }}
      >
        <div className="container">
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontFamily: "'Playfair Display', serif",
              fontSize: 42,
              color: "#000",
            }}
          >
            Special Events
          </Title>

          <Paragraph
            style={{
              textAlign: "center",
              marginBottom: 40,
              color: "#000",
              fontSize: 16,
            }}
          >
            We organize professional meetings and memorable events.
          </Paragraph>

          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Loading events...
              </Text>
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                No events available.
              </Text>
            </div>
          ) : (
            <Row gutter={[32, 32]} justify="center">
              {events.map((event) => (
                <Col xs={24} sm={12} md={8} lg={6} key={event.event_id}>
                  <Card
                    bodyStyle={{ padding: 0 }}
                    hoverable
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#fff",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewDetails(event.event_id)} // Click card
                  >
                    <div
                      style={{ width: "100%", height: 220, overflow: "hidden" }}
                    >
                      <img
                        src={getEventImage(event)}
                        alt={event.event_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1533174072545-7a46c2fe5e44?w=600&h=400&fit=crop")
                        }
                      />
                    </div>

                    <div style={{ padding: "20px" }}>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: "#8a6e5b",
                          fontSize: 22,
                          marginBottom: 8,
                        }}
                      >
                        {event.event_name}
                      </h3>
                      <p
                        style={{
                          color: "#444",
                          fontSize: 14,
                          lineHeight: 1.5,
                          marginBottom: 16,
                        }}
                      >
                        {event.description ||
                          "An exclusive event not to be missed."}
                      </p>

                      <div style={{ textAlign: "right" }}>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#8a6e5b",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          EVENT DETAILS
                        </button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>
    </div>
  );
};
