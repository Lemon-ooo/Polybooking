import React from "react";
import { Row, Col, Typography } from "antd";
import { useInView } from "react-intersection-observer"; // Đảm bảo đã cài đặt
import "./ClientAbout.css";

const { Title, Paragraph } = Typography;

// Import ảnh
import image1 from "../../../../assets/about-1.jpg";
import image2 from "../../../../assets/about-2.jpg";
import image3 from "../../../../assets/about-4.jpg";

// Custom hook để áp dụng animation cho từng hàng
const useRowAnimation = () =>
  useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

export const ClientAbout: React.FC = () => {
  const [missionRef, missionInView] = useRowAnimation();
  const [visionRef, visionInView] = useRowAnimation();
  const [teamRef, teamInView] = useRowAnimation();

  return (
    <div className="client-about-container">
      {/* HERO BANNER */}
      <div className="about-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">About Us</h1>
        </div>
      </div>

      {/*  CONTENT SECTION */}
      <div className="about-grid-section">
        <div className="container">
          {/* 🌟 SỨ MỆNH - HÀNG 1 */}
          <Row
            gutter={[32, 32]}
            className={`about-row mission-row ${
              missionInView ? "is-visible" : ""
            }`}
            ref={missionRef}
          >
            <Col xs={24} md={12}>
              <div className="about-image-wrapper animated-item">
                <img src={image1} alt="Our Mission" className="about-image" />
              </div>
            </Col>
            <Col xs={24} md={12} className="about-text-content animated-item">
              <Title level={2} className="about-title">
                Sứ Mệnh Của Chúng Tôi
              </Title>

              <Paragraph>
                Chúng tôi cam kết mang đến những trải nghiệm dịch vụ xuất sắc,
                vượt trội hơn cả mong đợi của khách hàng. Sứ mệnh của chúng tôi
                là tạo ra giá trị bền vững thông qua sự đổi mới, chất lượng và
                dịch vụ tận tâm.
              </Paragraph>
              <Paragraph>
                Chúng tôi tin rằng sự hài lòng của khách hàng là thước đo thành
                công cuối cùng.
              </Paragraph>
            </Col>
          </Row>

          {/* TẦM NHÌN - HÀNG 2 */}
          <Row
            gutter={[32, 32]}
            className={`about-row vision-row ${
              visionInView ? "is-visible" : ""
            }`}
            ref={visionRef}
          >
            {/* Cột 1: Văn bản */}
            <Col xs={24} md={12} className="about-text-content animated-item">
              <Title level={2} className="about-title">
                Tầm Nhìn Tương Lai
              </Title>

              <Paragraph>
                Trở thành công ty hàng đầu trong lĩnh vực, được công nhận về sự
                tiên phong, đạo đức kinh doanh và chất lượng dịch vụ toàn diện.
                Chúng tôi hướng tới việc mở rộng thị trường và thiết lập các
                tiêu chuẩn mới cho ngành.
              </Paragraph>
              <Paragraph>
                Phát triển một môi trường làm việc sáng tạo và truyền cảm hứng
                cho toàn bộ đội ngũ.
              </Paragraph>
            </Col>
            {/* Cột 2: Ảnh */}
            <Col xs={24} md={12}>
              <div className="about-image-wrapper animated-item">
                <img src={image2} alt="Our Vision" className="about-image" />
              </div>
            </Col>
          </Row>

          {/*ĐỘI NGŨ - HÀNG 3 */}
          <Row
            className={`about-row team-row ${teamInView ? "is-visible" : ""}`}
            ref={teamRef}
          >
            <Col span={24}>
              <div className="full-width-section">
                <Title
                  level={2}
                  className="about-title text-center animated-item"
                >
                  Đội Ngũ Và Văn Hóa
                </Title>

                <Paragraph className="text-center max-width-para animated-item">
                  Đội ngũ của chúng tôi là tài sản quý giá nhất, bao gồm những
                  chuyên gia giàu kinh nghiệm và đầy nhiệt huyết. Chúng tôi xây
                  dựng một văn hóa làm việc tôn trọng, hợp tác và không ngừng
                  học hỏi.
                </Paragraph>
                <div className="about-image-wrapper full-image-wrapper animated-item">
                  <img
                    src={image3}
                    alt="Our Team"
                    className="about-image full-image"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
