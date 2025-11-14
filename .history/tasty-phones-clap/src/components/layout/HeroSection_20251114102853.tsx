import React, { useState, useEffect } from "react";
import { Button, Typography, Space } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const carouselImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
  ];

  const goldAccent = "#c9a96e";
  const textWhite = "#fff";
  const lightText = "#f8f8f8";

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const loadImage = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      };

      try {
        await Promise.all(carouselImages.map((src) => loadImage(src)));
        setLoadedImages(new Set(carouselImages.map((_, i) => i)));
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load images", err);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  // Auto slide
  useEffect(() => {
    if (isLoading) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isLoading]);

  // Get next index for preloading next slide
  const nextSlide = (currentSlide + 1) % carouselImages.length;

  if (isLoading) {
    return (
      <section
        style={{
          position: "relative",
          height: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <div>Loading luxury experience...</div>
      </section>
    );
  }

  return (
    <section
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* Only render current and next slide */}
      {[currentSlide, nextSlide].map((idx) => {
        const isActive = idx === currentSlide;
        const isNext = idx === nextSlide;

        return (
          <div
            key={idx}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.3)), url(${carouselImages[idx]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: textWhite,
              textAlign: "center",
              padding: "0 20px",
              opacity: isActive ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              zIndex: isActive ? 2 : 1,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
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
                  background: "rgba(0,0,0,0.1)",
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
                Discover a sanctuary of sophistication where heritage meets
                modern luxury. Each moment is crafted to perfection in our
                exquisite hotel.
              </Paragraph>
              <Space size={16} style={{ marginTop: "24px" }}>
                <Link to="/client/rooms">
                  <Button
                    style={{
                      background: goldAccent,
                      color: "#000",
                      border: "none",
                      height: "44px",
                      fontWeight: 600,
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
                      height: "44px",
                      fontWeight: 600,
                    }}
                  >
                    Explore Services
                  </Button>
                </Link>
              </Space>
            </div>
          </div>
        );
      })}
    </section>
  );
};
