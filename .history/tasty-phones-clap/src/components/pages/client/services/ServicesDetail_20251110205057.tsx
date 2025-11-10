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

  useEffect(() => {
    if (!id) {
      setError("Không có ID dịch vụ hợp lệ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8000/api/services/${id}`)
      .then((res) => {
        const data = res.data.data ? res.data.data : res.data;
        setService({
          ...data,
          duration: data.duration || "60 phút",
          availability: data.availability || "Hàng ngày",
          features:
            data.features ||
            [
              "Chuyên viên giàu kinh nghiệm",
              "Không gian thư giãn",
              "Tinh dầu thiên nhiên",
              "Giảm căng thẳng, tăng năng lượng",
            ],
        });
      })
      .catch((err) => {
        console.error("Error fetching service detail:", err);
        setError("Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spin tip="Đang tải thông tin dịch vụ..." size="large" />
      </div>
    );

  if (error)
    return (
      <div className="p-6 flex justify-center">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );

  if (!service)
    return (
      <div className="p-6 flex justify-center">
        <Alert
          message="Không tìm thấy dịch vụ"
          description="Dịch vụ bạn tìm không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
        />
      </div>
    );

  return (
    <div style={{ padding: "100px 64px 64px" }}>
      {/* Nút quay lại */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/client/services")}
        style={{ marginBottom: "24px", fontSize: "16px" }}
      >
        Quay lại danh sách
      </Button>

      <Row gutter={[48, 48]}>
        {/* Ảnh dịch vụ */}
        <Col xs={24} lg={12}>
          <img
            src={service.image}
            alt={service.name}
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
              borderRadius: "16px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            }}
          />
        </Col>

        {/* Thông tin chi tiết */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Tiêu đề và mô tả */}
            <div>
              <Space align="center" wrap style={{ marginBottom: "16px" }}>
                <Title level={1} style={{ margin: 0, fontSize: "36px" }}>
                  {service.name}
                </Title>
                <Tag
                  color="orange"
                  style={{
                    fontSize: "18px",
                    padding: "8px 16px",
                    borderRadius: "999px",
                  }}
                >
                  {service.price.toLocaleString()}₫
                </Tag>
              </Space>
              <Paragraph style={{ fontSize: "16px", color: "#6b7280" }}>
                {service.description}
              </Paragraph>
            </div>

            <Divider />

            {/* Thông tin chi tiết */}
            <Card style={{ background: "#f9fafb", border: "none" }}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Space size={12}>
                  <ClockCircleOutlined
                    style={{ fontSize: "20px", color: "#1677ff" }}
                  />
                  <div>
                    <Text strong>Thời lượng:</Text>
                    <br />
                    <Text type="secondary">{service.duration}</Text>
                  </div>
                </Space>

                <Space size={12}>
                  <CheckCircleOutlined
                    style={{ fontSize: "20px", color: "#52c41a" }}
                  />
                  <div>
                    <Text strong>Thời gian hoạt động:</Text>
                    <br />
                    <Text type="secondary">{service.availability}</Text>
                  </div>
                </Space>

                <Space size={12}>
                  <DollarOutlined
                    style={{ fontSize: "20px", color: "#faad14" }}
                  />
                  <div>
                    <Text strong>Giá:</Text>
                    <br />
                    <Text type="secondary">
                      {service.price.toLocaleString()}₫ / dịch vụ
                    </Text>
                  </div>
                </Space>
              </Space>
            </Card>

            {/* Tính năng */}
            <div>
              <Title level={4} style={{ marginBottom: "16px" }}>
                Bao gồm
              </Title>
              <List
                dataSource={service.features}
                renderItem={(item) => (
                  <List.Item style={{ border: "none", padding: "8px 0" }}>
                    <Space>
                      <CheckCircleOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>

            {/* Nút hành động */}
            <Space size={16} style={{ width: "100%", marginTop: "24px" }}>
              <Button
                type="primary"
                size="large"
                block
                style={{
                  background: "#1677ff",
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "8px",
                }}
              >
                Đặt lịch ngay
              </Button>
              <Button
                size="large"
                block
                style={{
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "8px",
                }}
              >
                Liên hệ
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* Thông tin thêm */}
      <Card
        style={{
          marginTop: "64px",
          background: "#f9fafb",
          border: "none",
          borderRadius: "16px",
        }}
      >
        <Title level={4} style={{ marginBottom: "16px" }}>
          Thông tin quan trọng
        </Title>
        <Paragraph style={{ fontSize: "14px", color: "#6b7280" }}>
          • Vui lòng đặt lịch trước để đảm bảo có chỗ <br />
          • Hủy miễn phí trước 24 giờ <br />
          • Thanh toán tại quầy hoặc chuyển khoản <br />
          • Liên hệ để biết thêm ưu đãi nhóm <br />• Giá đã bao gồm thuế và phí
          dịch vụ
        </Paragraph>
      </Card>
    </div>
  );
};

export default ServicesDetail;
