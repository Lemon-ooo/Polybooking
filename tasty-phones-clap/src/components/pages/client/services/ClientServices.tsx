// src/components/pages/client/services/ClientServices.tsx

import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Spin,
  Alert,
  Empty,
  Card,
  Tag,
  Button,
} from "antd";
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
          <h1 className="hero-title">Services</h1>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="services-grid-section">
        <div className="container">

          {/* ============================= */}
          {/*         DỊCH VỤ HIỂN THỊ     */}
          {/* ============================= */}
          <section style={{ padding: "80px 64px" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Title
                level={2}
                style={{
                  fontSize: "36px",
                  fontWeight: 600,
                  color: "#000",
                  marginBottom: "16px",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Tất cả dịch vụ
              </Title>

              <Paragraph
                style={{
                  fontSize: "16px",
                  color: "#000",
                  maxWidth: "640px",
                  margin: "0 auto",
                }}
              >
                Tận hưởng những tiện ích cao cấp được thiết kế dành riêng cho bạn.
              </Paragraph>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "120px 0",
                }}
              >
                <Spin size="large" />
                <Text style={{ marginTop: 16, display: "block" }}>
                  Đang tải dịch vụ...
                </Text>
              </div>
            ) : error ? (
              <Alert message="Error" description={error} type="error" showIcon />
            ) : services.length === 0 ? (
              <Empty description="Hiện chưa có dịch vụ nào" />
            ) : (
              <Row
                gutter={[40, 40]}
                style={{ maxWidth: "1280px", margin: "0 auto" }}
              >
                {services.map((service: any) => (
                  <Col xs={24} sm={12} lg={8} key={service.id}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: "relative", overflow: "hidden" }}>
                          <img
                            src={
                              service.image ||
                              service.icon_url ||
                              "https://images.unsplash.com/photo-1591017403286-fd8493524d2f?w=800"
                            }
                            alt={service.name}
                            style={{
                              width: "100%",
                              height: "240px",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />

                          {service.price && (
                            <Tag
                              color="gold"
                              style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "4px 12px",
                                borderRadius: "999px",
                              }}
                            >
                              {parseFloat(
                                service.price.toString()
                              ).toLocaleString()}
                              ₫
                            </Tag>
                          )}
                        </div>
                      }
                      style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                      bodyStyle={{
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Title
                          level={4}
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#1f2937",
                            marginBottom: "8px",
                          }}
                        >
                          {service.name}
                        </Title>

                        <Paragraph
                          style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            marginBottom: "24px",
                          }}
                        >
                          {service.description ||
                            "Dịch vụ cao cấp mang lại trải nghiệm tuyệt vời cho bạn."}
                        </Paragraph>
                      </div>

                      <div style={{ textAlign: "center", marginTop: "auto" }}>
                        <Button
                          type="primary"
                          onClick={() =>
                            navigate(`/client/services/${service.id}`)
                          }
                          style={{
                            borderRadius: "999px",
                            padding: "12px 28px",
                            height: "auto",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
