import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { Typography, Spin, Alert, Button, Pagination } from "antd";
import "./ClientGallery.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

// Giả định kiểu dữ liệu tối thiểu
interface GalleryItemType {
  id: number;
  image_url: string;
  caption?: string;
}

export const ClientGallery: React.FC = () => {
  const [currentImg, setCurrentImg] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy dữ liệu với phân trang
  const { tableProps, tableQueryResult, setCurrent } =
    useTable<GalleryItemType>({
      resource: "galleries",
      pagination: { pageSize: 12, mode: "server" }, // Tăng pageSize để hiển thị nhiều ảnh hơn
      sorters: { initial: [{ field: "created_at", order: "desc" }] },
    });

  const galleries = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 12;

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
      {/* === HERO BANNER - HOL-HER-BANNER === */}
      <div className="gallery-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Gallery</h1>
          {/* <Paragraph className="hero-subtitle">
            Khám phá vẻ đẹp sang trọng và đẳng cấp
          </Paragraph> */}
        </div>
      </div>

      {/* === GALLERY CONTENT === */}
      <div className="gallery-content-section">
        <div className="container">
          {/* GALLERY PAGE TITLER */}
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
              {/* GALLERY GRID (MASONRY LAYOUT) */}
              <div className="gallery-grid-masonry">
                {galleries.map((item) => (
                  <div
                    key={item.id}
                    className="gallery-item-masonry fade-in"
                    onClick={() => openModal(item.image_url)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.caption || "Gallery Image"}
                      className="gallery-thumbnail-masonry"
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
                ))}
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
                    size="small"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL PREVIEW (Giữ nguyên) */}
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
