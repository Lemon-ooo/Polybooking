import React, { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Button,
  Space,
  Badge,
  Dropdown,
  Spin,
} from "antd";
import {
  HomeOutlined,
  ApartmentOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CommentOutlined,
  BellOutlined,
  ScheduleOutlined,
  FolderOpenOutlined,
  ToolOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useGetIdentity, useLogout } from "@refinedev/core";

const { Header, Sider, Content } = Layout;

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading } = useGetIdentity<{
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  }>();

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Chỉ hiển thị loading – KHÔNG redirect
  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const menuItems = [
    { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "room-types", icon: <ApartmentOutlined />, label: "Loại Phòng" },
    { key: "rooms", icon: <ApartmentOutlined />, label: "Phòng" },
    { key: "galleries", icon: <FolderOpenOutlined />, label: "Bộ sưu tập ảnh" },
    { key: "events", icon: <ScheduleOutlined />, label: "Sự kiện" },
    { key: "services", icon: <CustomerServiceOutlined />, label: "Dịch vụ" },
    { key: "bookings", icon: <BookOutlined />, label: "Đặt Phòng" },
    { key: "amenities", icon: <ToolOutlined />, label: "Tiện Ích" },
    { key: "users", icon: <TeamOutlined />, label: "Khách Hàng" },
    { key: "revenue", icon: <DollarOutlined />, label: "Doanh Thu" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài Đặt" },
  ];

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{ position: "fixed", left: 0, top: 0, bottom: 0 }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            background: "#001529",
          }}
        >
          {!collapsed && "PolyStay Admin"}
        </div>

        {!collapsed && user && (
          <div
            style={{
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Avatar size={40} src={user.avatar} icon={<UserOutlined />} />
            <div>
              <div style={{ color: "#fff" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>
                {user.role || "admin"}
              </div>
            </div>
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.split("/")[2] || "dashboard"]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => navigate(`/admin/${item.key}`),
          }))}
        />
      </Sider>

      {/* Main */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: "all 0.2s",
        }}
      >
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
            <span style={{ fontSize: 18, fontWeight: "bold" }}>
              Admin Dashboard
            </span>
          </Space>

          <Space size="large">
            <Badge count={4}>
              <CommentOutlined
                style={{ fontSize: 18, color: "#fff", cursor: "pointer" }}
                onClick={() => navigate("/admin/conversations")}
              />
            </Badge>

            <Badge count={7}>
              <BellOutlined style={{ fontSize: 18, color: "#fff" }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                src={user?.avatar}
                icon={<UserOutlined />}
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            padding: 20,
            background: "#f5f6fa",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
