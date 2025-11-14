import React, { useEffect, useState, useMemo } from "react";
import { Layout, Button, Avatar, Space, Dropdown, theme } from "antd";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  PhoneOutlined,
  MenuOutlined,
} from "@ant-design/icons";
// @ts-ignore
import { assets } from "../../assets/assets";
import { useGetIdentity, useLogout } from "@refinedev/core";

const { Header, Content, Footer } = Layout;
const { useToken } = theme;

interface NavLink {
  name: string;
  path: string;
  key: string;
}

const HeroSection: React.FC = () => (
  <section
    style={{
      height: "100vh",
      backgroundImage: `url(${assets.heroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textAlign: "center",
      fontFamily: "'Cormorant Garamond', serif",
      padding: "0 20px",
      position: "relative",
    }}
  >
    {/* Overlay để text dễ đọc hơn */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.3)",
      }}
    />
    <div style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          letterSpacing: "3px",
          margin: 0,
          lineHeight: 1.2,
          fontWeight: 400,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Welcome to Hotel Deluxe
      </h1>
      <p
        style={{
          fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
          letterSpacing: "1.5px",
          marginTop: "1rem",
          fontWeight: 300,
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        }}
      >
        Experience luxury like never before
      </p>
    </div>
  </section>
);

const AppFooter: React.FC = () => (
  <Footer
    style={{
      background: "#0a0a0a",
      color: "#fff",
      textAlign: "center",
      padding: "2.5rem 1.25rem",
      fontFamily: "'Cormorant Garamond', serif",
      borderTop: "1px solid rgba(201, 169, 110, 0.2)",
    }}
  >
    <img
      src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
      alt="Hotel Deluxe"
      style={{
        height: "2rem",
        marginBottom: "1rem",
        filter: "brightness(0) invert(1)",
      }}
    />
    <div style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
      © 2025 Hotel Deluxe. All rights reserved.
    </div>
    <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>
      Designed with ❤️ to match Rue de l'Amour style
    </div>
  </Footer>
);

export const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token } = useToken();

  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const currentUser = identity || getUserFromStorage();

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

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50 || location.pathname !== "/client";
      setIsScrolled(scrolled);
    };

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const colors = useMemo(
    () => ({
      bg: isScrolled ? "rgba(10, 10, 10, 0.98)" : "transparent",
      text: "#ffffff",
      textSecondary: "#e0e0e0",
      accent: "#c9a96e",
      accentDark: "#b8934b",
      border: "rgba(201, 169, 110, 0.3)",
      backdrop: isScrolled ? "blur(10px)" : "none",
      shadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "none",
    }),
    [isScrolled]
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
    padding: isMobile ? "0 1rem" : "0 3.75rem",
    transition: "all 0.3s ease-in-out",
    background: colors.bg,
    backdropFilter: colors.backdrop,
    WebkitBackdropFilter: colors.backdrop,
    boxShadow: colors.shadow,
    borderBottom: isScrolled ? `1px solid ${colors.border}` : "none",
    height: "5rem",
    fontFamily: "'Cormorant Garamond', serif",
  };

  const renderNavLinks = (links: NavLink[]) =>
    links.map((link) => (
      <Link
        key={link.key}
        to={link.path}
        style={{
          color: location.pathname === link.path ? colors.accent : colors.text,
          textDecoration: "none",
          fontSize: isMobile ? "0.875rem" : "0.9rem",
          fontWeight: 500,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          padding: isMobile ? "0.5rem 0.75rem" : "0 0.75rem",
          position: "relative",
          transition: "color 0.3s ease",
          display: "block",
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
              bottom: isMobile ? "-4px" : "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "1.25rem",
              height: "1px",
              background: colors.accent,
            }}
          />
        )}
      </Link>
    ));

  const renderDesktopNav = () => (
    <>
      {/* Left Menu */}
      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {renderNavLinks(navLinks.slice(0, 3))}
      </nav>

      {/* Center Logo */}
      <Link
        to="/client"
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0 2rem",
        }}
      >
        <img
          src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
          alt="Hotel Deluxe"
          style={{
            height: "3.5rem",
            transition: "all 0.3s ease",
          }}
        />
      </Link>

      {/* Right Menu */}
      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {renderNavLinks(navLinks.slice(3))}
      </nav>
    </>
  );

  const renderMobileNav = () => (
    <>
      {/* Logo */}
      <Link
        to="/client"
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <img
          src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
          alt="Hotel Deluxe"
          style={{
            height: "2.5rem",
          }}
        />
      </Link>

      {/* Mobile Menu Button */}
      <Button
        type="text"
        icon={
          <MenuOutlined style={{ color: colors.text, fontSize: "1.25rem" }} />
        }
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          width: "2.5rem",
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </>
  );

  const mobileMenuStyle: React.CSSProperties = {
    position: "fixed",
    top: "5rem",
    left: 0,
    right: 0,
    background: "rgba(10, 10, 10, 0.98)",
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${colors.border}`,
    padding: "1rem",
    display: mobileMenuOpen ? "block" : "none",
    zIndex: 999,
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Header style={headerStyle}>
        {isMobile ? renderMobileNav() : renderDesktopNav()}

        {/* User Actions - Desktop */}
        {!isMobile && (
          <Space size="middle" align="center" style={{ marginLeft: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                color: colors.accent,
                fontSize: "0.875rem",
                letterSpacing: "0.5px",
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
                height: "1.5rem",
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
                trigger={["click"]}
              >
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  src={currentUser?.image}
                  style={{
                    border: `1px solid ${colors.accent}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </Dropdown>
            ) : (
              <Button
                type="primary"
                onClick={() => navigate("/login")}
                style={{
                  background: colors.accent,
                  border: "none",
                  color: "#000",
                  height: "2.5rem",
                  borderRadius: "2px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "0 1.5rem",
                  transition: "all 0.3s ease",
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
      </Header>

      {/* Mobile Menu */}
      {isMobile && (
        <div style={mobileMenuStyle}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {renderNavLinks(navLinks)}

            {/* Mobile User Actions */}
            <div
              style={{
                padding: "1rem 0.75rem 0",
                borderTop: `1px solid ${colors.border}`,
                marginTop: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: colors.accent,
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                <PhoneOutlined />
                <span style={{ color: colors.textSecondary }}>
                  +1 (555) 123-4567
                </span>
              </div>

              {currentUser ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="text"
                    icon={<UserOutlined />}
                    onClick={() => navigate("/profile")}
                    style={{
                      color: colors.text,
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    My Profile
                  </Button>
                  <Button
                    type="text"
                    icon={<BookOutlined />}
                    onClick={() => navigate("/my-bookings")}
                    style={{
                      color: colors.text,
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    My Bookings
                  </Button>
                  <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={() => logout()}
                    style={{
                      color: colors.text,
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    Logout
                  </Button>
                </Space>
              ) : (
                <Button
                  type="primary"
                  onClick={() => navigate("/login")}
                  style={{
                    background: colors.accent,
                    border: "none",
                    color: "#000",
                    width: "100%",
                    height: "2.5rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <Content style={{ marginTop: 0 }}>
        {location.pathname === "/client" && <HeroSection />}
        <div style={{ minHeight: "60vh" }}>
          <Outlet />
        </div>
      </Content>

      <AppFooter />
    </Layout>
  );
};
