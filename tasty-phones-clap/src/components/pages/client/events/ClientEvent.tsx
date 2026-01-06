import React from "react";
import { Row, Col, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";

import "./ClientEvent.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Paragraph } = Typography;

/* =======================
   EVENT TYPE
======================= */
interface EventType {
  event_id: number;
  event_name: string;
  description: string;
  event_image: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

/* =======================
   FAKE EVENTS (6 ITEMS)
======================= */
const fakeEvents: EventType[] = [
  {
    event_id: 1,
    event_name: "Luxury Wedding Ceremony",
    description:
      "Elegant wedding event with premium decoration and services.",
    event_image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800",
    start_date: "2026-02-10",
    end_date: "2026-02-11",
    is_active: true,
  },
  {
    event_id: 2,
    event_name: "Corporate Business Meeting",
    description:
      "Professional meeting space with modern conference facilities.",
    event_image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    start_date: "2026-03-05",
    end_date: "2026-03-05",
    is_active: true,
  },
  {
    event_id: 3,
    event_name: "Annual Gala Dinner",
    description:
      "Classy gala dinner with fine dining and live entertainment.",
    event_image:
      "https://ngununggula.com/img/asset/YXNzZXRzL2FydGlzdHMvMjUwNV9uZ3VudW5nZ3VsYV9nYWxhX3I1Xy03MzU4LWVuaGFuY2VkLW5yLmpwZw==?w=2000&h=950&fit=crop&s=83007eaa696c46ce8da0d70cf5c1a36b",
    start_date: "2026-04-18",
    end_date: "2026-04-18",
    is_active: true,
  },
  {
    event_id: 4,
    event_name: "Luxury Birthday Party",
    description:
      "Private birthday celebration with custom themes.",
    event_image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
    start_date: "2026-05-12",
    end_date: "2026-05-12",
    is_active: true,
  },
  {
    event_id: 5,
    event_name: "Product Launch Event",
    description:
      "Impressive product launch with media coverage.",
    event_image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
    start_date: "2026-06-02",
    end_date: "2026-06-02",
    is_active: true,
  },
  {
    event_id: 6,
    event_name: "Private Cocktail Party",
    description:
      "Exclusive cocktail party with elegant atmosphere.",
    event_image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800",
    start_date: "2026-07-20",
    end_date: "2026-07-20",
    is_active: true,
  },
];

export const ClientEvent: React.FC = () => {
  const navigate = useNavigate();

  const events = fakeEvents.filter((e) => e.is_active);

  const handleViewDetails = (eventId: number) => {
    navigate(`/client/events/${eventId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="client-events-container">
      {/* HERO */}
      <div className="events-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Events & Meetings</h1>
        </div>
      </div>

      {/* EVENTS */}
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

        <Row gutter={[24, 24]} justify="center">
          {events.map((event) => (
            <Col xs={24} sm={12} md={8} key={event.event_id}>
              <Card
                hoverable
                onClick={() => handleViewDetails(event.event_id)}
                bodyStyle={{
                  padding: 0,
                  height: 320, // 👈 SMALLER CARD
                  display: "flex",
                  flexDirection: "column",
                }}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                }}
              >
                {/* IMAGE */}
                <div style={{ height: 180, overflow: "hidden" }}>
                  <img
                    src={event.event_image}
                    alt={event.event_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
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
                      {event.event_name}
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
      </section>
    </div>
  );
};
