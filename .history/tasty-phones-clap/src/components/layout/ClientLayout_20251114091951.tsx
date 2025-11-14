import React from "react";
import { Button, Col, Row, Typography, Space } from "antd";
import { Link } from "react-router-dom";
// @ts-ignore
import { assets } from "../../assets/assets";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  const heroStyle: React.CSSProperties = {
    position: "relative",
    height: "100vh",
    minHeight: "700px",
    background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${
      assets.heroBg ||
      "https://images.unsplash.com/photo-1611892441792-ae6af465f0f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"
    })`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  };

  const goldAccent = "#c9a96e";
  const darkGold = "#b8934b";
  const textWhite = "#ffffff";
  const lightText = "#f8f8f8";

  return (
    <section style={heroStyle}>
      {/* Gold Overlay Effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, rgba(201, 169, 110, 0.1), transparent, rgba(0, 0, 0, 0.4))",
          pointerEvents: "none",
        }}
      />

      {/* Decorative Gold Line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, transparent, ${goldAccent}, transparent)`,
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 80px",
          width: "100%",
        }}
      >
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={14}>
            <Space direction="vertical" size={32} style={{ width: "100%" }}>
              {/* Welcome Text */}
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  background: "rgba(201, 169, 110, 0.1)",
                  border: `1px solid ${goldAccent}`,
                  borderRadius: "2px",
                  color: goldAccent,
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  backdropFilter: "blur(8px)",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Welcome to Luxury
              </div>

              {/* Main Title */}
              <Title
                level={1}
                style={{
                  margin: 0,
                  fontSize: "5rem",
                  fontWeight: 400,
                  color: textWhite,
                  lineHeight: 1.1,
                  letterSpacing: "2px",
                  fontFamily:
                    "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "1.8rem",
                    fontWeight: 300,
                    letterSpacing: "8px",
                    marginBottom: "16px",
                    color: goldAccent,
                  }}
                >
                  Hotel Deluxe
                </span>
                Experience
                <br />
                <span
                  style={{
                    color: goldAccent,
                    fontWeight: 500,
                    fontStyle: "italic",
                  }}
                >
                  Timeless
                </span>{" "}
                Elegance
              </Title>

              {/* Divider */}
              <div
                style={{
                  width: "80px",
                  height: "2px",
                  background: goldAccent,
                  margin: "24px 0",
                }}
              />

              {/* Subtitle */}
              <Paragraph
                style={{
                  fontSize: "1.1rem",
                  color: lightText,
                  lineHeight: 1.8,
                  maxWidth: "500px",
                  margin: "0 0 40px",
                  fontWeight: 300,
                  letterSpacing: "0.5px",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Discover a sanctuary of sophistication where heritage meets
                modern luxury. Each moment is crafted to perfection in our
                exquisite hotel.
              </Paragraph>

              {/* CTA Buttons */}
              <Space size={20}>
                <Link to="/client/rooms">
                  <Button
                    size="large"
                    style={{
                      height: 54,
                      padding: "0 40px",
                      fontSize: "14px",
                      fontWeight: 500,
                      background: goldAccent,
                      color: "#000",
                      border: "none",
                      borderRadius: "0px",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      transition: "all 0.3s ease",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = darkGold;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = goldAccent;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Book Your Stay
                  </Button>
                </Link>

                <Link to="/client/services">
                  <Button
                    size="large"
                    style={{
                      height: 54,
                      padding: "0 40px",
                      fontSize: "14px",
                      fontWeight: 500,
                      background: "transparent",
                      color: textWhite,
                      border: `1px solid ${goldAccent}`,
                      borderRadius: "0px",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      transition: "all 0.3s ease",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = goldAccent;
                      e.currentTarget.style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = textWhite;
                    }}
                  >
                    Explore Services
                  </Button>
                </Link>
              </Space>

              {/* Contact Info */}
              <div style={{ marginTop: "48px" }}>
                <div
                  style={{
                    color: goldAccent,
                    fontSize: "14px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  For Reservations
                </div>
                <div
                  style={{
                    color: textWhite,
                    fontSize: "18px",
                    fontWeight: 300,
                    letterSpacing: "1px",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  +1 (555) 123-4567
                </div>
              </div>
            </Space>
          </Col>

          {/* Right Side - Featured Room Preview */}
          <Col xs={0} lg={10}>
            <div
              style={{
                position: "relative",
                height: "500px",
                background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: `1px solid ${goldAccent}`,
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  color: goldAccent,
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Featured Suite
              </div>
              <div
                style={{
                  color: textWhite,
                  fontSize: "24px",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "15px",
                }}
              >
                Presidential Suite
              </div>
              <div
                style={{
                  color: lightText,
                  fontSize: "14px",
                  marginBottom: "20px",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Starting from $899/night
              </div>
              <Button
                type="text"
                style={{
                  color: goldAccent,
                  padding: 0,
                  height: "auto",
                  fontSize: "13px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = textWhite;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = goldAccent;
                }}
              >
                View Details →
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Scroll Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#999",
          fontSize: "12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        <div style={{ marginBottom: "10px" }}>Scroll to Discover</div>
        <div
          style={{
            color: goldAccent,
            fontSize: "18px",
            animation: "bounce 2s infinite",
          }}
        >
          ↓
        </div>
      </div>

      {/* Social Media Links */}
      <div
        style={{
          position: "absolute",
          left: "40px",
          bottom: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {["Facebook", "Instagram", "Twitter"].map((social) => (
          <a
            key={social}
            href="#"
            style={{
              color: "#999",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "color 0.3s ease",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = goldAccent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#999";
            }}
          >
            {social}
          </a>
        ))}
      </div>

      {/* Location */}
      <div
        style={{
          position: "absolute",
          right: "40px",
          bottom: "40px",
          textAlign: "right",
        }}
      >
        <div
          style={{
            color: goldAccent,
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "5px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Location
        </div>
        <div
          style={{
            color: lightText,
            fontSize: "14px",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          123 Luxury Avenue
          <br />
          Metropolitan City
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </section>
  );
};
