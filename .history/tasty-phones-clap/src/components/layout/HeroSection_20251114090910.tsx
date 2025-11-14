import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "650px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <img
          src="https://ruedelamourhotel.com/wp-content/uploads/2024/02/Booth-love-hotel-2048x1365.jpg"
          alt="hero"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 100%)",
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
          padding: "0 20px",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "24px",
            letterSpacing: "2px",
          }}
        >
          Rue de L’Amour Hotel
        </h1>

        <p
          style={{
            fontSize: "20px",
            maxWidth: "680px",
            margin: "0 auto 32px",
            opacity: 0.95,
          }}
        >
          Touch your heart deeply with our exquisite romantic spaces.
        </p>

        <button
          style={{
            background: "#ffffff",
            color: "#000",
            padding: "14px 32px",
            borderRadius: "30px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
            transition: "0.25s ease",
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
