import React, { useState, useEffect } from "react";
import { Button, Typography, Space } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
  ];

  const goldAccent = "#c9a96e";
  const darkGold = "#b8934b";
  const textWhite = "#fff";
  const lightText = "#f8f8f8";

  // Auto slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideStyle = (image: string): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.15), rgba(0,0,0,0.2)), url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: textWhite,
    textAlign: "center",
    padding: "0 20px",
    opacity: 0,
    animation:
      currentSlide === carouselImages.indexOf(image)
        ? "fadeIn 1s forwards"
        : "none",
  });

  return (
    <section
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {carouselImages.map((img, idx) => (
        <div key={idx} style={slideStyle(img)}>
          <div style={{ maxWidth: 700 }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 16px",
                border: `1px solid ${goldAccent}`,
                borderRadius: "2px",
                color: goldAccent,
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "16px",
                backdropFilter: "blur(8px)",
              }}
            >
              Welcome to Luxury
            </div>
            <Title
              level={1}
              style={{
                color: textWhite,
                fontSize: "3rem",
                lineHeight: 1.1,
                letterSpacing: "2px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "1.5rem",
                  color: goldAccent,
                }}
              >
                Hotel Deluxe
              </span>
              Experience{" "}
              <span style={{ color: goldAccent, fontStyle: "italic" }}>
                Timeless
              </span>{" "}
              Elegance
            </Title>
            <Paragraph
              style={{ color: lightText, fontSize: "1rem", lineHeight: 1.8 }}
            >
              Discover a sanctuary of sophistication where heritage meets modern
              luxury. Each moment is crafted to perfection in our exquisite
              hotel.
            </Paragraph>
            <Space size={16} style={{ marginTop: "24px" }}>
              <Link to="/client/rooms">
                <Button
                  style={{
                    background: goldAccent,
                    color: "#000",
                    border: "none",
                  }}
                >
                  Book Your Stay
                </Button>
              </Link>
              <Link to="/client/services">
                <Button
                  style={{
                    background: "transparent",
                    border: `1px solid ${goldAccent}`,
                    color: textWhite,
                  }}
                >
                  Explore Services
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      ))}

      {/* Fade animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </section>
  );
};
