import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Spin,
  Empty,
  Alert,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Paragraph } = Typography;

interface Service {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
}

export const ClientServices: React.FC = () => {
  const navigate = useNavigate();
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/services")
      .then((res) => {
        console.log("📦 API response:", res.data);

        // ✅ API của bạn trả về: { data: [ ... ], message: "...", success: true }
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array");
        }

        setServicesData(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching services:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load services. Please try again later."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "100px 64px 64px", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <Title
          level={1}
          style={{
            fontSize: "40px",
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: "16px",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Client Services
        </Title>
        <Paragraph
          style={{
            fontSize: "16px",
            color: "#6b7280",
            maxWidth: "672px",
            margin: "0 auto",
          }}
        >
          Explore our client-specific services and enhance your experience with
          comfort, convenience, and style.
        </Paragraph>
      </div>

      {/* Trạng thái tải dữ liệu */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ maxWidth: 600, margin: "0 auto 40px" }}
        />
      ) : servicesData.length === 0 ? (
        <Empty description="No services available" />
      ) : (
        <Row gutter={[40, 40]} style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {servicesData.map((service) => (
            <Col xs={24} sm={12} lg={8} key={service.id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={service.image}
                      alt={service.name}
                      style={{
                        width: "100%",
                        height: "256px",
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
                    <Tag
                      color="orange"
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
                      {parseFloat(service.price.toString()).toLocaleString()}₫
                    </Tag>
                  </div>
                }
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
                    {service.description}
                  </Paragraph>
                </div>

                <div style={{ textAlign: "center", marginTop: "auto" }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      if (!service.id) {
                        console.error("⚠️ Missing service.id:", service);
                        return;
                      }
                      navigate(`/client/services/${service.id}`);
                      window.scrollTo(0, 0);
                    }}
                    style={{
                      background: "#1677ff",
                      borderRadius: "999px",
                      padding: "12px 28px",
                      height: "auto",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
