import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { Typography, Spin, Alert, Button, Pagination } from "antd";
import "./ClientGallery.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

interface GalleryItemType {
  id: number;
  image_url: string;
  caption?: string;
}

export const ClientGallery: React.FC = () => {
  const [currentImg, setCurrentImg] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  const { tableProps, tableQueryResult, setCurrent } =
    useTable<GalleryItemType>({
      resource: "galleries",
      pagination: { pageSize: 21, mode: "server" },
      sorters: { initial: [{ field: "created_at", order: "desc" }] },
    });

  const galleries = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 21;

  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const openModal = (img: string) => {
    setCurrentImg(img);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handlePageChange = (page: number) => setCurrent?.(page);

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
          <h1 className="hero-title">Gallery</h1>
        </div>
      </div>

      {/* GALLERY CONTENT */}
      <div className="gallery-content-section">
        <div className="container">
          {/* PAGE HEADER */}
          <div className="gallery-page-header">
            <Title level={1} className="gallery-page-title">
              THƯ VIỆN HÌNH ẢNH
            </Title>
          </div>

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
              {/* INSTAGRAM EXPLORE GRID */}
              <div className="gallery-grid-instagram">
                {galleries.map((item, index) => {
                  // Tạo pattern như Instagram: ảnh lớn ở vị trí 0, 9, 18...
                  const isLarge = index % 9 === 0 || index % 9 === 8;

                  return (
                    <div
                      key={item.id}
                      className={`gallery-item-instagram ${
                        isLarge ? "large" : ""
                      } fade-in`}
                      onClick={() => openModal(item.image_url)}
                    >
                      <div className="image-wrapper">
                        <img
                          src={item.image_url}
                          alt={item.caption || "Gallery Image"}
                          className="gallery-thumbnail-instagram"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=600&fit=crop";
                          }}
                        />
                        <div className="image-overlay-instagram">
                          <div className="overlay-content-instagram">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="3" />
                              <path d="M12 5v.01M12 18.99v.01M5 12h.01M18.99 12h.01M7.05 7.05l.01.01M16.95 16.95l.01.01M7.05 16.95l.01.01M16.95 7.05l.01.01" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

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
                    size="default"
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
            <img
              src={currentImg}
              alt="Preview"
              className="modal-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=1200&fit=crop";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
