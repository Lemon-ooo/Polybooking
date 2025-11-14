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
    minHeight: "600px",
    background: `linear-gradient(135deg, rgba(10,10,10,0.95), rgba(26,26,26,0.9)), url(${
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

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, rgba(212, 175, 55, 0.08), transparent, rgba(0, 0, 0, 0.6))",
    pointerEvents: "none",
  };

  const goldAccent = "#d4af37";
  const textWhite = "#ffffff";

  return (
    <section style={heroStyle}>
      <div style={overlayStyle} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 64px",
          width: "100%",
        }}
      >
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* Tagline */}
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 20px",
                  background: "rgba(212, 175, 55, 0.15)",
                  border: `1px solid ${goldAccent}`,
                  borderRadius: 50,
                  color: goldAccent,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  backdropFilter: "blur(8px)",
                }}
              >
                Luxury Redefined
              </div>

              {/* Main Title */}
              <Title
                level={1}
                style={{
                  margin: 0,
                  fontSize: "4.5rem",
                  fontWeight: 700,
                  color: textWhite,
                  lineHeight: 1.1,
                  letterSpacing: "-1.5px",
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  fontFamily: '"Playfair Display", "Cinzel", Georgia, serif',
                }}
              >
                The Pinnacle
                <br />
                <span style={{ color: goldAccent }}>of Elegance</span>
              </Title>

              {/* Subtitle */}
              <Paragraph
                style={{
                  fontSize: "1.25rem",
                  color: "#e0e0e0",
                  lineHeight: 1.7,
                  maxWidth: "520px",
                  margin: "16px 0 32px",
                  fontWeight: 300,
                }}
              >
                Indulge in timeless luxury where every detail is crafted for
                your ultimate comfort and sophistication.
              </Paragraph>

              {/* CTA Buttons */}
              <Space size={16}>
                <Link to="/client/rooms">
                  <Button
                    size="large"
                    style={{
                      height: 56,
                      padding: "0 32px",
                      fontSize: 16,
                      fontWeight: 600,
                      background: goldAccent,
                      color: "#000",
                      border: "none",
                      borderRadius: 999,
                      boxShadow: "0 8px 25px rgba(212, 175, 55, 0.3)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(212, 175, 55, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(212, 175, 55, 0.3)";
                    }}
                  >
                    Explore Rooms
                  </Button>
                </Link>

                <Link to="/client/services">
                  <Button
                    size="large"
                    style={{
                      height: 56,
                      padding: "0 32px",
                      fontSize: 16,
                      fontWeight: 600,
                      background: "transparent",
                      color: textWhite,
                      border: `2px solid ${goldAccent}`,
                      borderRadius: 999,
                      transition: "all 0.4s ease",
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
                    Our Services
                  </Button>
                </Link>
              </Space>

              {/* Trust Badges */}
              <Space size={32} style={{ marginTop: 48, opacity: 0.8 }}>
                {[
                  { label: "5-Star Rated", icon: "Star" },
                  { label: "Since 1890", icon: "Clock" },
                  { label: "Award Winning", icon: "Trophy" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#ccc",
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: goldAccent, fontSize: 18 }}>★</span>
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                  </div>
                ))}
              </Space>
            </Space>
          </Col>

          {/* Right Side - Optional Decorative Element */}
          <Col xs={0} lg={12}>
            <div
              style={{
                position: "relative",
                height: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 500,
                  height: 500,
                  border: `2px solid ${goldAccent}`,
                  borderRadius: "50%",
                  opacity: 0.15,
                  animation: "pulse 4s infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 60,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 380,
                  height: 380,
                  border: `1px solid ${goldAccent}`,
                  borderRadius: "50%",
                  opacity: 0.1,
                }}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Scroll Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#999",
          fontSize: 14,
          animation: "bounce 2s infinite",
        }}
      >
        <div style={{ marginBottom: 8 }}>Scroll to Discover</div>
        <div style={{ color: goldAccent }}>Down Arrow</div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.15; }
            50% { transform: translateY(-50%) scale(1.05); opacity: 0.25; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-8px); }
          }
        `}
      </style>
    </section>
  );
};
