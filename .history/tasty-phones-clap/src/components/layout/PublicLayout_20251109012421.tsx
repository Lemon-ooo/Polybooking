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
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
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
// @ts-ignore
import { assets } from "../../assets/assets";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Footer as AppFooter } from "./Footer";

const { Header, Content } = Layout;

const BookIcon = () => <BookOutlined style={{ fontSize: "16px" }} />;

export const PublicLayout: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  const user =
    identity ||
    (() => {
      try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
      } catch {
        return null;
      }
    })();

  const navLinks = [
    { name: "Home", path: "/", key: "/" },
    { name: "Rooms", path: "/rooms", key: "/rooms" },
    { name: "Services", path: "/services", key: "/services" },
    { name: "Experience", path: "/experience", key: "/experience" },
    { name: "About", path: "/about", key: "/about" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () =>
      setIsScrolled(window.scrollY > 10 || location.pathname !== "/");
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const linkColor = isScrolled ? "#374151" : "#fff"; // gray-700 khi scroll, trắng khi top

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
                  fontSize: "14px",
                  position: "relative",
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
            {user && (
              <Button
                type="default"
                onClick={() => navigate("/owner")}
                style={{
                  borderRadius: "999px",
                  padding: "4px 16px",
                  fontSize: "14px",
                  fontWeight: 300,
                  marginLeft: "8px",
                }}
              >
                Dashboard
              </Button>
            )}
          </div>
        )}

        {/* Desktop Right */}
        {!isMobile && (
          <Space size="large">
            <Button
              type="text"
              icon={
                <SearchOutlined
                  style={{ fontSize: "20px", color: linkColor }}
                />
              }
            />
            {user ? (
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
                      label: "Logout",
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
                    gap: 8,
                    color: linkColor,
                  }}
                >
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    src={user?.image}
                  />
                  <span>{user?.name || user?.email || "User"}</span>
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="default"
                icon={<LoginOutlined />}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </Space>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Space size="small">
            {user && (
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
                      label: "Logout",
                      onClick: () => logout(),
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user?.image}
                />
              </Dropdown>
            )}
            <Button
              type="text"
              icon={
                <MenuOutlined style={{ fontSize: "20px", color: "#fff" }} />
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
        closeIcon={<CloseOutlined />}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={navLinks.map((link) => ({
            key: link.key,
            label: <Link to={link.path}>{link.name}</Link>,
            onClick: () => setIsMenuOpen(false),
          }))}
        />
        {user && (
          <Button
            type="default"
            onClick={() => {
              navigate("/owner");
              setIsMenuOpen(false);
            }}
            style={{ width: "100%", marginTop: 12 }}
          >
            Dashboard
          </Button>
        )}
        {!user && (
          <Button
            type="primary"
            onClick={() => {
              navigate("/login");
              setIsMenuOpen(false);
            }}
            style={{ width: "100%", marginTop: 12 }}
          >
            Login
          </Button>
        )}
      </Drawer>

      <Content style={{ marginTop: 64, width: "100%" }}>
        <Outlet />
      </Content>

      <AppFooter />
    </Layout>
  );
};
