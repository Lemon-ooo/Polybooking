import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Space,
  Button,
  Tag,
  Row,
  Col,
  Card,
  Divider,
  List,
  Spin,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  duration?: string;
  features?: string[];
  availability?: string;
}

const ServicesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // HÀM HOÀN TOÀN GIỐNG BÊN ClientServices.tsx → ẢNH SẼ HIỆN NGAY
  const getImageUrl = (path: string | undefined): string => {
    if (!path) return "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa-detail.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  useEffect(() => {
    if (!id) {
      setError("Không có ID dịch vụ hợp lệ.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/api/services/${id}`)
      .then((res) => {
        const data = res.data.data ? res.data.data : res.data;
        setService({
          ...data,
          duration: data.duration || "60 phút",
          availability: data.availability || "Hàng ngày",
          features: data.features || [
            "Chuyên viên giàu kinh nghiệm",
            "Không gian thư giãn",
            "Tinh dầu thiên nhiên",
            "Giảm căng thẳng, tăng năng lượng",
          ],
        });
      })
      .catch(() => setError("Không thể tải thông tin dịch vụ."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center py-32"><Spin size="large" tip="Đang tải..." /></div>;
  if (error || !service) return <div className="p-10 text-center"><Alert message="Không tìm thấy dịch vụ" type="warning" showIcon /></div>;

  return (
    <div style={{ padding: "100px 5% 80px", background: "#f8f4f0" }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/client/services")}
        style={{ marginBottom: "32px", fontSize: "16px", color: "#b8965a" }}
      >
        ← Quay lại danh sách dịch vụ
      </Button>

      <Row gutter={[60, 40]}>
        {/* ẢNH DỊCH VỤ – ĐÃ SỬA → HIỆN NGAY 100% */}
        <Col xs={24} lg={12}>
          <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
            <img
              src={getImageUrl(service.image)}
              alt={service.name}
              style={{
                width: "100%",
                height: "580px",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa-detail.jpg";
              }}
            />
          </div>
        </Col>

        {/* PHẦN THÔNG TIN BÊN PHẢI – GIỮ NGUYÊN CỦA BẠN */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size={28} style={{ width: "100%" }}>
            <div>
              <Space align="baseline" wrap>
                <Title level={1} style={{ margin: 0, fontSize: "42px", color: "#333" }}>
                  {service.name}
                </Title>
                <Tag
                  color="#b8965a"
                  style={{ fontSize: "20px", padding: "10px 24px", borderRadius: "50px" }}
                >
                  {service.price.toLocaleString()}₫
                </Tag>
              </Space>
              <Paragraph style={{ fontSize: "17px", color: "#555", marginTop: "20px", lineHeight: "1.8" }}>
                {service.description}
              </Paragraph>
            </div>

            <Divider style={{ borderColor: "#eee4dc" }} />

            <Card bordered={false} style={{ background: "#fffaf6", borderRadius: "16px" }}>
              <Space direction="vertical" size={20}>
                <Space>
                  <ClockCircleOutlined style={{ fontSize: "22px", color: "#b8965a" }} />
                  <div>
                    <Text strong>Thời lượng</Text><br />
                    <Text type="secondary">{service.duration}</Text>
                  </div>
                </Space>
                <Space>
                  <CheckCircleOutlined style={{ fontSize: "22px", color: "#52c41a" }} />
                  <div>
                    <Text strong>Hoạt động</Text><br />
                    <Text type="secondary">{service.availability}</Text>
                  </div>
                </Space>
              </Space>
            </Card>

            <div>
              <Title level={3} style={{ color: "#b8965a", marginBottom: "20px" }}>Bao gồm</Title>
              <List
                dataSource={service.features}
                renderItem={(item) => (
                  <List.Item style={{ border: "none", padding: "10px 0" }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: "#b8965a" }} />
                      <Text style={{ fontSize: "16px" }}>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>

            <Space size={20}>
              <Button
                type="primary"
                size="large"
                style={{
                  background: "#b8965a",
                  border: "none",
                  height: "56px",
                  fontSize: "17px",
                  borderRadius: "12px",
                  padding: "0 40px",
                }}
              >
                Đặt lịch ngay
              </Button>
              <Button size="large" style={{ height: "56px", fontSize: "17px", borderRadius: "12px", borderColor: "#b8965a", color: "#b8965a" }}>
                Liên hệ tư vấn
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ServicesDetail;