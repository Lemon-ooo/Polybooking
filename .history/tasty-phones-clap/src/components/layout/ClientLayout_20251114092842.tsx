import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Avatar, Drawer, Space, Dropdown } from "antd";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  UserOutlined,
  LoginOutlined,
  MenuOutlined,
  CloseOutlined,
  BookOutlined,
  LogoutOutlined,
  DashboardOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
// @ts-ignore
import { assets } from "../../assets/assets";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Footer as AppFooter } from "./Footer";
import { HeroSection } from "./HeroSection";

const { Header, Content } = Layout;

export const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const currentUser = identity || getUserFromStorage();

  const navLinks = [
    { name: "Home", path: "/client", key: "/client" },
    { name: "Rooms & Suites", path: "/client/rooms", key: "/client/rooms" },
    { name: "Services", path: "/client/services", key: "/client/services" },
    {
      name: "Experience",
      path: "/client/experience",
      key: "/client/experience",
    },
    { name: "Gallery", path: "/client/galleries", key: "/client/galleries" },
    { name: "Contact", path: "/client/contact", key: "/client/contact" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50 || location.pathname !== "/client");
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Deluxe color palette - refined gold tones
  const colors = {
    bg: isScrolled ? "rgba(10, 10, 10, 0.95)" : "transparent",
    text: "#ffffff",
    textSecondary: "#e0e0e0",
    accent: "#c9a96e",
    accentDark: "#b8934b",
    border: "rgba(201, 169, 110, 0.3)",
    backdrop: isScrolled ? "blur(20px)" : "none",
    shadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.5)" : "none",
  };

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "16px 24px" : "20px 80px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    background: colors.bg,
    backdropFilter: colors.backdrop,
    WebkitBackdropFilter: colors.backdrop,
    boxShadow: colors.shadow,
    borderBottom: isScrolled ? `1px solid ${colors.border}` : "none",
    height: "80px",
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        background: "#0a0a0a",
        fontFamily: "'Inter', 'Cormorant Garamond', sans-serif",
      }}
    >
      {/* Header */}
      <Header style={headerStyle}>
        {/* Logo */}
        <Link
          to="/client"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            zIndex: 1001,
          }}
        >
          <img
            src={assets.logo}
            alt="Hotel Deluxe"
            style={{
              height: isMobile ? 32 : 40,
              transition: "all 0.3s ease",
            }}
          />
          {!isMobile && (
            <div
              style={{
                color: colors.text,
                fontSize: "14px",
                fontWeight: 300,
                letterSpacing: "3px",
                textTransform: "uppercase",
                borderLeft: `1px solid ${colors.border}`,
                paddingLeft: "12px",
                marginLeft: "8px",
              }}
            >
              Hotel & Resort
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 48,
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
                  color:
                    location.pathname === link.path
                      ? colors.accent
                      : colors.text,
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 400,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  position: "relative",
                  padding: "8px 0",
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.color = colors.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.color = colors.text;
                  }
                }}
              >
                {link.name}
                {location.pathname === link.path && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "20px",
                      height: "1px",
                      background: colors.accent,
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <Space size={20} align="center">
            {/* Contact Info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: colors.accent,
                fontSize: "12px",
                letterSpacing: "1px",
              }}
            >
              <PhoneOutlined />
              <span
                style={{
                  color: colors.textSecondary,
                  fontWeight: 300,
                }}
              >
                +1 (555) 123-4567
              </span>
            </div>

            <div
              style={{
                width: "1px",
                height: "20px",
                background: colors.border,
                opacity: 0.5,
              }}
            />

            {currentUser ? (
              <>
                <Button
                  type="text"
                  onClick={() => navigate("/owner")}
                  style={{
                    borderRadius: 0,
                    padding: "8px 24px",
                    fontSize: "13px",
                    fontWeight: 500,
                    border: `1px solid ${colors.accent}`,
                    color: colors.accent,
                    background: "transparent",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                    height: "40px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.accent;
                    e.currentTarget.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = colors.accent;
                  }}
                >
                  Dashboard
                </Button>

                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "profile",
                        icon: <UserOutlined />,
                        label: "My Profile",
                        onClick: () => navigate("/profile"),
                      },
                      {
                        key: "bookings",
                        icon: <BookOutlined />,
                        label: "My Bookings",
                        onClick: () => navigate("/my-bookings"),
                      },
                      {
                        type: "divider",
                      },
                      {
                        key: "logout",
                        icon: <LogoutOutlined />,
                        label: "Logout",
                        onClick: () => logout(),
                      },
                    ],
                    style: {
                      background: "#1a1a1a",
                      border: `1px solid ${colors.border}`,
                      borderRadius: 0,
                      padding: "8px 0",
                    },
                  }}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: colors.text,
                      padding: "4px 8px",
                      borderRadius: 0,
                      transition: "all 0.3s ease",
                      height: "40px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(201, 169, 110, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Avatar
                      size={32}
                      icon={<UserOutlined />}
                      src={currentUser?.image}
                      style={{
                        border: `1px solid ${colors.accent}`,
                        background: "transparent",
                      }}
                    />
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Button
                type="text"
                onClick={() => navigate("/login")}
                style={{
                  borderRadius: 0,
                  padding: "8px 32px",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: colors.accent,
                  border: "none",
                  color: "#000",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                  height: "40px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.accentDark;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.accent;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Sign In
              </Button>
            )}
          </Space>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Space size={16}>
            {currentUser && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "bookings",
                      icon: <BookOutlined />,
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
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  src={currentUser?.image}
                  style={{
                    border: `1px solid ${colors.accent}`,
                    cursor: "pointer",
                    background: "transparent",
                  }}
                />
              </Dropdown>
            )}

            <Button
              type="text"
              icon={
                <MenuOutlined
                  style={{
                    fontSize: 20,
                    color: colors.text,
                  }}
                />
              }
              onClick={() => setIsMenuOpen(true)}
              style={{
                padding: 4,
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Space>
        )}
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img src={assets.logo} alt="Hotel Deluxe" style={{ height: 28 }} />
            <span
              style={{
                color: colors.text,
                fontWeight: 300,
                fontSize: "14px",
                letterSpacing: "2px",
              }}
            >
              HOTEL DELUXE
            </span>
          </div>
        }
        placement="right"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        width={320}
        closeIcon={
          <CloseOutlined
            style={{
              color: colors.text,
              fontSize: 16,
            }}
          />
        }
        styles={{
          body: {
            background: "#0a0a0a",
            padding: 0,
          },
          header: {
            background: "#0a0a0a",
            borderBottom: `1px solid ${colors.border}`,
            padding: "16px 24px",
          },
        }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={navLinks.map((item) => ({
            key: item.key,
            label: <Link to={item.path}>{item.name}</Link>,
            style: {
              background: "transparent",
              color: colors.text,
              fontSize: "15px",
              fontWeight: 400,
              padding: "16px 24px",
              borderBottom: `1px solid ${colors.border}`,
              letterSpacing: "1px",
            },
            onClick: () => setIsMenuOpen(false),
          }))}
          style={{
            background: "transparent",
            borderRight: "none",
            marginTop: "16px",
          }}
        />

        <div
          style={{
            padding: "24px",
            borderTop: `1px solid ${colors.border}`,
            marginTop: "16px",
          }}
        >
          {/* Contact Info */}
          <div
            style={{
              color: colors.accent,
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            For Reservations
          </div>
          <div
            style={{
              color: colors.text,
              fontSize: "16px",
              fontWeight: 300,
              marginBottom: "24px",
            }}
          >
            +1 (555) 123-4567
          </div>

          {currentUser ? (
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Button
                type="default"
                icon={<DashboardOutlined />}
                onClick={() => {
                  navigate("/owner");
                  setIsMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  height: 48,
                  fontWeight: 500,
                  border: `1px solid ${colors.accent}`,
                  color: colors.accent,
                  background: "transparent",
                  borderRadius: 0,
                  letterSpacing: "1px",
                }}
              >
                Dashboard
              </Button>
              <Button
                type="text"
                onClick={() => logout()}
                style={{
                  width: "100%",
                  height: 48,
                  fontWeight: 400,
                  color: colors.textSecondary,
                  background: "transparent",
                  borderRadius: 0,
                }}
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
              style={{
                width: "100%",
                height: 48,
                fontWeight: 500,
                background: colors.accent,
                border: "none",
                color: "#000",
                borderRadius: 0,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </Drawer>

      {/* Main Content */}
      <Content style={{ marginTop: 0 }}>
        {location.pathname === "/client" && <HeroSection />}
        <Outlet />
      </Content>

      <AppFooter />
    </Layout>
  );
};
