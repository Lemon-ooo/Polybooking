import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { Typography, Spin, Alert, Button, Pagination } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "./ClientGallery.css";

const { Title, Text } = Typography;

interface GalleryItemType {
  id: number;
  gallery_id: number;
  gallery_category: string;
  image_path: string; // API trả về image_path, không phải image_url
  caption?: string;
  created_at?: string;
  updated_at?: string;
}

// Base URL cho images - THAY ĐỔI THEO SERVER CỦA BẠN
const IMAGE_BASE_URL = "http://localhost:8000/storage/"; // Ví dụ Laravel
// hoặc
// const IMAGE_BASE_URL = "https://your-domain.com/storage/";

export const ClientGallery: React.FC = () => {
  const [currentImg, setCurrentImg] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const { tableProps, tableQueryResult, setCurrent } =
    useTable<GalleryItemType>({
      resource: "galleries",
      pagination: { pageSize: 21, mode: "server" },
      sorters: { initial: [{ field: "created_at", order: "desc" }] },
    });

  // Chỉ dùng data từ API
  const galleries = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 21;

  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  // Debug: Log data để kiểm tra
  React.useEffect(() => {
    console.log("=== GALLERY DEBUG ===");
    console.log("Loading:", isLoading);
    console.log("Error:", isError);
    console.log("Galleries count:", galleries.length);
    console.log("Galleries data:", galleries);
    console.log("Total:", total);
    console.log("IMAGE_BASE_URL:", IMAGE_BASE_URL);
    if (galleries.length > 0) {
      console.log("First image path:", galleries[0].image_path);
      console.log(
        "First image full URL:",
        getImageUrl(galleries[0].image_path)
      );
    }
  }, [isLoading, isError, galleries, total]);

  const openModal = (img: string) => {
    setCurrentImg(img);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handlePageChange = (page: number) => setCurrent?.(page);

  // Helper function để tạo full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    // Nếu đã là full URL (http/https) thì return luôn
    if (imagePath.startsWith("http")) return imagePath;
    // Nếu là relative path thì thêm base URL
    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  const handleImageError = (
    id: number,
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    setImageErrors((prev) => new Set(prev).add(id));
    const target = e.target as HTMLImageElement;
    // Dùng ảnh placeholder từ unsplash thay vì via.placeholder
    target.src =
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop";
  };

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
<div className="gallery-hero">
  <div className="gallery-hero-content">
    <h1 className="gallery-hero-title">Gallery</h1>
  </div>
</div>

      {/* GALLERY CONTENT */}
      <div className="gallery-content-section">
        <div className="gallery-container-wrapper">
          {/* PAGE HEADER */}
         <div className="gallery-page-header">
  <Title level={2} className="gallery-page-title">
    Image library
  </Title>
  <Text className="gallery-subtitle">{total} Image</Text>
</div>

          {isLoading ? (
            <div className="gallery-loading">
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block", color: "#666" }}>
              Loading images...
              </Text>
            </div>
          ) : galleries.length === 0 ? (
            <div className="gallery-empty">
              <Text type="secondary" style={{ fontSize: 16 }}>
                No images are available yet.
              </Text>
            </div>
          ) : (
            <>
              {/* INSTAGRAM GRID */}
              <div className="instagram-grid">
                {galleries.map((item, index) => {
                  // Pattern: ảnh lớn ở index 0, 9, 18, 27...
                  const isLargeTop = index % 9 === 0;
                  // Pattern: ảnh lớn ở index 8, 17, 26, 35...
                  const isLargeBottom = index % 9 === 8;
                  const isLarge = isLargeTop || isLargeBottom;

                  const imageUrl = getImageUrl(item.image_path);

                  return (
                    <div
                      key={item.id}
                      className={`instagram-grid-item ${
                        isLarge ? "large" : ""
                      }`}
                      onClick={() => openModal(imageUrl)}
                    >
                      <div className="instagram-image-wrapper">
                        <img
                          src={imageUrl}
                          alt={item.caption || `Gallery ${item.id}`}
                          className="instagram-image"
                          loading="lazy"
                          onError={(e) => handleImageError(item.id, e)}
                        />
                        <div className="instagram-overlay">
                          <EyeOutlined className="instagram-icon" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {total > pageSize && (
                <div className="gallery-pagination-wrapper">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={handlePageChange}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} / ${total}`
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalVisible && (
        <div className="instagram-modal" onClick={closeModal}>
          <button className="instagram-modal-close" onClick={closeModal}>
            ×
          </button>
          <div
            className="instagram-modal-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImg}
              alt="Preview"
              className="instagram-modal-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=1200&fit=crop";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
