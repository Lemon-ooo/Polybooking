import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Avatar, Drawer, Space, Dropdown } from "antd";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  UserOutlined,
  LoginOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  BookOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
// @ts-ignore
import { assets } from "../../assets/assets";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Footer as AppFooter } from "./Footer";
import { HeroSection } from "./HeroSection";

const { Header, Content } = Layout;
const BookIcon = () => <BookOutlined style={{ fontSize: "16px" }} />;

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
    { name: "Rooms", path: "/client/rooms", key: "/client/rooms" },
    { name: "Services", path: "/client/services", key: "/client/services" },
    {
      name: "Experience",
      path: "/client/experience",
      key: "/client/experience",
    },
    { name: "Gallery", path: "/client/galleries", key: "/client/galleries" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10 || location.pathname !== "/client");
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Deluxe color palette
  const colors = {
    bg: isScrolled ? "rgba(15, 15, 15, 0.92)" : "transparent",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    accent: "#d4af37", // Gold
    border: "rgba(212, 175, 55, 0.3)", // Gold border
    backdrop: isScrolled ? "blur(16px)" : "none",
    shadow: isScrolled ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "none",
  };

  const menuItems = navLinks.map((link) => ({
    key: link.key,
    label: <Link to={link.path}>{link.name}</Link>,
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
    padding: "18px 64px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    background: colors.bg,
    backdropFilter: colors.backdrop,
    WebkitBackdropFilter: colors.backdrop,
    boxShadow: colors.shadow,
    borderBottom: isScrolled ? `1px solid ${colors.border}` : "none",
  };

  return (
    <Layout
      style={{ minHeight: "100vh", overflowX: "hidden", background: "#0a0a0a" }}
    >
      <Header style={headerStyle}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={assets.logo}
            alt="logo"
            style={{
              height: 40,
              filter: "brightness(0) invert(1)",
              transition: "all 0.3s ease",
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
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
                  color: colors.text,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  position: "relative",
                  padding: "8px 0",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.text)
                }
              >
                {link.name}
                {location.pathname === link.path && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: colors.accent,
                      borderRadius: 1,
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <Space size={24}>
            <Button
              type="text"
              icon={
                <SearchOutlined style={{ fontSize: 20, color: colors.text }} />
              }
              style={{ padding: 8 }}
            />

            {currentUser ? (
              <>
                <Button
                  type="default"
                  onClick={() => navigate("/owner")}
                  style={{
                    borderRadius: 999,
                    padding: "8px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    border: `1px solid ${colors.accent}`,
                    color: colors.accent,
                    background: "transparent",
                    transition: "all 0.3s ease",
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
                    style: {
                      background: "#1a1a1a",
                      border: `1px solid ${colors.border}`,
                    },
                  }}
                  placement="bottomRight"
                  overlayStyle={{ borderRadius: 12 }}
                >
                  <Button
                    type="text"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: colors.text,
                      padding: "4px 8px",
                      borderRadius: 999,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(212, 175, 55, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Avatar
                      size={32}
                      icon={<UserOutlined />}
                      src={currentUser?.image}
                      style={{ border: `1.5px solid ${colors.accent}` }}
                    />
                    <span style={{ fontWeight: 500 }}>
                      {currentUser?.name || currentUser?.email || "User"}
                    </span>
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Button
                type="default"
                icon={<LoginOutlined />}
                onClick={() => navigate("/login")}
                style={{
                  borderRadius: 999,
                  padding: "8px 24px",
                  fontWeight: 500,
                  background: colors.accent,
                  border: "none",
                  color: "#000",
                  boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Login
              </Button>
            )}
          </Space>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Space>
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
                    border: `1.5px solid ${colors.accent}`,
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
            )}

            <Button
              type="text"
              icon={
                <MenuOutlined style={{ fontSize: 22, color: colors.text }} />
              }
              onClick={() => setIsMenuOpen(true)}
              style={{ padding: 8 }}
            />
          </Space>
        )}
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ color: colors.text, fontWeight: 600, fontSize: 18 }}>
            Menu
          </div>
        }
        placement="left"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        width="100%"
        closeIcon={
          <CloseOutlined style={{ color: colors.text, fontSize: 20 }} />
        }
        styles={{
          body: { background: "#0f0f0f", padding: 0 },
          header: {
            background: "#0f0f0f",
            borderBottom: `1px solid ${colors.border}`,
          },
        }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            ...item,
            style: {
              background: "transparent",
              color: colors.text,
              fontSize: 16,
              fontWeight: 500,
              borderBottom: `1px solid ${colors.border}`,
            },
            onClick: () => setIsMenuOpen(false),
          }))}
          style={{ background: "transparent", borderRight: "none" }}
        />

        <div style={{ padding: "16px" }}>
          {currentUser && (
            <Button
              type="default"
              icon={<DashboardOutlined />}
              onClick={() => {
                navigate("/owner");
                setIsMenuOpen(false);
              }}
              style={{
                width: "100%",
                marginTop: 12,
                height: 48,
                fontWeight: 500,
                border: `1px solid ${colors.accent}`,
                color: colors.accent,
                background: "transparent",
              }}
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
              style={{
                width: "100%",
                marginTop: 12,
                height: 48,
                fontWeight: 500,
                background: colors.accent,
                border: "none",
                color: "#000",
              }}
            >
              Login
            </Button>
          )}
        </div>
      </Drawer>

      {/* Main Content */}
      <Content style={{ marginTop: 0, paddingTop: 80 }}>
        {location.pathname === "/client" && <HeroSection />}
        <Outlet />
      </Content>

      <AppFooter />
    </Layout>
  );
};
