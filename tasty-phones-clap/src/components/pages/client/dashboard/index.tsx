import React, { useState, useEffect } from "react";
import {
  Typography,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
} from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import heroImage from "../../../../assets/heroImage.png";

// @ts-ignore - assets.js không có type definitions
import { cities, assets } from "../../../../assets/assets";

const { Title, Paragraph, Text } = Typography;

export const ClientDashboard: React.FC = () => {
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onFinish = (values: any) => {
    // TODO: hook search action
    console.log("Search params:", values);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 64px",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
      }}
    >
      <Text
        style={{
          background: "rgba(73,185,255,0.5)",
          padding: "4px 14px",
          borderRadius: "999px",
          display: "inline-block",
          color: "#fff",
          marginTop: "80px",
          fontSize: "14px",
        }}
      >
        The Ultimate HomeStay Experience
      </Text>

      <Title
        level={1}
        style={{
          color: "#fff",
          marginTop: 16,
          marginBottom: 8,
          fontSize: "56px",
          lineHeight: "56px",
          fontWeight: 800,
          maxWidth: "576px",
        }}
      >
        Discover Your Perfect Gateway Destination
      </Title>

      <Paragraph
        style={{
          color: "#fff",
          fontSize: "16px",
          maxWidth: "520px",
          marginBottom: 32,
        }}
      >
        Unparalleled luxury and comfort await at the world's most exclusive
        homestays. Start your journey today.
      </Paragraph>

      <Form
        form={form}
        onFinish={onFinish}
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "24px",
          marginTop: 32,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "16px",
            alignItems: isMobile ? "flex-start" : "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Form.Item
            name="destination"
            rules={[{ required: true, message: "Please select destination" }]}
            style={{ marginBottom: 0 }}
          >
            <Space direction="vertical" size={4}>
              <Space size={8}>
                <img
                  src={assets.calenderIcon}
                  alt=""
                  style={{ height: "16px", width: "16px" }}
                />
                <label style={{ color: "#6b7280", fontSize: "14px" }}>
                  Destination
                </label>
              </Space>
              <Select
                placeholder="Type here"
                showSearch
                style={{ width: 200 }}
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={cities.map((c: string) => ({
                  label: c,
                  value: c,
                }))}
              />
            </Space>
          </Form.Item>

          <Form.Item name="checkIn" style={{ marginBottom: 0 }}>
            <Space direction="vertical" size={4}>
              <Space size={8}>
                <img
                  src={assets.calenderIcon}
                  alt=""
                  style={{ height: "16px", width: "16px" }}
                />
                <label style={{ color: "#6b7280", fontSize: "14px" }}>
                  Check in
                </label>
              </Space>
              <DatePicker style={{ width: 200 }} />
            </Space>
          </Form.Item>

          <Form.Item name="checkOut" style={{ marginBottom: 0 }}>
            <Space direction="vertical" size={4}>
              <Space size={8}>
                <img
                  src={assets.calenderIcon}
                  alt=""
                  style={{ height: "16px", width: "16px" }}
                />
                <label style={{ color: "#6b7280", fontSize: "14px" }}>
                  Check out
                </label>
              </Space>
              <DatePicker style={{ width: 200 }} />
            </Space>
          </Form.Item>

          <Form.Item name="guests" style={{ marginBottom: 0 }}>
            <Space
              direction={isMobile ? "horizontal" : "vertical"}
              size={isMobile ? 8 : 4}
              style={{
                alignItems: isMobile ? "center" : "flex-start",
              }}
            >
              <label style={{ color: "#6b7280", fontSize: "14px" }}>
                Guests
              </label>
              <InputNumber
                min={1}
                max={4}
                placeholder="0"
                style={{ width: 100 }}
              />
            </Space>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0, width: isMobile ? "100%" : "auto" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              style={{
                background: "#000",
                borderColor: "#000",
                height: "auto",
                padding: "12px 16px",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Search
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
