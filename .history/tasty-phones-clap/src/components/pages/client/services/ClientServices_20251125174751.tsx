// src/components/pages/client/services/ClientServices.tsx
import React from "react";
import { useTable } from "@refinedev/antd";
import { Row, Col, Typography, Spin, Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./ClientServices.css";

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
    pagination: { pageSize: 20 },
    parseResponse: (response: any) => ({
      data: response.data,
      total: response.total,
    }),
  });

  const services = tableProps?.dataSource || [];
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const handleViewDetails = (serviceId: number) => {
    navigate(`/client/services/${serviceId}`);
    window.scrollTo(0, 0);
  };

  const getImageUrl = (path: string) => {
    if (!path)
      return "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000/${path}`;
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
      {/* HERO */}
      <div className="services-hero">
        <div className="hero-content">
          <h1>ENJOY YOUR EXPERIENCE</h1>
          <p>Like Never Before!</p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="services-section">
        <div className="container">
          {isLoading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Đang tải dịch vụ...
              </Text>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <Text type="secondary" style={{ fontSize: 16 }}>
                Chưa có dịch vụ nào
              </Text>
            </div>
          ) : (
            <Row gutter={[32, 32]}>
              {services.map((service) => (
                <Col xs={24} sm={12} md={12} lg={8} key={service.service_id}>
                  <div
                    className="service-card"
                    onClick={() => handleViewDetails(service.service_id)}
                  >
                    <div className="card-image">
                      <img
                        src={getImageUrl(service.service_image)}
                        alt={service.service_name}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg")
                        }
                      />
                    </div>
                    <div className="card-body">
                      <Title level={4}>
                        {service.service_name.toUpperCase()}
                      </Title>
                      <Paragraph>{service.description}</Paragraph>
                      <Text strong style={{ fontSize: 16 }}>
                        Giá từ: {Number(service.service_price).toLocaleString()}
                        ₫
                      </Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientServices;
