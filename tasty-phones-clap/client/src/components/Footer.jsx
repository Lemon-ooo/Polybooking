import React from "react";
import { assets } from "../assets/assets";
import { Layout, Typography, Row, Col, Space, Input, Button, Divider } from "antd";

const Footer = () => {
  return (
    <Layout.Footer style={{ background: "#F6F9FC", color: "#6b7280" }}>
      <Row gutter={[24, 24]} justify="space-between">
        <Col xs={24} md={8}>
          <img src={assets.logo} alt="logo" style={{ height: 36, marginBottom: 12, filter: "invert(1) opacity(0.8)" }} />
          <Typography.Paragraph>
            Discover the world's most extraordinary places to stay, from boutique homestays to luxury villas and private islands.
          </Typography.Paragraph>
          <Space size={12} style={{ marginTop: 12 }}>
            <img src={assets.instagramIcon} alt="Instagram-icon" />
            <img src={assets.facebookIcon} alt="Facebook-icon" />
            <img src={assets.twitterIcon} alt="Twitter-icon" />
            <img src={assets.linkendinIcon} alt="LinkedIn-icon" />
          </Space>
        </Col>
        <Col xs={12} md={4}>
          <Typography.Title level={5} style={{ color: "#111827" }}>COMPANY</Typography.Title>
          <Space direction="vertical">
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Blog</a>
            <a href="#">Partners</a>
          </Space>
        </Col>
        <Col xs={12} md={4}>
          <Typography.Title level={5} style={{ color: "#111827" }}>SUPPORT</Typography.Title>
          <Space direction="vertical">
            <a href="#">Help Center</a>
            <a href="#">Safety Information</a>
            <a href="#">Cancellation Options</a>
            <a href="#">Contact Us</a>
            <a href="#">Accessibility</a>
          </Space>
        </Col>
        <Col xs={24} md={8}>
          <Typography.Title level={5} style={{ color: "#111827" }}>STAY UPDATED</Typography.Title>
          <Typography.Paragraph>
            Subscribe to our newsletter for inspiration and special offers.
          </Typography.Paragraph>
          <Space.Compact style={{ width: "100%" }}>
            <Input placeholder="Your email" />
            <Button type="default">
              <img src={assets.arrowIcon} alt="arrow-icon" style={{ width: 14, filter: "invert(1)" }} />
            </Button>
          </Space.Compact>
        </Col>
      </Row>
      <Divider />
      <Row justify="space-between" align="middle">
        <Col>© {new Date().getFullYear()} PolyStay. All rights reserved.</Col>
        <Col>
          <Space size={16}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </Space>
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default Footer;
