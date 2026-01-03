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
import "./ServicesDetail.css";

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
        console.error("Error loading service:", err);
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
    if (!price || price == 0) return "Contact us";
    const num = Number(price);
    return isNaN(num) ? "Contact us" : num.toLocaleString("en-US") + "$";
  };

  // Invalid ID
  if (!id || id === "undefined") {
    return (
      <div className="services-error-container">
        <Alert
          message="Invalid URL"
          description="Service ID not found."
          type="error"
          showIcon
        />
        <Button
          type="primary"
          size="large"
          className="services-back-btn"
          onClick={() => navigate("/client/services")}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="services-loading-container">
        <Spin size="large" tip="Loading service information..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="services-error-container">
        <Alert
          message="Service Not Found"
          description="The service may have been removed."
          type="warning"
          showIcon
        />
        <Button
          type="primary"
          size="large"
          className="services-back-btn"
          onClick={() => navigate("/client/services")}
        >
          Go Back
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
        </div>

        {/* Back button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="services-back-button"
        >
          Back
        </Button>
      </div>

      {/* ====================== MAIN CONTENT ====================== */}
      <section className="services-content-section">
        <Row gutter={[32, 32]} justify="center">
          {/* Service image */}
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

          {/* Service details */}
          <Col xs={24} lg={14}>
            <Space direction="vertical" size={44} style={{ width: "100%" }}>
              {/* Name + Price */}
              <div>
                <Title level={1} className="services-title">
                  {service.service_name}
                </Title>

                <Tag className="services-price-tag">
                  {formatPrice(service.service_price)}
                </Tag>
              </div>

              {/* Description */}
              <div>
                <Title level={3} className="services-subtitle">
                  Service Description
                </Title>
                <Paragraph className="services-description">
                  {service.description ||
                    "Premium treatment with advanced techniques, using 100% natural ingredients, delivering ultimate relaxation and perfect energy restoration for body and soul."}
                </Paragraph>
              </div>

              {/* Additional info */}
              <Row gutter={[32, 32]}>
                <Col span={12}>
                  <Card className="services-info-card">
                    <ClockCircleOutlined className="services-info-icon" />
                    <Text strong className="services-info-title">
                      Duration:
                    </Text>
                    <Text type="secondary" className="services-info-text">
                      60 – 90 minutes
                    </Text>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="services-info-card">
                    <CheckCircleOutlined className="services-success-icon" />
                    <Text strong className="services-info-title">
                      Opening Hours:
                    </Text>
                    <Text type="secondary" className="services-info-text">
                      08:00 – 22:00 daily
                    </Text>
                  </Card>
                </Col>
              </Row>

              {/* Booking button */}
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