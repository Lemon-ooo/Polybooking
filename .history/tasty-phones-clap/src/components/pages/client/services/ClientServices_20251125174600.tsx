// src/components/pages/client/services/ClientServices.tsx
import React from "react";
import { useTable } from "@refinedev/core";
import { Row, Col, Spin, Alert, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import "./ClientServices.css";

interface Service {
  service_id: number;
  service_name: string;
  description: string;
  service_price: string; // API trả về string
  service_image: string;
}

const ClientServices: React.FC = () => {
  const navigate = useNavigate();

  // --- useTable lấy dữ liệu services ---
  const { tableQueryResult } = useTable<Service>({
    resource: "services",
    pagination: { pageSize: 20 },
    parseResponse: (response: any) => ({
      data: response.data,
      total: response.total,
    }),
  });

  const services = tableQueryResult?.data || [];
  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const getImageUrl = (path: string) => {
    if (!path)
      return "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000/${path}`;
  };

  return (
    <div className="services-page">
      {/* HERO */}
      <div className="services-hero">
        <div className="hero-content">
          <h1>ENJOY YOUR EXPERIENCE</h1>
          <p>Like Never Before!</p>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="services-section">
        <div className="container">
          <h2 className="section-title">DỊCH VỤ CAO CẤP</h2>

          {isLoading ? (
            <div className="loading">
              <Spin size="large" />
            </div>
          ) : isError ? (
            <Alert
              message="Lỗi"
              description={error?.message || "Không thể tải dịch vụ."}
              type="error"
              showIcon
            />
          ) : services.length === 0 ? (
            <Empty description="Chưa có dịch vụ nào" />
          ) : (
            <Row gutter={[32, 32]}>
              {services.map((sv) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={sv.service_id}>
                  <div
                    className="service-card"
                    onClick={() => {
                      navigate(`/client/services/${sv.service_id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="card-image">
                      <img
                        src={getImageUrl(sv.service_image)}
                        alt={sv.service_name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
                        }}
                      />
                      <div className="offer-badge">HOT</div>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title">
                        {sv.service_name.toUpperCase()}
                      </h3>
                      <p className="card-desc">{sv.description}</p>

                      <div className="card-price">
                        <span className="from">Từ</span>
                        <span className="price">
                          {Number(sv.service_price).toLocaleString()}₫
                        </span>
                      </div>

                      <button className="book-now-btn">BOOK NOW</button>
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
