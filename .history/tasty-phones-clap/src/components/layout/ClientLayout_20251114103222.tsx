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
  const [mobile, setMobile] = useState(false);

  const { data: identity } = useGetIdentity<any>();
  const { mutate: logout } = useLogout();

  const navLinks: NavLink[] = [
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

  // ---------- responsive ----------
  useEffect(() => {
    const r = () => setMobile(window.innerWidth < 1024);
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // ---------- scroll ----------
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 50);
    s();
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  const colors = useMemo(
    () => ({
      bg: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
      text: "#fff",
      accent: "#c9a96e",
      border: "rgba(201,169,110,0.3)",
    }),
    [scrolled]
  );

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: mobile ? "0 1rem" : "0 3rem",
    height: 80,
    background: colors.bg,
    borderBottom: `1px solid ${colors.border}`,
    transition: "background 0.3s",
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      {/* ---------- HEADER ---------- */}
      <Header style={headerStyle}>
        {/* desktop */}
        {!mobile ? (
          <>
            <nav style={{ display: "flex", gap: 16 }}>
              {navLinks.slice(0, 3).map((l) => (
                <Link
                  key={l.key}
                  to={l.path}
                  style={{
                    color: colors.text,
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  {l.name}
                </Link>
              ))}
            </nav>

            <Link to="/client">
              <img
                src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
                alt="Logo"
                style={{ height: 48 }}
              />
            </Link>

            <nav style={{ display: "flex", gap: 16 }}>
              {navLinks.slice(3).map((l) => (
                <Link
                  key={l.key}
                  to={l.path}
                  style={{
                    color: colors.text,
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  {l.name}
                </Link>
              ))}
            </nav>

            <Space size="middle">
              <div style={{ color: colors.accent }}>+1 (555) 123-4567</div>
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
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logout(),
                      },
                    ],
                  }}
                >
                  <Avatar size={36} icon={<UserOutlined />} />
                </Dropdown>
              ) : (
                <Button
                  style={{ background: colors.accent, color: "#000" }}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              )}
            </Space>
          </>
        ) : (
          <Link to="/client">
            <img
              src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
              alt="Logo"
              style={{ height: 40 }}
            />
          </Link>
        )}
      </Header>

      {/* ---------- CONTENT ---------- */}
      <Content>
        {/* Hero chỉ hiển thị ở trang Home */}
        {pathname === "/client" && <HeroSection />}

        {/* Các page con (Outlet) sẽ bắt đầu ngay dưới hero hoặc header */}
        <div style={{ minHeight: "60vh", background: "#0a0a0a" }}>
          <Outlet />
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};
