// src/components/HeroSection.tsx
import React, { useState, useEffect } from "react";

const IMAGES = [
  "https://img.dothi.net/2020/07/31/Z9BcC3fq/khach-san-dep-2-88c4.jpg",
  "https://img.dothi.net/2020/07/31/Z9BcC3fq/khach-san-dep-10-eb7a.jpg",
  "https://img.dothi.net/2020/07/31/Z9BcC3fq/khach-san-dep-4-4fe1.jpg",
] as const;

const GOLD = "#c9a96e";
const WHITE = "#fff";

export const HeroSection: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  // ---------- PRELOAD IMAGES ----------
  useEffect(() => {
    const load = (src: string) =>
      new Promise<void>((res) => {
        const img = new Image();
        img.src = src;
        img.onload = () => res();
        img.onerror = () => res(); // tiếp tục nếu ảnh lỗi
      });

    Promise.all(IMAGES.map((src, i) => load(src).then(() => i)))
      .then((ids) => {
        setLoaded(new Set(ids));
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  // ---------- AUTO SLIDE ----------
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ready]);

  if (!ready) {
    return (
      <section
        style={{
          height: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: WHITE,
          fontSize: "1.2rem",
          fontWeight: 500,
        }}
      >
        Loading luxury experience...
      </section>
    );
  }

  return (
    <section
      style={{ position: "relative", height: "90vh", overflow: "hidden" }}
    >
      {/* ---------- IMAGE LAYERS (FADE SMOOTH) ---------- */}
      {IMAGES.map((src, i) => (
        <div
          key={i}
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.25), rgba(0,0,0,.3)), url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: "opacity 2.5s ease-in-out", // fade chậm, mượt
            zIndex: 1,
          }}
        />
      ))}

      {/* ---------- STATIC TEXT (NO FADE) ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: WHITE,
          padding: "0 20px",
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <h1
            style={{
              fontSize: "clamp(2rem,5vw,4rem)",
              letterSpacing: "2px",
              margin: 0,
            }}
          >
            Experience{" "}
            <span style={{ color: GOLD, fontStyle: "italic" }}>Timeless</span>{" "}
            Elegance
          </h1>
        </div>
      </div>
    </section>
  );
};
