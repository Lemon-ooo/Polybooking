import React from "react";
import { Card, Row, Col, Button, Typography, Space, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  StarOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          color: "white",
          marginBottom: "48px",
        }}
      >
        <HomeOutlined style={{ fontSize: "64px", marginBottom: "24px" }} />
        <Title level={1} style={{ color: "white", marginBottom: "16px" }}>
          Chào mừng đến với PolyStay
        </Title>
        <Paragraph
          style={{
            fontSize: "18px",
            color: "white",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Khách sạn sang trọng với dịch vụ đẳng cấp. Trải nghiệm kỳ nghỉ hoàn
          hảo của bạn ngay hôm nay.
        </Paragraph>

        <Space size="large" style={{ marginTop: "32px" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/login")}
            style={{ background: "#ff6b6b", borderColor: "#ff6b6b" }}
          >
            Đăng nhập
          </Button>
          <Button
            size="large"
            onClick={() => navigate("/register")} // Có thể thêm trang đăng ký sau
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              borderColor: "white",
            }}
          >
            Đăng ký
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable style={{ textAlign: "center" }}>
            <WifiOutlined
              style={{
                fontSize: "32px",
                color: "#1890ff",
                marginBottom: "16px",
              }}
            />
            <Title level={4}>WiFi Miễn Phí</Title>
            <Paragraph>
              Kết nối internet tốc độ cao trong toàn bộ khách sạn
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable style={{ textAlign: "center" }}>
            <CarOutlined
              style={{
                fontSize: "32px",
                color: "#52c41a",
                marginBottom: "16px",
              }}
            />
            <Title level={4}>Bãi Đỗ Xe</Title>
            <Paragraph>Bãi đỗ xe rộng rãi và an toàn cho quý khách</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable style={{ textAlign: "center" }}>
            <EnvironmentOutlined
              style={{
                fontSize: "32px",
                color: "#faad14",
                marginBottom: "16px",
              }}
            />
            <Title level={4}>Vị Trí Đắc Địa</Title>
            <Paragraph>
              Nằm ở trung tâm thành phố, thuận tiện di chuyển
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Call to Action */}
      <Divider />
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Title level={2}>Sẵn sàng cho kỳ nghỉ của bạn?</Title>
        <Paragraph style={{ fontSize: "16px", marginBottom: "32px" }}>
          Đăng nhập để đặt phòng và trải nghiệm dịch vụ tuyệt vời của chúng tôi
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<UserOutlined />}
          onClick={() => navigate("/login")}
        >
          Đăng nhập ngay
        </Button>
      </div>
    </div>
  );
};
