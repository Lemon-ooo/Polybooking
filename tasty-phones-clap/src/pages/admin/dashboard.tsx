import React from "react";
import { Row, Col, Card, Statistic, Button, Typography } from "antd";

const { Title } = Typography;

export const AdminDashboard: React.FC = () => {
  return (
    <>
      <Title level={3} style={{ marginBottom: 20 }}>
        Tổng Quan Hệ Thống
      </Title>

      {/* Statistic cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "#1890ff", color: "#fff" }}>
            <Statistic
              title={
                <span style={{ color: "#fff" }}>Đơn Đặt Phòng Hôm Nay</span>
              }
              value={125}
              suffix="đơn"
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "#52c41a", color: "#fff" }}>
            <Statistic
              title={<span style={{ color: "#fff" }}>Phòng Đang Trống</span>}
              value={48}
              suffix="phòng"
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "#faad14", color: "#fff" }}>
            <Statistic
              title={<span style={{ color: "#fff" }}>Khách Hàng Mới</span>}
              value={32}
              suffix="người"
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "#ff4d4f", color: "#fff" }}>
            <Statistic
              title={<span style={{ color: "#fff" }}>Doanh Thu Hôm Nay</span>}
              value={8200000}
              suffix="₫"
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng dữ liệu / Thống kê */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="Tình Trạng Đặt Phòng">
            <p>• Đã xác nhận: 58</p>
            <p>• Đang chờ duyệt: 12</p>
            <p>• Đã hủy: 5</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Doanh Thu Tuần Này">
            <svg width="100%" height="200">
              <rect x="20" y="100" width="40" height="80" fill="#1890ff" />
              <rect x="80" y="70" width="40" height="110" fill="#1890ff" />
              <rect x="140" y="50" width="40" height="130" fill="#1890ff" />
              <rect x="200" y="120" width="40" height="60" fill="#1890ff" />
              <rect x="260" y="40" width="40" height="140" fill="#1890ff" />
              <rect x="320" y="60" width="40" height="120" fill="#1890ff" />
              <rect x="380" y="90" width="40" height="90" fill="#1890ff" />
            </svg>
          </Card>
        </Col>
      </Row>

      {/* Danh sách chat (mô phỏng) */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Tin Nhắn Gần Đây"
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <div style={{ maxHeight: 250, overflowY: "auto" }}>
              <p>
                <b>Khách Hàng 1:</b> Xin hỏi còn phòng đôi ngày mai không?
              </p>
              <p>
                <b>Khách Hàng 2:</b> Tôi muốn hủy đơn đặt phòng #1123
              </p>
              <p>
                <b>Khách Hàng 3:</b> Phòng có bao gồm ăn sáng không?
              </p>
              <p>
                <b>Khách Hàng 4:</b> Cảm ơn, dịch vụ rất tuyệt!
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Thông Báo Hệ Thống"
            extra={<Button type="link">Xem thêm</Button>}
          >
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Phòng 203 đã check-in lúc 8:45 sáng.</li>
              <li>Phòng 405 cần dọn dẹp lúc 11:30.</li>
              <li>Cập nhật chính sách hủy phòng từ ngày 10/11.</li>
              <li>Hệ thống backup thành công.</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </>
  );
};