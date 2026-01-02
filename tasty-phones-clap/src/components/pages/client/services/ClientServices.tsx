// src/components/pages/client/services/ClientServices.tsx
import React from "react";
import { useTable } from "@refinedev/antd";
import { Row, Col, Typography, Spin, Alert, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./ClientServices.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

interface Service {
  service_id: number;
  service_name: string;
  description: string;
  service_price: string;
  service_image: string;
}

const ClientServices: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, tableQueryResult } = useTable<Service>({
    resource: "services",
  });

  const services = tableProps?.dataSource || [];
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const getImageUrl = (path: string) =>
    path
      ? `http://localhost:8000/storage/${path}`
      : "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";

  const handleViewDetails = (serviceId: number) => {
    navigate(`/client/services/${serviceId}`);
   // Thêm dòng này để chắc chắn URL được update trước khi component mount
  window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (isError) {
    return (
      <div style={{ padding: "80px 20px" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối đến server."}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => tableQueryResult?.refetch()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* ================== HERO BANNER ================== */}
      <div className="services-hero">
        <div className="hero-content">
          <h1 className="services-title">SERVICES</h1>
        </div>
      </div>

      {/* ================== SERVICE CARDS ================== */}
      <section className="services-section" style={{ padding: "40px 64px" }}>
        <div className="container">
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontFamily: "'Playfair Display', serif",
              fontSize: 42,
              color: "#000",
            }}
          >
            Our Services
          </Title>

          <Paragraph
            style={{
              textAlign: "center",
              marginBottom: 40,
              color: "#000",
              fontSize: 16,
            }}
          >
            Premium services for your comfort and relaxation
          </Paragraph>

          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Đang tải dịch vụ...
              </Text>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Chưa có dịch vụ nào
              </Text>
            </div>
          ) : (
        <Row gutter={[40, 60]} justify="center">
  {services.map((service) => (
    <Col xs={24} md={12} lg={12} xl={12} key={service.service_id}>
      {/* 2 card/hàng từ tablet trở lên, mobile 1 card */}
      <div 
        className="service-card-horizontal" 
        onClick={() => handleViewDetails(service.service_id)}
      >
        {/* Ảnh bên trái */}
        <div className="card-image-left">
          <img
            src={getImageUrl(service.service_image)}
            alt={service.service_name}
            onError={(e) => (e.target as HTMLImageElement).src = "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg"}
          />
        </div>

        {/* Nội dung bên phải */}
        <div className="card-content-right">
          <h3 className="card-title-h">{service.service_name}</h3>
          <div className="card-desc-h">
            {service.description || "Combo trọn gói bao gồm lều cao cấp, thức ăn BBQ, nước uống miễn phí và nhiều ưu đãi hấp dẫn khác."}
          </div>
          <div className="details-btn-h">
            <button>DETAILS SERVICES</button>
          </div>
        </div>
      </div>
    </Col>
  ))}
</Row>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientServices;
