import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Card, Typography, Spin, Button, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const BASE_URL = "http://localhost:8000/storage/";

export const ServicesShow: React.FC = () => {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    axiosInstance
      .get(`/services/${id}`)
      .then((res) => {
        const item = res.data.data || res.data;
        if (!item || typeof item !== "object") {
          console.error("❌ Dữ liệu API không hợp lệ");
          return;
        }
        setService(item);
      })
      .catch((err) => {
        console.log("❌ Lỗi API: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" />
      </div>
    );

  if (!service)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={4}>❌ Không tìm thấy dịch vụ</Title>
      </div>
    );

  return (
    <Card
      style={{
        maxWidth: 10000,
        margin: "0 auto",
        marginTop: 32,
        padding: 24,
      }}
    >
      <Title level={2}>Chi tiết dịch vụ</Title>

      <Paragraph>
        <Text strong>ID:</Text> {service.service_id}
      </Paragraph>

      <Paragraph>
        <Text strong>Tên dịch vụ:</Text> {service.service_name}
      </Paragraph>

      <Paragraph>
        <Text strong>Mô tả:</Text>
        <br />
        {service.description || "Không có mô tả"}
      </Paragraph>

      <Paragraph>
        <Text strong>Giá:</Text>{" "}
        <Tag color="green">
          {Number(service.service_price).toLocaleString()} VNĐ
        </Tag>
      </Paragraph>

      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh dịch vụ:</Text>
        <br />
        <img
          src={`${BASE_URL}${service.service_image}`}
          alt="Service"
          style={{ width: 300, borderRadius: 10, marginTop: 10 }}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <Link to="/admin/services">
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            style={{
              borderRadius: 8,
              padding: "6px 16px",
              backgroundColor: "#1677ff",
            }}
          >
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    </Card>
  );
};
