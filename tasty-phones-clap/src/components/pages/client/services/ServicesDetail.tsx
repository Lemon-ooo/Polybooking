import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import {
  Row,
  Col,
  Tag,
  Spin,
  Space,
  Typography,
  Divider,
  Button,
} from "antd";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "./ServicesDetail.css";

const { Title, Paragraph, Text } = Typography;
const STORAGE_URL = "http://localhost:8000/storage/";

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

  if (!id || id === "undefined" || loading || !service) {
    // Giữ nguyên phần loading/error như trước (bạn có thể copy từ phiên bản cũ)
    return (
      <div className="services-loading-container">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <>
      {/* BANNER GIỮ NGUYÊN */}
      <div className="services-hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">SERVICES</h1>
        </div>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="services-back-button"
        >
          Back
        </Button>
      </div>

      {/* MAIN CONTENT - RỘNG HƠN */}
      <section className="services-content-section">
        <Row gutter={[100, 100]} justify="center">
          {" "}
          {/* Tăng gutter */}
          <Col xs={24} lg={12}>
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
          <Col xs={24} lg={12}>
            <Space direction="vertical" size={48} style={{ width: "100%" }}>
              {" "}
              {/* Tăng size */}
              {/* Title + Price */}
              <div>
                <Title level={1} className="services-title">
                  {service.service_name}
                </Title>
                <Tag className="services-price-tag">
                  {formatPrice(service.service_price)}
                </Tag>
              </div>
              <div>
                <Title level={3} className="services-subtitle">
                  Description
                </Title>
                <Paragraph className="services-description">
                  {service.description ||
                    "Premium treatment with advanced techniques..."}
                </Paragraph>
              </div>
              {/* Lợi ích của phòng */}
              {/* Trải nghiệm khi lưu trú */}
              <div>
                <Title level={3} className="services-subtitle">
                  <InfoCircleOutlined /> Accommodation experience
                </Title>
                <Paragraph className="services-text">
                  When using our services, you will receive a warm welcome in a
                  comfortable and professional environment. Our experienced
                  staff will provide detailed advice and dedicated support to
                  best meet your needs. We always pay attention to every small
                  detail to ensure maximum satisfaction. Our services are
                  available 24/7, guaranteeing the most convenient and complete
                  experience.
                </Paragraph>
              </div>
              <Divider />
              <div className="services-contact-section">
                <Title level={4} className="services-contact-title">
                  <PhoneOutlined /> Ready to indulge?
                </Title>
                <Paragraph className="services-contact-text">
                  Try our service. We are committed to providing you with the
                  best experience.
                  <br />
                  Phone: <strong>+84 (123 456 789)</strong> | Email:{" "}
                  <strong>services@polyhotel.com</strong>
                </Paragraph>
              </div>
            </Space>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default ServicesDetail;
