// src/components/pages/client/services/ServicesDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import {
  Row,
  Col,
  Button,
  Tag,
  Card,
  Spin,
  Alert,
  Space,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "./ServicesDetail.css"; // ← Thêm import CSS mới

const { Title, Paragraph, Text } = Typography;
const STORAGE_URL = "http://localhost:8000/storage/";

const BANNER_IMAGE =
  "https://ruedelamourhotel.com/wp-content/uploads/2025/02/2.jpg";

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
      <div className="services-error-container">
        <Alert
          message="Lỗi đường dẫn"
          description="Không tìm thấy ID dịch vụ."
          type="error"
          showIcon
        />
        <Button
          type="primary"
          size="large"
          className="services-back-btn"
          onClick={() => navigate("/client/services")}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="services-loading-container">
        <Spin size="large" tip="Đang tải thông tin dịch vụ..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="services-error-container">
        <Alert
          message="Không tìm thấy dịch vụ"
          description="Dịch vụ có thể đã bị xóa."
          type="warning"
          showIcon
        />
        <Button
          type="primary"
          size="large"
          className="services-back-btn"
          onClick={() => navigate("/client/services")}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* ====================== BANNER ====================== */}
      <div className="services-hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">SERVICES</h1>
          {/* Nếu muốn thêm subtitle */}
          {/* <p className="hero-subtitle">Khám phá các dịch vụ cao cấp</p> */}
        </div>

        {/* Nút quay lại */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="services-back-button"
        >
          Quay lại
        </Button>
      </div>

      {/* ====================== NỘI DUNG CHÍNH ====================== */}
      <section className="services-content-section">
        <Row gutter={[32, 32]} justify="center">
          {/* Ảnh dịch vụ */}
          <Col xs={24} lg={10}>
            <div className="services-image-wrapper">
              <img
                src={serviceImageUrl}
                alt={service.service_name}
                className="services-main-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
                }}
              />
            </div>
          </Col>

          {/* Thông tin chi tiết */}
          <Col xs={24} lg={14}>
            <Space direction="vertical" size={44} style={{ width: "100%" }}>
              {/* Tên + Giá */}
              <div>
                <Title level={1} className="services-title">
                  {service.service_name}
                </Title>

                <Tag className="services-price-tag">
                  {formatPrice(service.service_price)}
                </Tag>
              </div>

              {/* Mô tả */}
              <div>
                <Title level={3} className="services-subtitle">
                  Mô tả dịch vụ
                </Title>
                <Paragraph className="services-description">
                  {service.description ||
                    "Liệu trình chăm sóc cao cấp với các kỹ thuật chuyên sâu, sử dụng nguyên liệu thiên nhiên 100%, mang đến sự thư giãn tuyệt đối và tái tạo năng lượng hoàn hảo cho cơ thể và tâm hồn."}
                </Paragraph>
              </div>

              {/* Thông tin bổ sung */}
              <Row gutter={[32,32]}>
                <Col span={12}>
                  <Card className="services-info-card">
                    <ClockCircleOutlined className="services-info-icon" />
                    <Text strong className="services-info-title">
                      Thời lượng: 
                    </Text>
                    <Text type="secondary" className="services-info-text">
                       60 – 90 phút
                    </Text>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="services-info-card">
                    <CheckCircleOutlined className="services-success-icon" />
                    <Text strong className="services-info-title">
                      Giờ mở cửa:
                    </Text>
                    <Text type="secondary" className="services-info-text">
                      08:00 – 22:00 hàng ngày
                    </Text>
                  </Card>
                </Col>
              </Row>

              {/* Nút đặt lịch */}
              <Button
                block
                size="large"
                icon={<CalendarOutlined />}
                className="services-book-button"
                onClick={() =>
                  navigate("/client/booking", { state: { service } })
                }
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
