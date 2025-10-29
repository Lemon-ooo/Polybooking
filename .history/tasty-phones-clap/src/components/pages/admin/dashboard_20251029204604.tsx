import { Card, Row, Col, Statistic, Table, Tag, Space } from "antd";
import { useList } from "@refinedev/core";
import {
  RoomOutlined,
  UserOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

export const AdminDashboard = () => {
  // ✅ Lấy dữ liệu rooms từ API (nếu có)
  const { data: roomsData } = useList({
    resource: "rooms",
    pagination: { pageSize: 5 },
  });

  const rooms = roomsData?.data || [];

  // ✅ Mock data cho thống kê
  const stats = {
    totalRooms: 24,
    availableRooms: 18,
    occupiedRooms: 6,
    monthlyRevenue: 12500000,
    totalBookings: 45,
    pendingBookings: 3,
  };

  // ✅ Dữ liệu bookings gần đây
  const recentBookings = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      room: "101",
      checkIn: "2024-01-15",
      status: "confirmed",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      room: "102",
      checkIn: "2024-01-16",
      status: "pending",
    },
    {
      id: 3,
      customer: "Lê Văn C",
      room: "201",
      checkIn: "2024-01-17",
      status: "confirmed",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1>🏠 Dashboard Quản trị</h1>
      <p>Chào mừng trở lại, Quản trị viên!</p>

      {/* ✅ Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số phòng"
              value={stats.totalRooms}
              prefix={<RoomOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Phòng trống"
              value={stats.availableRooms}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={stats.monthlyRevenue}
              prefix={<DollarCircleOutlined />}
              suffix="₫"
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đặt phòng"
              value={stats.totalBookings}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* ✅ Danh sách phòng gần đây */}
        <Col xs={24} lg={12}>
          <Card title="📋 Danh sách phòng gần đây" bordered={false}>
            <Table
              dataSource={rooms}
              rowKey="id"
              pagination={false}
              size="small"
            >
              <Table.Column dataIndex="id" title="ID" width={60} />
              <Table.Column dataIndex="title" title="Tên phòng" />
              <Table.Column
                dataIndex="status"
                title="Trạng thái"
                render={(status) => (
                  <Tag color={status === "available" ? "green" : "red"}>
                    {status === "available" ? "Có sẵn" : "Đã thuê"}
                  </Tag>
                )}
              />
            </Table>
          </Card>
        </Col>

        {/* ✅ Đặt phòng gần đây */}
        <Col xs={24} lg={12}>
          <Card title="📅 Đặt phòng gần đây" bordered={false}>
            <Table
              dataSource={recentBookings}
              rowKey="id"
              pagination={false}
              size="small"
            >
              <Table.Column dataIndex="customer" title="Khách hàng" />
              <Table.Column dataIndex="room" title="Phòng" width={80} />
              <Table.Column dataIndex="checkIn" title="Check-in" />
              <Table.Column
                dataIndex="status"
                title="Trạng thái"
                render={(status) => (
                  <Tag color={status === "confirmed" ? "green" : "orange"}>
                    {status === "confirmed" ? "Xác nhận" : "Chờ xử lý"}
                  </Tag>
                )}
              />
            </Table>
          </Card>
        </Col>
      </Row>

      {/* ✅ Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24}>
          <Card title="🚀 Thao tác nhanh" bordered={false}>
            <Space>
              <a href="/admin/rooms">📊 Quản lý phòng</a>
              <a href="/admin/rooms/create">➕ Thêm phòng mới</a>
              <a href="/admin/users">👥 Quản lý người dùng</a>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
