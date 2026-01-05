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
    window.scrollTo(0, 0);
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
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="services-title">Services</h1>
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
            <Row gutter={[32, 32]} justify="center">
              {services.map((service) => (
                <Col xs={24} sm={12} md={8} lg={6} key={service.service_id}>
                  <Card
                    bodyStyle={{ padding: 0 }}
                    hoverable
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#fff",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewDetails(service.service_id)}
                  >
                    <div
                      style={{ width: "100%", height: 220, overflow: "hidden" }}
                    >
                      <img
                        src={getImageUrl(service.service_image)}
                        alt={service.service_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg")
                        }
                      />
                    </div>

                    <div style={{ padding: "20px" }}>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: "#8a6e5b",
                          fontSize: 22,
                          marginBottom: 8,
                        }}
                      >
                        {service.service_name}
                      </h3>

                      <p
                        style={{
                          color: "#444",
                          fontSize: 14,
                          lineHeight: 1.5,
                          marginBottom: 16,
                        }}
                      >
                        {service.description}
                      </p>

                      <Text strong style={{ fontSize: 16 }}>
                        Price:{" "}
                        {Number(service.service_price).toLocaleString("vi-VN")}₫
                      </Text>

                      <div style={{ textAlign: "right", marginTop: 12 }}>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#8a6e5b",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          Service Details
                        </button>
                      </div>
                    </div>
                  </Card>
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
