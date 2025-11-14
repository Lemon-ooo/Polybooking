// src/components/pages/client/gallery/ClientGallery.tsx

import React, { useState } from "react";
import { useCustom } from "@refinedev/core";
import { Row, Col, Card, Pagination, Modal, Typography, Spin } from "antd";

const { Title } = Typography;

export const ClientGallery: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImg, setCurrentImg] = useState("");

  // 🔥 GỌI API CUSTOM CHUẨN CHO LARAVEL
  const { data, isLoading, isError } = useCustom({
    url: "/galleries",
    method: "get",
    queryOptions: {
      retry: false,
    },
  });

  // API Laravel trả về: { success, data: [...] }
  const items = data?.data?.data || [];

  // Pagination
  const pageSize = 8;
  const [current, setCurrent] = useState(1);

  const paginated = items.slice((current - 1) * pageSize, current * pageSize);

  // Preview Image
  const openModal = (img: string) => {
    setCurrentImg(img);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const getImageUrl = (path?: string) =>
    path
      ? `${window.location.origin}/storage/${path}`
      : "https://via.placeholder.com/400x300?text=No+Image";

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );

  if (isError)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Title level={4}>Không thể tải dữ liệu gallery.</Title>
      </div>
    );

  return (
    <div className="gallery-container" style={{ padding: "40px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        Thư Viện Hình Ảnh
      </Title>

      <Row gutter={[24, 24]}>
        {paginated.map((item: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{ height: 220, objectFit: "cover" }}
                  onClick={() => openModal(getImageUrl(item.image))}
                />
              }
            >
              <Card.Meta
                title={item.name}
                description={item.category ?? "Uncategorized"}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={items.length}
          onChange={(page) => setCurrent(page)}
        />
      </div>

      {/* MODAL PREVIEW */}
      <Modal open={modalVisible} footer={null} onCancel={closeModal} centered>
        <img
          src={currentImg}
          alt="Preview"
          style={{ width: "100%", borderRadius: 8 }}
        />
      </Modal>
    </div>
  );
};
