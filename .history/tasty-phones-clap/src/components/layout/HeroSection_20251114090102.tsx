import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "85vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src="https://ruedelamourhotel.com/wp-content/uploads/2024/02/Booth-love-hotel-2048x1365.jpg"
        alt="hero"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 80%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#fff",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          RUE DE L’AMOUR HOTEL
        </h1>

        <p
          style={{
            fontSize: "18px",
            maxWidth: "720px",
            margin: "0 auto 32px",
            opacity: 0.9,
          }}
        >
          Touch your heart deeply with our exquisite romantic spaces.
        </p>

        <button
          style={{
            background: "#fff",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "30px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
