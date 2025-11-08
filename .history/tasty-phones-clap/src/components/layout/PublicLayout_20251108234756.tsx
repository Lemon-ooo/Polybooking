import React from "react";
import { Layout, Menu, Button, Avatar, theme } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "rooms",
      icon: <HomeOutlined />,
      label: <Link to="/rooms">Phòng & Giá</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: token.colorBgContainer,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo và Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <HomeOutlined
              style={{ fontSize: "24px", color: token.colorPrimary }}
            />
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              PolyStay
            </span>
          </div>

          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: "none", flex: 1 }}
          />
        </div>

        {/* Nút đăng nhập/đăng ký */}
        <div style={{ display: "flex", gap: "12px" }}>
          <Button icon={<LoginOutlined />} onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => navigate("/register")} // Có thể thêm trang đăng ký sau
          >
            Đăng ký
          </Button>
        </div>
      </Header>

      <Content>{children}</Content>

      <Footer style={{ textAlign: "center", background: token.colorBgLayout }}>
        PolyStay Home Booking System ©2024 - Dự án tốt nghiệp
      </Footer>
    </Layout>
  );
};