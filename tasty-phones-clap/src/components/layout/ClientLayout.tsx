// src/layouts/ClientLayout.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Layout, Button, Avatar, Space, Dropdown } from "antd";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { HeroSection } from "./HeroSection";
import { Footer } from "./Footer";

const { Header, Content } = Layout;

interface NavLink {
  name: string;
  path: string;
  key: string;
}

export const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const { data: identity } = useGetIdentity<any>();
  const { mutate: logout } = useLogout();

  const navLinks: NavLink[] = [
    { name: "Home", path: "/client", key: "/client" },
    { name: "Rooms & Suites", path: "/client/rooms", key: "/client/rooms" },
    { name: "Services", path: "/client/services", key: "/client/services" },
    { name: "Events", path: "/client/events", key: "/client/events" },
    { name: "about", path: "/client/about", key: "/client/about" },
    {
      name: "Experience",
      path: "/client/experience",
      key: "/client/experience",
    },
    { name: "Gallery", path: "/client/galleries", key: "/client/galleries" },
    { name: "Contact", path: "/client/contact", key: "/client/contact" },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const colors = useMemo(
    () => ({
      // Khi scroll → ĐEN THUẦN (#000)
      bg: scrolled ? "#000" : "rgba(10, 10, 10, 0.3)",
      text: "#fff",
      accent: "#c9a96e",
      border: "rgba(201, 169, 110, 0.3)",
    }),
    [scrolled]
  );

  // Header style - vẫn giữ glass effect khi chưa scroll
  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 100,
    padding: "0 3rem",
    background: colors.bg,
    borderBottom: `1px solid ${colors.border}`,
    transition: "background 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: scrolled ? "none" : "blur(10px)", // Tắt blur khi scroll
    WebkitBackdropFilter: scrolled ? "none" : "blur(10px)",
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8f5f2" }}>
      {/* ================== HEADER (DESKTOP) ================== */}
      <Header style={headerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1600,
            margin: "0 auto",
            height: "100%",
          }}
        >
          {/* LEFT NAV */}
          <nav
            style={{
              display: "flex",
              gap: 36,
              alignItems: "center",
              flex: "0 1 auto",
            }}
          >
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.key}
                to={link.path}
                style={{
                  color: pathname === link.key ? colors.accent : colors.text,
                  textDecoration: "none",
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  transition: "color 0.3s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (pathname !== link.key)
                    e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  if (pathname !== link.key)
                    e.currentTarget.style.color = colors.text;
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* LOGO */}
          <Link
            to="/client"
            style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}
          >
            <img
              src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
              alt="Hotel Deluxe"
              style={{
                height: 64,
                maxHeight: "100%",
                objectFit: "contain",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </Link>

          {/* RIGHT NAV */}
          <nav
            style={{
              display: "flex",
              gap: 36,
              alignItems: "center",
              flex: "0 1 auto",
            }}
          >
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.key}
                to={link.path}
                style={{
                  color: pathname === link.key ? colors.accent : colors.text,
                  textDecoration: "none",
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  transition: "color 0.3s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (pathname !== link.key)
                    e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  if (pathname !== link.key)
                    e.currentTarget.style.color = colors.text;
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTIONS - Chỉ còn Avatar / Sign In */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flex: "0 0 auto",
            }}
          >
            {identity ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "profile",
                      label: "My Profile",
                      onClick: () => navigate("/profile"),
                    },
                    {
                      key: "bookings",
                      label: "My Bookings",
                      onClick: () => navigate("/my-bookings"),
                    },
                    { key: "logout", label: "Logout", onClick: () => logout() },
                  ],
                }}
                trigger={["click"]}
              >
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  style={{
                    cursor: "pointer",
                    background: colors.accent,
                    color: "#000",
                    fontWeight: 600,
                  }}
                />
              </Dropdown>
            ) : (
              <Button
                style={{
                  background: colors.accent,
                  color: "#000",
                  border: "none",
                  fontWeight: 600,
                  height: 40,
                  padding: "0 24px",
                  fontSize: "0.875rem",
                }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </Header>

      {/* ================== CONTENT ================== */}
      <Content>
        {pathname === "/client" && <HeroSection />}
        <div style={{ minHeight: "60vh", background: "#f8f5f2" }}>
          <Outlet />
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};
