import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Card, Typography, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const BASE_URL = "http://localhost:8000/storage/";

export const GalleryShow: React.FC = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axiosInstance
      .get(`/gallery/${id}`)
      .then((res) => setGallery(res.data.data || res.data))
      .catch((err) => console.error("❌ Lỗi API:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" />
      </div>
    );

  if (!gallery)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={4}>❌ Không tìm thấy ảnh</Title>
      </div>
    );

  return (
    <Card
      style={{ maxWidth: 10000, margin: "0 auto", marginTop: 32, padding: 24 }}
    >
      <Title level={2}>Chi tiết ảnh</Title>

      <Paragraph>
        <Text strong>ID:</Text> {gallery.gallery_id}
      </Paragraph>

      <Paragraph>
        <Text strong>Nhóm ảnh:</Text>{" "}
        {gallery.gallery_category || "Không có nhóm"}
      </Paragraph>

      <Paragraph>
        <Text strong>Caption:</Text> {gallery.caption || "Không có chú thích"}
      </Paragraph>

      <Paragraph>
        <Text strong>Ngày tạo:</Text>{" "}
        {new Date(gallery.created_at).toLocaleString("vi-VN")}
      </Paragraph>

      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh:</Text>
        <br />
        <img
          src={
            gallery.image_path
              ? `${BASE_URL}${gallery.image_path}`
              : "/no-image.png"
          }
          alt="Gallery"
          style={{ width: 350, borderRadius: 10, marginTop: 10 }}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <Link to="/admin/gallery">
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

export default GalleryShow;
