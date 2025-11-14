import React, { useState, useEffect } from "react";
import { Button, Typography, Space, Carousel } from "antd";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Danh sách ảnh cho carousel
  const carouselImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
  ];

  const goldAccent = "#c9a96e";
  const darkGold = "#b8934b";
  const textWhite = "#ffffff";
  const lightText = "#f8f8f8";

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const carouselStyle: React.CSSProperties = {
    position: "relative",
    height: "100vh",
    minHeight: "700px",
    overflow: "hidden",
  };

  const slideStyle = (image: string): React.CSSProperties => ({
    position: "relative",
    height: "100vh",
    minHeight: "700px",
    background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    display: "flex",
    alignItems: "center",
  });

  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 2,
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 80px",
    width: "100%",
  };

  const navigationButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    background: "rgba(201, 169, 110, 0.8)",
    border: "none",
    color: "#000",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const nextButtonStyle: React.CSSProperties = {
    ...navigationButtonStyle,
    right: "40px",
  };

  const prevButtonStyle: React.CSSProperties = {
    ...navigationButtonStyle,
    left: "40px",
  };

  const dotsStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "12px",
    zIndex: 3,
  };

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? "40px" : "12px",
    height: "12px",
    background: isActive ? goldAccent : "rgba(255, 255, 255, 0.5)",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section style={carouselStyle}>
      {/* Carousel Slides */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          style={{
            ...slideStyle(image),
            display: index === currentSlide ? "flex" : "none",
          }}
        >
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

          <div style={contentStyle}>
            <div style={{ maxWidth: "600px" }}>
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
                    fontSize: "4rem",
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
                      fontSize: "1.6rem",
                      fontWeight: 300,
                      letterSpacing: "6px",
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
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        style={prevButtonStyle}
        onClick={handlePrev}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = darkGold;
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(201, 169, 110, 0.8)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        <LeftOutlined style={{ fontSize: "16px" }} />
      </button>

      <button
        style={nextButtonStyle}
        onClick={handleNext}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = darkGold;
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(201, 169, 110, 0.8)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        <RightOutlined style={{ fontSize: "16px" }} />
      </button>

      {/* Dots Indicator */}
      <div style={dotsStyle}>
        {carouselImages.map((_, index) => (
          <div
            key={index}
            style={dotStyle(index === currentSlide)}
            onClick={() => goToSlide(index)}
            onMouseEnter={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
              }
            }}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          color: textWhite,
          fontSize: "14px",
          letterSpacing: "1px",
          zIndex: 3,
          background: "rgba(0, 0, 0, 0.5)",
          padding: "8px 16px",
          borderRadius: "20px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {currentSlide + 1} / {carouselImages.length}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .carousel-slide {
            animation: fadeIn 0.8s ease-in-out;
          }
        `}
      </style>
    </section>
  );
};
