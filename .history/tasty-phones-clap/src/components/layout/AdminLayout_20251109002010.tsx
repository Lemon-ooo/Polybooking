import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Input,
  Badge,
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Dropdown,
  Typography,
  Space,
  message,
} from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  CommentOutlined,
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
  DollarOutlined,
  ApartmentOutlined,
  SearchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetIdentity, useLogout } from "@refinedev/core";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { data: user, isLoading } = useGetIdentity<{
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
  }>();

  useEffect(() => {
    // Đợi quá trình lấy thông tin người dùng hoàn tất trước khi chuyển hướng.
    // Nếu vẫn đang tải, không làm gì để tránh redirect nhầm khi reload trang.
    if (isLoading) return;

    // Kiểm tra đăng nhập và quyền admin
    if (!user) {
      message.error("Vui lòng đăng nhập để truy cập trang quản trị!");
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      message.error("Bạn không có quyền truy cập trang quản trị!");
      navigate("/");
      return;
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
    },
    { key: "divider", type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ] as const;

  // Menu sidebar
  const menuItems = [
    { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "rooms", icon: <ApartmentOutlined />, label: "Phòng" },
    { key: "bookings", icon: <BookOutlined />, label: "Đặt Phòng" },
    { key: "customers", icon: <TeamOutlined />, label: "Khách Hàng" },
    { key: "revenue", icon: <DollarOutlined />, label: "Doanh Thu" },
    { key: "calendar", icon: <CalendarOutlined />, label: "Lịch Làm Việc" },
    { key: "divider", type: "divider" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài Đặt" },
  ] as const;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#001529",
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#002140",
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          <AppstoreOutlined />{" "}
          {!collapsed && <span style={{ marginLeft: 8 }}>PolyStayAdmin</span>}
        </div>

        {/* User Info */}
        <div
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #303030",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Avatar
            size={45}
            icon={<UserOutlined />}
            src={user?.avatar}
            style={{ background: "#1890ff" }}
          />
          {!collapsed && user && (
            <div>
              <div style={{ color: "#fff", fontWeight: "bold" }}>
                {user.name}
              </div>
              <div style={{ color: "#aaa", fontSize: 12 }}>{user.role}</div>
            </div>
          )}
        </div>

        {/* Search box (chuẩn mới AntD v5) */}
        <div style={{ padding: 15 }}>
          <Space.Compact style={{ width: "100%" }}>
            <Input placeholder="Tìm kiếm..." allowClear />
            <Button icon={<SearchOutlined />} type="primary" />
          </Space.Compact>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems as any}
        />
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout
        style={{ marginLeft: collapsed ? 80 : 240, transition: "all 0.2s" }}
      >
        {/* HEADER */}
        <Header
          style={{
            padding: "0 20px",
            background: "#1890ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: "#fff", fontSize: 18 }}
            />
            <Title level={4} style={{ color: "#fff", margin: 0 }}>
              Bảng Điều Khiển
            </Title>
          </Space>

          <Space size="large">
            <Badge count={4}>
              <CommentOutlined style={{ fontSize: 18, color: "#fff" }} />
            </Badge>
            <Badge count={7}>
              <BellOutlined style={{ fontSize: 18, color: "#fff" }} />
            </Badge>
            <Dropdown
              menu={{ items: userMenuItems as any }}
              placement="bottomRight"
            >
              <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
            </Dropdown>
          </Space>
        </Header>

        {/* CONTENT */}
        <Content style={{ padding: 20, background: "#f5f6fa" }}>
          {/* Render children - main content */}
          {children} {/* Statistic cards */}
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
                  title={
                    <span style={{ color: "#fff" }}>Phòng Đang Trống</span>
                  }
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
                  title={
                    <span style={{ color: "#fff" }}>Doanh Thu Hôm Nay</span>
                  }
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
        </Content>
      </Layout>
    </Layout>
  );
}