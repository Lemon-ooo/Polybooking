// src/components/pages/client/gallery/ClientGallery.tsx

import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { Row, Col, Typography, Spin, Alert, Button, Pagination } from "antd";
import "./ClientGallery.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text } = Typography;

export const ClientGallery: React.FC = () => {
  const [currentImg, setCurrentImg] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  const { tableProps, tableQueryResult, setCurrent } = useTable<any>({
    resource: "galleries",
    pagination: { pageSize: 8, mode: "server" },
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
  });

  const galleries = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 8;

  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const openModal = (img: string) => {
    setCurrentImg(img);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handlePageChange = (page: number) => setCurrent?.(page);

  // Phân loại theo category
  const categories = [...new Set(galleries.map((g) => g.gallery_category))];

  if (isError) {
    return (
      <div style={{ padding: "80px 20px" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối server"}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => tableQueryResult?.refetch()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="client-gallery-container">
      {/* HERO BANNER */}
      <div className="gallery-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Thư Viện Hình Ảnh</h1>
        </div>
      </div>

      {/* GALLERY CONTENT */}
      <div className="gallery-content-section">
        <div className="container">
          {isLoading ? (
            <div className="loading-container gallery-loading">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block" }}>
                Đang tải hình ảnh...
              </Text>
            </div>
          ) : galleries.length === 0 ? (
            <div className="empty-state gallery-empty">
              <Text type="secondary" style={{ fontSize: 16 }}>
                Chưa có hình ảnh nào.
              </Text>
            </div>
          ) : (
            <>
              {categories.map((category) => {
                const categoryItems = galleries.filter(
                  (g) => g.gallery_category === category
                );
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="gallery-category-section">
                    <div className="category-header">
                      <Title level={2} className="category-title">
                        {category}
                      </Title>
                    </div>

                    <Row gutter={[16, 16]} className="gallery-grid">
                      {categoryItems.map((item) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                          <div
                            className="gallery-item fade-in"
                            onClick={() => openModal(item.image_url)}
                          >
                            <div className="gallery-image-wrapper">
                              <img
                                src={item.image_url}
                                alt={item.caption || "Image"}
                                className="gallery-thumbnail"
                                onError={(e) =>
                                  ((e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop")
                                }
                              />
                              <div className="image-overlay">
                                <div className="overlay-content">
                                  <Text className="view-text">XEM ẢNH</Text>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                );
              })}

              {/* PAGINATION */}
              {total > pageSize && (
                <div className="pagination-container gallery-pagination">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={handlePageChange}
                    showTotal={(total, range) =>
                      `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} ảnh`
                    }
                    size="small"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {modalVisible && (
        <div className="gallery-modal-overlay" onClick={closeModal}>
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeModal}>
              ×
            </button>
            <img src={currentImg} alt="Preview" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};
