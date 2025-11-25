// src/components/pages/client/services/ClientServices.tsx

import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Alert, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClientServices.css";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
}

const ClientServices: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/services")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setServices(data);
      })
      .catch(() => setError("Không thể tải dịch vụ."))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path: string) => {
    if (!path)
      return "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000${path.startsWith("/") ? "" : "/"}${path}`;
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

          {loading ? (
            <div className="loading">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert message="Lỗi" description={error} type="error" showIcon />
          ) : services.length === 0 ? (
            <Empty description="Chưa có dịch vụ nào" />
          ) : (
            <Row gutter={[32, 32]}>
              {services.map((sv) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={sv.id}>
                  <div
                    className="service-card"
                    onClick={() => {
                      navigate(`/client/services/${sv.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="card-image">
                      <img
                        src={getImageUrl(sv.image)}
                        alt={sv.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
                        }}
                      />
                      <div className="offer-badge">HOT</div>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title">{sv.name.toUpperCase()}</h3>
                      <p className="card-desc">{sv.description}</p>

                      <div className="card-price">
                        <span className="from">Từ</span>
                        <span className="price">
                          {Number(sv.price).toLocaleString()}₫
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
