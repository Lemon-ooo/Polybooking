// src/components/pages/client/gallery/ClientGallery.tsx
import React, { useState } from "react";
import { useList } from "@refinedev/core";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Alert,
  Pagination,
  Modal,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./ClientGallery.css";
import { IGallery, GalleryListResponse } from "../../../../interfaces/rooms";

const { Title, Text } = Typography;

export const ClientGallery: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentImg, setCurrentImg] = useState<string>("");

  // Lấy dữ liệu gallery từ API
  const { data, isLoading, isError } = useList<GalleryListResponse>({
    resource: "galleries",
    pagination: { pageSize: 8 },
  });

  // Flatten tất cả category thành 1 mảng duy nhất
  const galleries: IGallery[] = [];
  if (data?.data) {
    Object.values(data.data).forEach((arr) => {
      galleries.push(...arr);
    });
  }
  const total = galleries.length;

  const openModal = (img: string) => {
    setCurrentImg(img);
    setVisible(true);
  };
  const closeModal = () => setVisible(false);

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    return `${window.location.origin}/storage/${path}`;
  };

  if (isLoading) {
    return (
      <div className="client-gallery-loading">
        <Spin size="large" />
        <Text>Đang tải thư viện ảnh...</Text>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải dữ liệu thư viện ảnh."
        type="error"
        showIcon
        style={{ margin: 20 }}
      />
    );
  }

  return (
    <div className="client-gallery-container">
      {/* Banner */}
      <div className="gallery-hero-banner">
        <div>
          <Title level={2} style={{ color: "white" }}>
            🌟 Thư viện ảnh 🌟
          </Title>
          <Text style={{ color: "white", opacity: 0.9 }}>
            Những khoảnh khắc đáng nhớ từ Homestay Poly
          </Text>
        </div>
      </div>

      {total === 0 ? (
        <Alert
          message="Chưa có ảnh"
          description="Hiện tại chưa có ảnh nào được thêm từ Admin Panel."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
      ) : (
        <>
          <Row gutter={[32, 32]}>
            {galleries.map((gallery) => (
              <Col xs={24} sm={12} lg={8} key={gallery.gallery_id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={gallery.caption || `Ảnh ${gallery.gallery_id}`}
                      src={getImageUrl(gallery.image_path)}
                      style={{ height: 200, objectFit: "cover" }}
                      onClick={() => openModal(getImageUrl(gallery.image_path))}
                    />
                  }
                >
                  <Card.Meta title={gallery.caption || "Không có mô tả"} />
                </Card>
              </Col>
            ))}
          </Row>

          {total > 8 && (
            <div className="client-gallery-pagination">
              <Pagination
                defaultPageSize={8}
                total={total}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      {/* Modal xem ảnh lớn */}
      <Modal
        open={visible}
        footer={null}
        onCancel={closeModal}
        centered
        closable={true}
        maskStyle={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        closeIcon={
          <CloseOutlined
            style={{
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "50%",
              padding: 4,
            }}
          />
        }
        bodyStyle={{
          padding: 0,
          background: "transparent",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={currentImg}
          alt="large"
          style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
        />
      </Modal>
    </div>
  );
};
