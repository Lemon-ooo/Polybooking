import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";
import { Card, Input, Button, Typography, Space } from "antd";

const NewsLetter = () => {
  return (
    <Card style={{ maxWidth: 1024, margin: "120px auto", background: "#111827", color: "#fff" }}>
      <div className="flex flex-col items-center">
        <Title
          title="Stay Inspired"
          subTitle="Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration."
        />
        <Space style={{ marginTop: 16 }} wrap>
          <Input placeholder="Enter your email" style={{ width: 320 }} />
          <Button type="primary">
            Subscribe
            <img src={assets.arrowIcon} alt="arrow-icon" style={{ width: 14, marginLeft: 6, filter: "invert(1)" }} />
          </Button>
        </Space>
        <Typography.Paragraph style={{ color: "#9ca3af", marginTop: 16 }}>
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </Typography.Paragraph>
      </div>
    </Card>
  );
};

export default NewsLetter;
