// src/components/pages/client/services/ClientServices.tsx

import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Spin, Alert, Empty, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClientServices.css";

const { Title, Paragraph, Text } = Typography;

interface Service {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
}

export const ClientServices: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/services")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setServices(data);
      })
      .catch(() => setError("Không thể tải dịch vụ."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="client-services-container">
      {/* HERO BANNER */}
      <div className="services-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Our Services</h1>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="services-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text style={{ marginTop: 16 }}>Loading services...</Text>
            </div>
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : services.length === 0 ? (
            <Empty description="No services available" />
          ) : (
            <>
              {/* HEADER */}
              <div className="premier-deluxe-header">
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-left.svg"
                  className="star-icon"
                />
                <Title level={1} className="premier-deluxe-title">
                  Our Premium Services
                </Title>
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-right.svg"
                  className="star-icon"
                />
              </div>

              {/* SERVICES GRID */}
              <Row gutter={[32, 32]} className="room-category-grid">
                {services.map((sv) => (
                  <Col xs={24} md={12} key={sv.id}>
                    <div
                      className="service-item fade-in"
                      onClick={() => {
                        navigate(`/client/services/${sv.id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="service-image-wrapper">
                        <img
                          src={sv.image}
                          alt={sv.name}
                          className="service-thumbnail"
                        />
                        <div className="price-tag">
                          {parseFloat(sv.price.toString()).toLocaleString()}₫
                        </div>
                      </div>

                      <div className="service-content">
                        <Title level={4} className="service-title">
                          {sv.name.toUpperCase()}
                        </Title>
                        <Paragraph className="service-desc">
                          {sv.description}
                        </Paragraph>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
