import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Empty, Table } from "antd";
import {
  HomeOutlined,
  ApartmentOutlined,
  HeartOutlined,
  ToolOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../../providers/data/axiosConfig";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (!stats) return <p>Lỗi tải dữ liệu</p>;

  return (
    <div style={{ padding: "10px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Dashboard Quản Trị</h1>

      {/* ==== 4 BOX THỐNG KÊ TRÊN ĐẦU ===== */}
      <Row gutter={20} style={{ marginBottom: 20, marginTop: 10 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Loại Phòng</div>}
              value={stats.roomTypes}
              prefix={
                <ApartmentOutlined style={{ color: "#1677ff", fontSize: 22 }} />
              }
            />
            <a style={{ fontSize: 14 }}>Quản lý Loại Phòng</a>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Phòng</div>}
              value={stats.rooms}
              prefix={
                <HomeOutlined style={{ color: "#52c41a", fontSize: 22 }} />
              }
            />
            <a style={{ fontSize: 14 }}>Quản lý Phòng</a>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Tiện Ích</div>}
              value={stats.amenities}
              prefix={
                <HeartOutlined style={{ color: "#13c2c2", fontSize: 22 }} />
              }
            />
            <a style={{ fontSize: 14 }}>Quản lý Tiện Ích</a>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Dịch Vụ</div>}
              value={stats.services}
              prefix={
                <ToolOutlined style={{ color: "#faad14", fontSize: 22 }} />
              }
            />
            <a style={{ fontSize: 14 }}>Quản lý Dịch Vụ</a>
          </Card>
        </Col>
      </Row>

      {/* ==== THỐNG KÊ NGƯỜI DÙNG ==== */}
      <Card title="Thống Kê Người Dùng" style={{ marginBottom: 25 }}>
        <Row gutter={20}>
          <Col span={8}>
            <Statistic
              title="Tổng Người Dùng"
              value={stats.totalUsers}
              prefix={<TeamOutlined style={{ color: "#1677ff" }} />}
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Quản Trị Viên"
              value={stats.admins}
              prefix={<UserOutlined style={{ color: "red" }} />}
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Khách Hàng"
              value={stats.customers}
              prefix={<UserOutlined style={{ color: "green" }} />}
            />
          </Col>
        </Row>

        <a style={{ display: "block", marginTop: 10 }}>
          Xem chi tiết Người Dùng
        </a>
      </Card>

      {/* ==== 3 KHỐI DƯỚI ===== */}
      <Row gutter={20}>
        <Col span={8}>
          <Card title="Loại Phòng Gần Đây">
            {stats.recentRoomTypes.length === 0 ? (
              <Empty description="No data" />
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey="room_type_id"
                dataSource={stats.recentRoomTypes}
                columns={[
                  { title: "Tên", dataIndex: "room_type_name" },
                  { title: "Giá", dataIndex: "base_price" },
                ]}
              />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Phòng Gần Đây">
            {stats.recentRooms.length === 0 ? (
              <Empty description="No data" />
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey="room_id"
                dataSource={stats.recentRooms}
                columns={[
                  { title: "Phòng", dataIndex: "room_number" },
                  { title: "Loại", dataIndex: "room_type_id" },
                ]}
              />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Người Dùng Gần Đây">
            {stats.recentUsers.length === 0 ? (
              <Empty description="No data" />
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey="user_id"
                dataSource={stats.recentUsers}
                columns={[
                  { title: "Tên", dataIndex: "user_name" },
                  { title: "Vai trò", dataIndex: "role" },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
