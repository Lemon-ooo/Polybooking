// src/components/pages/client/gallery/ClientGallery.tsx

import React, { useState } from "react";
import { useCustom } from "@refinedev/core";
import { Row, Col, Typography, Spin, Alert, Pagination, Button } from "antd";
import "./ClientGallery.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text } = Typography;

export const ClientGallery: React.FC = () => {
  const [currentImg, setCurrentImg] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 🔥 GỌI API CUSTOM CHUẨN CHO LARAVEL
  const { data, isLoading, isError, error, refetch } = useCustom({
    url: "/galleries",
    method: "get",
    queryOptions: {
      retry: false,
    },
  });

  // API Laravel trả về: { success, data: [...] }
  const items = data?.data?.data || [];
  const total = data?.data?.meta?.total || items.length;

  // Pagination
  const paginated = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Preview Image
  const openModal = (img: string) => {
    setCurrentImg(img);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Phân loại ảnh theo category
  const categories = [
    ...new Set(items.map((item: any) => item.gallery_category)),
  ];
  const hasCategories = categories.length > 0;

  if (isError) {
    return (
      <div style={{ padding: "80px 20px" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối đến server."}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
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
          ) : !hasCategories ? (
            <div className="empty-state gallery-empty">
              <Text type="secondary" style={{ fontSize: 16 }}>
                Chưa có hình ảnh nào.
              </Text>
            </div>
          ) : (
            <>
              {/* TIÊU ĐỀ CHÍNH */}
              <div className="gallery-main-header">
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-left.svg"
                  alt="star"
                  className="star-icon"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
                <Title level={1} className="gallery-main-title">
                  Khám Phá Không Gian
                </Title>
                <img
                  src="https://ruedelamourhotel.com/wp-content/themes/ruedelamour/assets/images/star-right.svg"
                  alt="star"
                  className="star-icon"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              </div>

              {/* HIỂN THỊ THEO CATEGORY */}
              {categories.map((category) => {
                const categoryItems = items.filter(
                  (item: any) => item.gallery_category === category
                );

                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="gallery-category-section">
                    {/* TIÊU ĐỀ CATEGORY */}
                    <div className="category-header">
                      <Title level={2} className="category-title">
                        {category}
                      </Title>
                    </div>

                    {/* GRID ẢNH */}
                    <Row gutter={[24, 24]} className="gallery-grid">
                      {categoryItems.map((item: any, index: number) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
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
                            <div className="gallery-content">
                              <Text className="gallery-caption">
                                {item.caption || "Không có mô tả"}
                              </Text>
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
