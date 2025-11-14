import React, { useEffect, useState } from "react";
import { Layout, Button, Avatar, Space, Dropdown } from "antd";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
// @ts-ignore
import { assets } from "../../assets/assets";
import { useGetIdentity, useLogout } from "@refinedev/core";

const { Header, Content, Footer } = Layout;

const HeroSection: React.FC = () => (
  <div
    style={{
      height: "100vh",
      backgroundImage: `url(${assets.heroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textAlign: "center",
      fontFamily: "'Cormorant Garamond', serif",
      padding: "0 20px",
    }}
  >
    <div style={{ maxWidth: 800 }}>
      <h1
        style={{
          fontSize: "clamp(32px, 5vw, 64px)",
          letterSpacing: "4px",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        Welcome to Hotel Deluxe
      </h1>
      <p
        style={{
          fontSize: "clamp(14px, 2vw, 20px)",
          letterSpacing: "2px",
          marginTop: 16,
        }}
      >
        Experience luxury like never before
      </p>
    </div>
  </div>
);

const AppFooter: React.FC = () => (
  <Footer
    style={{
      background: "#0a0a0a",
      color: "#fff",
      textAlign: "center",
      padding: "40px 20px",
      fontFamily: "'Cormorant Garamond', serif",
    }}
  >
    <img
      src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
      alt="Hotel Deluxe"
      style={{ height: 32, marginBottom: 16 }}
    />
    <div style={{ marginBottom: 8 }}>
      © 2025 Hotel Deluxe. All rights reserved.
    </div>
    <div style={{ fontSize: 12, color: "#e0e0e0" }}>
      Designed with ❤️ to match Rue de l’Amour style
    </div>
  </Footer>
);

export const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

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

  const navLinksLeft = [
    { name: "Home", path: "/client", key: "/client" },
    { name: "Rooms & Suites", path: "/client/rooms", key: "/client/rooms" },
    { name: "Services", path: "/client/services", key: "/client/services" },
  ];

  const navLinksRight = [
    {
      name: "Experience",
      path: "/client/experience",
      key: "/client/experience",
    },
    { name: "Gallery", path: "/client/galleries", key: "/client/galleries" },
    { name: "Contact", path: "/client/contact", key: "/client/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50 || location.pathname !== "/client");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

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
    padding: "20px 80px",
    transition: "all 0.4s ease",
    background: colors.bg,
    backdropFilter: colors.backdrop,
    WebkitBackdropFilter: colors.backdrop,
    boxShadow: colors.shadow,
    borderBottom: isScrolled ? `1px solid ${colors.border}` : "none",
    height: "80px",
    fontFamily: "'Cormorant Garamond', serif",
  };

  const renderNavLinks = (links: typeof navLinksLeft) =>
    links.map((link) => (
      <Link
        key={link.key}
        to={link.path}
        style={{
          color: location.pathname === link.path ? colors.accent : colors.text,
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          position: "relative",
          padding: "8px 0",
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
    ));

  return (
    <Layout style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {renderNavLinks(navLinksLeft)}
        </div>

        {/* Logo ở giữa */}
        <Link to="/client">
          <img
            src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
            alt="Hotel Deluxe"
            style={{ height: 48 }}
          />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {renderNavLinks(navLinksRight)}

          {/* Actions */}
          <Space size={20} align="center">
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
              <span style={{ color: colors.textSecondary, fontWeight: 300 }}>
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
                    { type: "divider" },
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
                <Button type="text">
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
                  color: "#000",
                  height: "40px",
                }}
              >
                Sign In
              </Button>
            )}
          </Space>
        </div>
      </Header>

      <Content style={{ marginTop: 0 }}>
        {location.pathname === "/client" && <HeroSection />}
        <Outlet />
      </Content>

      <AppFooter />
    </Layout>
  );
};
