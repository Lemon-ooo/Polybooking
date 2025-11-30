import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Card, Typography, Spin, Button, Tag, Image } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const BASE_URL = "http://localhost:8000/storage/";

export const AmenitiesShow: React.FC = () => {
  const { id } = useParams();
  const [amenity, setAmenity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    axiosInstance
      .get(`/amenities/${id}`)
      .then((res) => {
        const item = res.data.data || res.data;
        setAmenity(item);
      })
      .catch((err) => {
        console.error("❌ Lỗi API:", err);
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

  if (!amenity)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={4}>❌ Không tìm thấy tiện ích</Title>
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
      <Title level={2}>Chi tiết tiện ích</Title>

      <Paragraph>
        <Text strong>ID:</Text> {amenity.amenity_id}
      </Paragraph>

      <Paragraph>
        <Text strong>Tên tiện ích:</Text> {amenity.amenity_name}
      </Paragraph>

      <Paragraph>
        <Text strong>Mô tả:</Text>
        <br />
        {amenity.description || "Không có mô tả"}
      </Paragraph>

      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh tiện ích:</Text>
        <br />
        <Image
          src={`${BASE_URL}${amenity.amenity_image}`}
          width={260}
          style={{ borderRadius: 10, marginTop: 10 }}
          alt="Amenity"
          fallback="/no-image.png"
        />
      </div>
      <div style={{ marginTop: 32 }}>
        <Link to="/admin/amenities">
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

export default AmenitiesShow;
