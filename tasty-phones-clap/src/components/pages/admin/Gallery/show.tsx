import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Card, Typography, Spin, Button, message } from "antd";
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
      .get(`/galleries/${id}`) // ✅ SỬA ĐÚNG ENDPOINT
      .then((res) => {
        const data = res.data.data || res.data;
        console.log("✅ Gallery response:", data); // debug
        setGallery(data);
      })
      .catch((err) => {
        console.error("❌ Lỗi API:", err);
        message.error("Không tải được ảnh!");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={4}>❌ Không tìm thấy ảnh</Title>
      </div>
    );
  }

  // ✅ XỬ LÝ ẢNH AN TOÀN
  const imageSrc =
    gallery.image_url ||
    (gallery.image || gallery.image_path
      ? `${BASE_URL}${gallery.image || gallery.image_path}`.replace(
          "/storage/storage/",
          "/storage/"
        )
      : "/no-image.png");

  return (
    <Card
      style={{ maxWidth: 1000, margin: "0 auto", marginTop: 32, padding: 24 }}
    >
      <Title level={2}>Chi tiết ảnh</Title>

      <Paragraph>
        <Text strong>ID:</Text> {gallery.gallery_id || gallery.id}
      </Paragraph>

      <Paragraph>
        <Text strong>Nhóm ảnh:</Text>{" "}
        {gallery.gallery_category || "Không có nhóm"}
      </Paragraph>

      <Paragraph>
        <Text strong>Caption:</Text>{" "}
        {gallery.caption || "Không có chú thích"}
      </Paragraph>

      <Paragraph>
        <Text strong>Ngày tạo:</Text>{" "}
        {gallery.created_at
          ? new Date(gallery.created_at).toLocaleString("vi-VN")
          : "—"}
      </Paragraph>

      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh:</Text>
        <br />
        <img
          src={imageSrc}
          alt={gallery.caption || "Gallery image"}
          style={{
            width: 350,
            maxWidth: "100%",
            borderRadius: 10,
            marginTop: 10,
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/no-image.png";
          }}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <Link to="/admin/galleries">
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            style={{ borderRadius: 8 }}
          >
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default GalleryShow;
