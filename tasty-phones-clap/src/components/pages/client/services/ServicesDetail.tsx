// src/components/pages/client/services/ServicesDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Row, Col, Button, Tag, Card, Spin, Alert, Space, Typography } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const STORAGE_URL = "http://localhost:8000/storage/";

// BANNER RIÊNG - BẠN CHỈ CẦN THAY LINK ẢNH TẠI ĐÂY
const BANNER_IMAGE = "https://ruedelamourhotel.com/wp-content/uploads/2025/02/2.jpg";

const ServicesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === "undefined") {
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        const res = await axiosInstance.get(`/services/${id}`);
        setService(res.data.data);
      } catch (err) {
        console.error("Lỗi tải dịch vụ:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const serviceImageUrl = service?.service_image
    ? `${STORAGE_URL}${service.service_image}`
    : "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";

  const formatPrice = (price: any) => {
    if (!price || price == 0) return "Liên hệ";
    const num = Number(price);
    return isNaN(num) ? "Liên hệ" : num.toLocaleString("vi-VN") + "₫";
  };

  // Lỗi ID
  if (!id || id === "undefined") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdfaf7" }}>
        <Alert message="Lỗi đường dẫn" description="Không tìm thấy ID dịch vụ." type="error" showIcon />
        <Button type="primary" size="large" style={{ marginTop: 20 }} onClick={() => navigate("/client/services")}>
          Quay lại
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdfaf7" }}>
        <Spin size="large" tip="Đang tải thông tin dịch vụ..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdfaf7" }}>
        <Alert message="Không tìm thấy dịch vụ" description="Dịch vụ có thể đã bị xóa." type="warning" showIcon />
        <Button type="primary" size="large" style={{ marginTop: 20 }} onClick={() => navigate("/client/services")}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* ====================== BANNER CHỈ CÓ ẢNH ====================== */}
      <div style={{ position: "relative", width: "100%", height: "620px", overflow: "hidden" }}>
        <img
          src={BANNER_IMAGE}
          alt="Banner dịch vụ"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Nút quay lại góc trên trái trên */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            zIndex: 10,
            background: "rgba(0,0,0,0.4)",
            color: "white",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 24px",
            borderRadius: "50px",
            fontSize: "17px",
          }}
        >
          Quay lại
        </Button>
      </div>

      {/* ====================== NỘI DUNG CHÍNH ====================== */}
      <section style={{ padding: "100px 8% 140px", background: "#fdfaf7" }}>
        <Row gutter={[80, 60]} justify="center">
          {/* Ảnh dịch vụ */}
          <Col xs={24} lg={10}>
            <div style={{ borderRadius: "32px", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.18)" }}>
              <img
                src={serviceImageUrl}
                alt={service.service_name}
                style={{ width: "100%", height: "580px", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
                }}
              />
            </div>
          </Col>

          {/* Thông tin chi tiết */}
          <Col xs={24} lg={14}>
            <Space direction="vertical" size={44} style={{ width: "100%" }}>
              {/* Tên + Giá */}
              <div>
                <Title
                  level={1}
                  style={{
                    fontSize: "52px",
                    fontWeight: 600,
                    color: "#a8765a",
                    margin: 0,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {service.service_name}
                </Title>

                <Tag
                  style={{
                    marginTop: "20px",
                    fontSize: "30px",
                    padding: "14px 44px",
                    borderRadius: "50px",
                    background: "linear-gradient(135deg, #f5d6a0, #e8b923)",
                    border: "none",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {formatPrice(service.service_price)}
                </Tag>
              </div>

              {/* Mô tả */}
              <div>
                <Title level={3} style={{ color: "#a8765a", marginBottom: 16 }}>
                  Mô tả dịch vụ
                </Title>
                <Paragraph style={{ fontSize: "18px", lineHeight: "2", color: "#444" }}>
                  {service.description ||
                    "Liệu trình chăm sóc cao cấp với các kỹ thuật chuyên sâu, sử dụng nguyên liệu thiên nhiên 100%, mang đến sự thư giãn tuyệt đối và tái tạo năng lượng hoàn hảo cho cơ thể và tâm hồn."}
                </Paragraph>
              </div>

              {/* Thông tin bổ sung */}
              <Row gutter={40}>
                <Col span={12}>
                  <Card style={{ textAlign: "center", borderRadius: "24px", background: "#fffaf5", padding: "24px 0" }}>
                    <ClockCircleOutlined style={{ fontSize: "44px", color: "#a8765a" }} />
                    <Text strong style={{ fontSize: "19px", display: "block", margin: "16px 0 8px" }}>
                      Thời lượng
                    </Text>
                    <Text type="secondary" style={{ fontSize: "16px" }}>60 – 90 phút</Text>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ textAlign: "center", borderRadius: "24px", background: "#fffaf5", padding: "24px 0" }}>
                    <CheckCircleOutlined style={{ fontSize: "44px", color: "#52c41a" }} />
                    <Text strong style={{ fontSize: "19px", display: "block", margin: "16px 0 8px" }}>
                      Giờ mở cửa
                    </Text>
                    <Text type="secondary" style={{ fontSize: "16px" }}>08:00 – 22:00 hàng ngày</Text>
                  </Card>
                </Col>
              </Row>

              {/* Nút đặt lịch */}
              <Button
                block
                size="large"
                icon={<CalendarOutlined />}
                style={{
                  height: "70px",
                  fontSize: "22px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #a8765a, #d4a574)",
                  border: "none",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(168,118,90,0.35)",
                }}
                onClick={() => navigate("/client/booking", { state: { service } })}
              >
               BOOK NOW
              </Button>
            </Space>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default ServicesDetail;