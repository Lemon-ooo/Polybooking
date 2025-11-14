// src/components/HeroSection.tsx
import React, { useState, useEffect } from "react";
import { Button, Space } from "antd";
import { Link } from "react-router-dom";

const IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=70",
] as const;

const GOLD = "#c9a96e";
const WHITE = "#fff";

export const HeroSection: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  // ---------- PRE‑LOAD ALL ----------
  useEffect(() => {
    const load = (src: string) =>
      new Promise<void>((res, rej) => {
        const img = new Image();
        img.src = src;
        img.onload = () => res();
        img.onerror = () => rej(); // vẫn cho phép tiếp tục nếu 1 ảnh lỗi
      });

    Promise.all(IMAGES.map((src, i) => load(src).then(() => i)))
      .then((ids) => {
        setLoaded(new Set(ids));
        setReady(true);
      })
      .catch(() => setReady(true)); // fallback
  }, []);

  // ---------- AUTO‑SLIDE (chỉ chạy khi ready) ----------
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ready]);

  // ---------- LOADING SKELETON ----------
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

  const nextIdx = (idx + 1) % IMAGES.length;

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ---------- IMAGE LAYERS (FADE ONLY IMAGES) ---------- */}
      {[idx, nextIdx].map((i) => {
        const active = i === idx;
        return (
          <div
            key={i}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.25), rgba(0,0,0,.3)), url(${IMAGES[i]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              inset: 0,
              opacity: active ? 1 : 0,
              transition: "opacity 2s cubic-bezier(0.77, 0, 0.175, 1)",
              zIndex: 1,
            }}
          />
        );
      })}

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
              margin: "0 0 1rem",
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
