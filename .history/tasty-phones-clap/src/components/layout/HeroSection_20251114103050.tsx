// src/components/HeroSection.tsx
import React, { useState, useEffect } from "react";
import { Button, Space } from "antd";
import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1611892441792-ae6af465f0f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
] as const;

const gold = "#c9a96e";
const white = "#fff";

export const HeroSection: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  // ---------- Preload ----------
  useEffect(() => {
    const load = (src: string) =>
      new Promise<void>((res, rej) => {
        const img = new Image();
        img.src = src;
        img.onload = () => res();
        img.onerror = () => rej();
      });

    Promise.all(images.map((src, i) => load(src).then(() => i)))
      .then((ids) => {
        setLoaded(new Set(ids));
        setReady(true);
      })
      .catch(() => setReady(true)); // vẫn cho phép hiển thị dù lỗi
  }, []);

  // ---------- Auto slide ----------
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [ready]);

  if (!ready) {
    return (
      <section
        style={{
          height: "100vh",
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: white,
          fontSize: "1.2rem",
        }}
      >
        Loading luxury experience...
      </section>
    );
  }

  const next = (idx + 1) % images.length;

  return (
    <section
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {[idx, next].map((i) => {
        const active = i === idx;
        return (
          <div
            key={i}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.25), rgba(0,0,0,.3)), url(${images[i]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: white,
              textAlign: "center",
              padding: "0 20px",
              opacity: active ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              zIndex: active ? 2 : 1,
              pointerEvents: active ? "auto" : "none",
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 20px",
                  border: `1px solid ${gold}`,
                  borderRadius: 2,
                  color: gold,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: 16,
                  backdropFilter: "blur(8px)",
                  background: "rgba(0,0,0,.1)",
                }}
              >
                Welcome to Luxury
              </div>

              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}
              >
                Discover a sanctuary of sophistication where heritage meets
                modern luxury.
              </p>

              <Space size={16}>
                <Link to="/client/rooms">
                  <Button
                    style={{
                      background: gold,
                      color: "#000",
                      border: "none",
                      height: 44,
                    }}
                  >
                    Book Your Stay
                  </Button>
                </Link>
                <Link to="/client/services">
                  <Button
                    style={{
                      background: "transparent",
                      border: `1px solid ${gold}`,
                      color: white,
                      height: 44,
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
