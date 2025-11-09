import React, { useState } from "react";
import { Modal, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { roomsDummyData } from "../../../../assets/assets";
import heroImage from "../../../../assets/heroImage.png";

// Dữ liệu ảnh mẫu
const allImages: string[] = roomsDummyData.flatMap((room) => room.images);

const rowLayouts = [
  [12, 12],
  [8, 8, 8],
  [6, 6, 6, 6],
];

export const ClientGallery: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentImg, setCurrentImg] = useState("");

  const openModal = (img: string) => {
    setCurrentImg(img);
    setVisible(true);
  };

  const closeModal = () => setVisible(false);

  const groupedImages: (number[] | string[])[][] = [];
  let currentImageIndex = 0;

  while (currentImageIndex < allImages.length) {
    const layoutIndex = groupedImages.length % rowLayouts.length;
    const currentLayout = rowLayouts[layoutIndex];
    const rowImages = [];

    for (let i = 0; i < currentLayout.length; i++) {
      if (currentImageIndex < allImages.length) {
        rowImages.push(allImages[currentImageIndex]);
        currentImageIndex++;
      }
    }

    if (rowImages.length > 0) {
      groupedImages.push([currentLayout as any, rowImages]);
    }
  }

  return (
    <div style={{ padding: "0" }}>
      {/* BANNER LỚN  */}
      <div
        style={{
          width: "100%",
          height: "70vh",
          minHeight: "250px",
          maxHeight: "400px",
          // 👈 Đã thay đổi đường dẫn ảnh banner ở đây
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Overlay tối màu */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        ></div>
      </div>
      {/* ------------------------------------- */}

      {/* TIÊU ĐỀ "Gallery" */}
      <div
        style={{
          textAlign: "center",
          padding: "40px 32px 60px 32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAFAFA ",
        }}
      >
        <span
          style={{
            fontSize: "1.5rem",
            color: "#5c4bff",
            marginRight: 15,
            lineHeight: 1,
          }}
        >
          ✦
        </span>
        <h2
          style={{
            fontFamily: "'Great Vibes', serif",
            fontSize: "3.5rem",
            color: "#5c4bff",
            fontWeight: 400,
            margin: 0,
            lineHeight: 1,
          }}
        >
          Gallery
        </h2>
        <span
          style={{
            fontSize: "1.5rem",
            color: "#5c4bff",
            marginLeft: 15,
            lineHeight: 1,
          }}
        >
          ✦
        </span>
      </div>
      {/* ----------------------------------------------------------- */}

      {/* Padding cho phần ảnh lưới Gallery */}
      <div style={{ padding: "0px 32px 60px 32px" }}>
        {/* Grid xen kẽ  */}
        {groupedImages.map((group, groupIndex) => {
          const layout: number[] = group[0] as number[];
          const images: string[] = group[1] as string[];

          return (
            <Row
              gutter={[16, 16]}
              key={groupIndex}
              style={{ marginBottom: 16 }}
            >
              {images.map((img, imgIndex) => (
                <Col
                  span={layout[imgIndex]}
                  key={imgIndex}
                  onClick={() => openModal(img)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                      paddingTop: "75%",
                      position: "relative",
                    }}
                  >
                    <img
                      src={img}
                      alt={`gallery-${groupIndex}-${imgIndex}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>
                </Col>
              ))}
            </Row>
          );
        })}
      </div>

      {/* MODAL ẢNH LỚN */}
      <Modal
        open={visible}
        footer={null}
        onCancel={closeModal}
        centered
        closable={true}
        maskStyle={{ backgroundColor: "rgba(0,0,0,0.85)" }} // nền tối
        bodyStyle={{ padding: 0, background: "transparent", height: "100vh" }}
        style={{ top: 0, padding: 0, margin: 0 }}
        closeIcon={
          <CloseOutlined
            style={{
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "50%",
              padding: "4px",
            }}
          />
        }
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={currentImg}
            alt="large"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
