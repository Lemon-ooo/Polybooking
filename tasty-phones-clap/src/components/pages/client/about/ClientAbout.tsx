import React from "react";
import { Row, Col, Typography } from "antd";
import "./ClientAbout.css";

const { Title, Paragraph } = Typography;

// 💡 ĐÃ CHUYỂN SANG DÙNG 'IMPORT' THỰC TẾ
// Bạn CẦN ĐẢM BẢO CÁC ĐƯỜNG DẪN DƯỚI ĐÂY CHÍNH XÁC VỚI VỊ TRÍ TỆP ẢNH CỦA BẠN.
import image1 from "../../../../assets/about-1.jpg";
import image2 from "../../../../assets/about-2.jpg";
import image3 from "../../../../assets/about-3.jpg";
// Đường dẫn cho logo
//import logoImage from "../../../../assets/logo.png"; // Thay thế bằng đường dẫn logo thực tế của bạn

export const ClientAbout: React.FC = () => {
  return (
    <div className="client-about-container">
      {/* 🏞️ HERO BANNER */}
      <div className="about-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">About Us</h1>
        </div>
      </div>

      {/* 🏢 CONTENT SECTION (BỐ CỤC 3 HÀNG) */}
      <div className="about-grid-section">
        <div className="container">
          {/* 🌟 PHẦN TEXT MỚI ĐƯỢC THÊM VÀO (TỪ ẢNH LOGO) */}
          <div className="about-logo-section">
            <img src={logoImage} alt="" className="about-brand-logo" />
            {/* Nếu bạn không muốn dùng ảnh logo, hãy dùng text Typography */}
            {/* <Title level={1} className="about-brand-title">
              Rue De L'amour <span className="boutique-style">Boutique</span> Hotel Hanoi
            </Title>
            */}
          </div>

          {/* --- */}

          {/* HÀNG 1: Sứ Mệnh (50/50) */}
          <Row gutter={[32, 32]} className="about-row mission-row">
            <Col xs={24} md={12}>
              <div className="about-image-wrapper">
                {/* Ảnh sử dụng biến đã được import */}
                <img src={image1} alt="Our Mission" className="about-image" />
              </div>
            </Col>
            <Col xs={24} md={12} className="about-text-content">
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

          {/* --- */}

          {/* HÀNG 2: Tầm Nhìn (50/50) */}
          <Row gutter={[32, 32]} className="about-row vision-row">
            {/* Đảo thứ tự cột cho hiệu ứng xen kẽ */}
            <Col xs={24} md={12} className="about-text-content">
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
            <Col xs={24} md={12}>
              <div className="about-image-wrapper">
                {/* Ảnh sử dụng biến đã được import */}
                <img src={image2} alt="Our Vision" className="about-image" />
              </div>
            </Col>
          </Row>

          {/* --- */}

          {/* HÀNG 3: Đội Ngũ (Full Width) */}
          <Row className="about-row team-row">
            <Col span={24}>
              <div className="full-width-section">
                <Title level={2} className="about-title text-center">
                  Đội Ngũ Và Văn Hóa
                </Title>
                <Paragraph className="text-center max-width-para">
                  Đội ngũ của chúng tôi là tài sản quý giá nhất, bao gồm những
                  chuyên gia giàu kinh nghiệm và đầy nhiệt huyết. Chúng tôi xây
                  dựng một văn hóa làm việc tôn trọng, hợp tác và không ngừng
                  học hỏi.
                </Paragraph>
                <div className="about-image-wrapper full-image-wrapper">
                  {/* Ảnh sử dụng biến đã được import */}
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
