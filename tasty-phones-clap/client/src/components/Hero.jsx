import React from "react";
import { assets, cities } from "../assets/assets";
import { Typography, Card, Row, Col, Input, DatePicker, InputNumber, Button, AutoComplete, Space } from "antd";
import dayjs from "dayjs";

const Hero = () => {
  return (
    <div className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/heroImage.png')] bg-no-repeat bg-cover bg-center h-screen">
      <span className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">The Ultimate HomeStay Experience</span>
      <Typography.Title level={1} className="font-playfair" style={{ color: "#fff", marginTop: 16 }}>
        Discover Your Perfect Gateway Destination
      </Typography.Title>
      <Typography.Paragraph style={{ maxWidth: 520, color: "#e5e7eb" }}>
        Unparalleled luxury and comfort await at the world's most exclusive homestays. Start your journey today.
      </Typography.Paragraph>

      <Card style={{ marginTop: 24, background: "#fff" }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={8}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <span>Destination</span>
              <AutoComplete style={{ width: "100%" }} options={cities.map((c) => ({ value: c }))} placeholder="Type here" />
            </Space>
          </Col>
          <Col xs={24} md={5}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <span>Check in</span>
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabledDate={(d) => d && d < dayjs().startOf("day")} />
            </Space>
          </Col>
          <Col xs={24} md={5}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <span>Check out</span>
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabledDate={(d) => d && d < dayjs().startOf("day")} />
            </Space>
          </Col>
          <Col xs={24} md={3}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <span>Guests</span>
              <InputNumber min={1} max={4} style={{ width: "100%" }} placeholder="0" />
            </Space>
          </Col>
          <Col xs={24} md={3}>
            <Button type="primary" block size="large">
              <img src={assets.searchIcon} alt="searchIcon" style={{ height: 18, marginRight: 6, filter: "invert(1)" }} />
              Search
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Hero;
