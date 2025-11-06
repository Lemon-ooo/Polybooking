import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  theme,
  Drawer,
  Space,
  Dropdown,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LoginOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
// @ts-ignore - assets.js không có type definitions
import { assets } from "../../assets/assets";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Footer as AppFooter } from "./Footer";

const { Header, Content } = Layout;

const BookIcon = () => <BookOutlined style={{ fontSize: "16px" }} />;

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Sử dụng Refine authentication
  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  const user = identity;

  // Kiểm tra user từ localStorage làm fallback
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const currentUser = user || getUserFromStorage();

  const navLinks = [
    { name: "Home", path: "/", key: "/" },
    { name: "Rooms", path: "/rooms", key: "/rooms" },
    { name: "Services", path: "/services", key: "/services" },
    { name: "Experience", path: "/experience", key: "/experience" },
    { name: "About", path: "/about", key: "/about" },
  ];

  useEffect(() => {
    // Kiểm tra kích thước màn hình
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (location.pathname !== "/") {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10 || location.pathname !== "/");
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, [location.pathname]);

  const linkColor = isScrolled ? "#374151" : "#fff"; // gray-700 khi scroll, trắng khi top
  const menuItems = navLinks.map((link) => ({
    key: link.key,
    label: (
      <Link
        to={link.path}
        style={{
          color: linkColor,
          textDecoration: "none",
          fontFamily: "sans-serif",
        }}
      >
        {link.name}
      </Link>
    ),
  }));

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 64px",
    transition: "all 0.3s ease",
    background: isScrolled ? "rgba(255,255,255,0.8)" : "#5C4BFF",
    backdropFilter: isScrolled ? "blur(10px)" : "none",
    boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
    width: "100%",
  };

  return (
    <Layout style={{ minHeight: "100vh", overflowX: "hidden", width: "100%" }}>
      <Header style={headerStyle}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <img
            src={assets.logo}
            alt="logo"
            style={{
              height: "36px",
              filter: isScrolled ? "none" : "brightness(0) invert(1)",
              transition: "all 0.3s ease",
            }}
          />
          <span
            style={{
              color: isScrolled ? "#374151" : "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: "sans-serif",
            }}
          ></span>
        </Link>

        {/* Desktop Nav */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                style={{
                  color: linkColor,
                  textDecoration: "none",
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  fontWeight: "normal",
                  whiteSpace: "nowrap",
                  position: "relative",
                  paddingBottom: "4px",
                }}
              >
                {link.name}
                {location.pathname === link.path && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: linkColor,
                      transition: "all 0.3s ease",
                    }}
                  />
                )}
              </Link>
            ))}

            <Button
              type="default"
              onClick={() => navigate("/owner")}
              style={{
                borderColor: isScrolled ? "#000" : "#fff",
                color: isScrolled ? "#000" : "#fff",
                background: "transparent",
                borderRadius: "999px",
                padding: "4px 16px",
                fontSize: "14px",
                fontWeight: "300",
                whiteSpace: "nowrap",
                marginLeft: "8px",
              }}
            >
              Dashboard
            </Button>
          </div>
        )}

        {/* Desktop Right */}
        {!isMobile && (
          <Space size="large" style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={
                <SearchOutlined
                  style={{
                    fontSize: "20px",
                    color: isScrolled ? "#374151" : "#fff",
                  }}
                />
              }
              style={{ display: "flex", alignItems: "center", padding: "4px" }}
            />

            {currentUser ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "bookings",
                      icon: <BookIcon />,
                      label: "My Bookings",
                      onClick: () => navigate("/my-bookings"),
                    },
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "Đăng xuất",
                      onClick: () => logout(),
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: isScrolled ? "#374151" : "#fff",
                  }}
                >
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    src={currentUser?.image}
                  />
                  <span style={{ color: isScrolled ? "#374151" : "#fff" }}>
                    {currentUser?.name || currentUser?.email || "User"}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="default"
                icon={<LoginOutlined />}
                onClick={() => navigate("/login")}
                style={{
                  background: isScrolled ? "#000" : "#fff",
                  color: isScrolled ? "#fff" : "#000",
                  border: isScrolled ? "1px solid #000" : "none",
                  borderRadius: "999px",
                  padding: "10px 32px",
                  fontSize: "14px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Login
              </Button>
            )}
          </Space>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Space size="small">
            {currentUser && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "bookings",
                      icon: <BookIcon />,
                      label: "My Bookings",
                      onClick: () => navigate("/my-bookings"),
                    },
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "Đăng xuất",
                      onClick: () => logout(),
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={currentUser?.image}
                />
              </Dropdown>
            )}
            <Button
              type="text"
              icon={
                <MenuOutlined
                  style={{
                    fontSize: "20px",
                    color: "#fff",
                  }}
                />
              }
              onClick={() => setIsMenuOpen(true)}
            />
          </Space>
        )}
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        width="100%"
        style={{ width: "100vw" }}
        closeIcon={<CloseOutlined />}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => {
              setIsMenuOpen(false);
            },
          }))}
          style={{ border: "none", marginBottom: "24px" }}
        />

        {currentUser && (
          <Button
            type="default"
            icon={<DashboardOutlined />}
            onClick={() => {
              navigate("/owner");
              setIsMenuOpen(false);
            }}
            style={{ width: "100%", marginBottom: "12px" }}
          >
            Dashboard
          </Button>
        )}

        {!currentUser && (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => {
              navigate("/login");
              setIsMenuOpen(false);
            }}
            style={{ width: "100%" }}
          >
            Login
          </Button>
        )}
      </Drawer>

      <Content
        style={{
          marginTop: "64px",
          padding: 0,
          margin: "64px 0 0 0",
          width: "100%",
        }}
      >
        {children}
      </Content>

      {/* Footer */}
      <AppFooter />
    </Layout>
  );
};
