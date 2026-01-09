import React from "react";
import { Row, Col, Typography } from "antd";
import { useInView } from "react-intersection-observer";
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
                Our Mission
              </Title>

              <Paragraph>
                We are committed to delivering exceptional service experiences
                that surpass customer expectations. Our mission is to create
                sustainable value through continuous innovation, superior
                quality, and dedicated, professional service.
              </Paragraph>
              <Paragraph>
                We believe that customer satisfaction is the ultimate measure of
                success.
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
                Our Vision
              </Title>

              <Paragraph>
                To become a leading company in the industry, recognized for our
                pioneering spirit, ethical business practices, and comprehensive
                service quality. We aim to expand the market and set new
                standards for the industry.
              </Paragraph>
              <Paragraph>
                Develop a creative and inspiring work environment for the entire team.
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
                  Our Team and Culture
                </Title>

                <Paragraph className="text-center max-width-para animated-item">
                  Our team is our most valuable asset, comprising experienced and
                  passionate professionals. We build a work culture based on
                  respect, collaboration, and continuous learning.
                  Develop a creative and inspiring work environment for the entire team.
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
