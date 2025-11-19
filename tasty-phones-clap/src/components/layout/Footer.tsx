import React from "react";
import { Row, Col, Input, Button, Typography, Space } from "antd";
import {
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { assets } from "../../assets/assets";

const { Text, Title } = Typography;

export const Footer = () => {
  return (
    <div
      style={{
        background: "#0f0f0f",
        color: "#e5e5e5",
        padding: "70px 40px 40px",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/black-linen.png')",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Row
        gutter={[40, 40]}
        style={{ maxWidth: 1400, margin: "0 auto" }}
        align="top"
      >
        {/* ==================== CỘT 1: LOGO + CONTACT ==================== */}
        <Col xs={24} md={12} lg={8}>
          <img
            src={assets.logo}
            alt="logo"
            style={{
              height: 58,
              marginBottom: 28,
              filter: "brightness(1.1)",
            }}
          />

          <Space direction="vertical" size={16}>
            <Space size={14} style={{ alignItems: "flex-start" }}>
              <EnvironmentOutlined style={{ color: "#C49A6C", fontSize: 18 }} />
              <Text style={{ color: "#e5e5e5", fontSize: 15, lineHeight: 1.6 }}>
                Tòa F Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
              </Text>
            </Space>

            <Space size={14}>
              <PhoneOutlined style={{ color: "#C49A6C", fontSize: 18 }} />
              <Text style={{ color: "#e5e5e5", fontSize: 15 }}>
                (+84) 0123 456 789
              </Text>
            </Space>

            <Space size={14}>
              <MailOutlined style={{ color: "#C49A6C", fontSize: 18 }} />
              <Text style={{ color: "#e5e5e5", fontSize: 15 }}>
                polyhotel@gmail.com
              </Text>
            </Space>
          </Space>
        </Col>

        {/* ==================== CỘT 2: GOOGLE MAPS ==================== */}
        <Col xs={24} md={12} lg={8}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              height: 300,
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8638060191297!2d105.7446868758415!3d21.038134787455395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1763220516791!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="PolyStay Location"
            />
          </div>
        </Col>

        {/* ==================== CỘT 3: SOCIAL + CARDS + NEWSLETTER ==================== */}
        <Col xs={24} md={24} lg={8}>
          <Space direction="vertical" size={32} style={{ width: "100%" }}>

            {/* SOCIAL */}
            <div>
              <Title
                level={5}
                style={{
                  color: "#fff",
                  fontFamily: "'Playfair Display', serif",
                  margin: "0 0 18px",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: "1.2px",
                }}
              >
                FIND US ON
              </Title>

              <Space size={22}>
  {/* Facebook */}
  <a
    href="https://www.facebook.com/ndt2202/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none" }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        background: "#222",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1877F2";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(24,119,242,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#222";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <img src={assets.facebookIcon} style={{ width: 24 }} alt="Facebook" />
    </div>
  </a>

  {/* Instagram */}
  <a
    href="https://instagram.com/polystay"
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none" }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        background: "#222",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#E4405F";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(228,64,95,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#222";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <img src={assets.instagramIcon} style={{ width: 24 }} alt="Instagram" />
    </div>
  </a>

  {/* TikTok */}
  <a
    href="https://tiktok.com/@polystay"
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none" }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        background: "#222",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#000";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#222";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <img src={assets.tiktokIcon || assets.twitterIcon} style={{ width: 24 }} alt="TikTok" />
    </div>
  </a>
</Space>
            </div>

            {/* ACCEPTED CARDS */}
            <div>
              <Title
                level={5}
                style={{
                  color: "#fff",
                  fontFamily: "'Playfair Display', serif",
                  margin: "0 0 18px",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: "1.2px",
                }}
              >
                ACCEPTED CARDS
              </Title>

              <Space size={14}>
                <img
                  src="https://img.icons8.com/color/48/paypal.png"
                  style={{ width: 58, borderRadius: 6, filter: "brightness(1.1)" }}
                />
                <img
                  src="https://img.icons8.com/color/48/mastercard.png"
                  style={{ width: 58, borderRadius: 6, filter: "brightness(1.1)" }}
                />
                <img
                  src="https://img.icons8.com/color/48/visa.png"
                  style={{ width: 58, borderRadius: 6, filter: "brightness(1.1)" }}
                />
              </Space>
            </div>

            {/* NEWSLETTER */}
            <div>
              <Title
                level={5}
                style={{
                  color: "#fff",
                  fontFamily: "'Playfair Display', serif",
                  margin: "0 0 18px",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: "1.2px",
                }}
              >
                SUBSCRIBE TO OUR NEWSLETTER
              </Title>

              <Space.Compact style={{ width: "100%" }}>
                <Input
  placeholder="Nhập email của bạn"
  style={{
    height: 50,
    background: "rgba(34, 34, 34, 0.9)",
    border: "1px solid #444",
    borderRadius: "12px 0 0 12px",
    color: "#fff",                    // chữ khi gõ
    fontSize: 15,
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
  }}
  // ĐÈ STYLE PLACEHOLDER + ICON XÓA BẰNG CÁCH DÙNG ::placeholder và .ant-input-clear-icon
  addonAfter={null} // trick để thêm style inline cho placeholder
  // Dùng prefix/suffix rỗng để chèn style trực tiếp vào input element
  prefix={
    <span
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <style jsx>{`
        input::placeholder {
          color: #fff !important;
          opacity: 0.75;
        }
        .ant-input-clear-icon {
          color: #fff !important;
        }
        input {
          color: #fff !important;
        }
      `}</style>
    </span>
  }
  onFocus={(e) => {
    e.target.style.borderColor = "#C49A6C";
    e.target.style.boxShadow = "0 0 0 3px rgba(196,154,108,0.2)";
  }}
  onBlur={(e) => {
    e.target.style.borderColor = "#444";
    e.target.style.boxShadow = "none";
  }}
  allowClear
/>
                <Button
                  type="primary"
                  icon={<SendOutlined />} 
                  style={{
                    height: 50,
                    background: "linear-gradient(45deg, #C49A6C, #E4B97C)",
                    border: "none",
                    borderRadius: "0 12px 12px 0",
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: "0 4px 15px rgba(196,154,108,0.4)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(196,154,108,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(196,154,108,0.4)";
                  }}
                >
                  Gửi
                </Button>
              </Space.Compact>
            </div>
          </Space>
        </Col>
      </Row>

      {/* ==================== FOOTER BOTTOM ==================== */}
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
          paddingTop: 28,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: 14,
          color: "#aaa",
        }}
      >
        <div style={{ marginBottom: 6 }}>
          © {new Date().getFullYear()}{" "}
          <span
            style={{
              color: "#C49A6C",
              fontWeight: 600,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            PolyStay
          </span>
          . All Rights Reserved.
        </div>
        <div style={{ fontSize: 12, color: "#777" }}>
          Luxury stays, crafted with passion • Vietnam
        </div>
      </div>
    </div>
  );
};