import React from "react";
import { Typography, Space, Divider, Input, Button, Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
// @ts-ignore - assets.js không có type definitions
import { assets } from "../../assets/assets";

const { Title, Paragraph, Text } = Typography;

export const Footer: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        background: "#f8fafc",
        color: "rgba(107, 114, 128, 0.8)",
        padding: "64px 64px 0",
      }}
    >
      <Row gutter={[48, 48]} style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Logo and Description */}
        <Col xs={24} sm={24} md={12} lg={8}>
          <img
            src={assets.logo}
            alt="logo"
            style={{
              height: "36px",
              marginBottom: "16px",
              filter: "invert(1) opacity(0.8)",
            }}
          />
          <Paragraph style={{ fontSize: "14px", marginBottom: "16px" }}>
            Discover the world's most extraordinary places to stay, from
            boutique homestays to luxury villas and private islands.
          </Paragraph>
          <Space size={12}>
            <img
              src={assets.instagramIcon}
              alt="Instagram"
              style={{ cursor: "pointer" }}
            />
            <img
              src={assets.facebookIcon}
              alt="Facebook"
              style={{ cursor: "pointer" }}
            />
            <img
              src={assets.twitterIcon}
              alt="Twitter"
              style={{ cursor: "pointer" }}
            />
            <img
              src={assets.linkendinIcon}
              alt="LinkedIn"
              style={{ cursor: "pointer" }}
            />
          </Space>
        </Col>

        {/* Company */}
        <Col xs={12} sm={12} md={6} lg={4}>
          <Title
            level={5}
            style={{
              fontSize: "18px",
              color: "#374151",
              marginBottom: "16px",
              fontFamily: "Playfair Display, serif",
            }}
          >
            COMPANY
          </Title>
          <Space direction="vertical" size={8}>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              About
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Careers
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Press
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Blog
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Partners
            </a>
          </Space>
        </Col>

        {/* Support */}
        <Col xs={12} sm={12} md={6} lg={4}>
          <Title
            level={5}
            style={{
              fontSize: "18px",
              color: "#374151",
              marginBottom: "16px",
              fontFamily: "Playfair Display, serif",
            }}
          >
            SUPPORT
          </Title>
          <Space direction="vertical" size={8}>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Help Center
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Safety Information
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Cancellation Options
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Contact Us
            </a>
            <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
              Accessibility
            </a>
          </Space>
        </Col>

        {/* Newsletter */}
        <Col xs={24} sm={24} md={12} lg={8}>
          <Title
            level={5}
            style={{
              fontSize: "18px",
              color: "#374151",
              marginBottom: "16px",
              fontFamily: "Playfair Display, serif",
            }}
          >
            STAY UPDATED
          </Title>
          <Paragraph style={{ fontSize: "14px", marginBottom: "16px" }}>
            Subscribe to our newsletter for inspiration and special offers.
          </Paragraph>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Your email"
              style={{
                background: "#fff",
                borderColor: "#d1d5db",
                height: "36px",
              }}
            />
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              style={{
                background: "#000",
                borderColor: "#000",
                height: "36px",
              }}
            />
          </Space.Compact>
        </Col>
      </Row>

      <Divider style={{ marginTop: "32px", borderColor: "#d1d5db" }} />

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "8px",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "20px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <Text style={{ fontSize: "14px" }}>
          © {new Date().getFullYear()} PolyStay. All rights reserved.
        </Text>
        <Space size={16}>
          <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
            Privacy
          </a>
          <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
            Terms
          </a>
          <a href="#" style={{ color: "inherit", fontSize: "14px" }}>
            Sitemap
          </a>
        </Space>
      </div>
    </div>
  );
};

