import React, { useState, useEffect, useMemo } from "react";
import { Layout, Button, Avatar, Space, Dropdown } from "antd";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useGetIdentity, useLogout } from "@refinedev/core";

const { Header, Content, Footer } = Layout;

interface NavLink {
  name: string;
  path: string;
  key: string;
}

// ================= HeroSection Carousel =================
const HeroSection: React.FC = () => {
  const carouselImages = [
    "https://images.unsplash.com/photo-1611892441792-ae6af465f0f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const goldAccent = "#c9a96e";
  const textWhite = "#fff";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {carouselImages.map((img, idx) => (
        <div
          key={idx}
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.3)), url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: idx === currentSlide ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            color: textWhite,
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <div style={{ maxWidth: 700 }}>
            <h1
              style={{
                fontSize: "clamp(2rem,5vw,4rem)",
                letterSpacing: "3px",
                margin: 0,
              }}
            >
              Welcome to Hotel Deluxe
            </h1>
            <p
              style={{
                fontSize: "clamp(0.875rem,2vw,1.25rem)",
                marginTop: "1rem",
              }}
            >
              Experience luxury like never before
            </p>
            <Space size={16} style={{ marginTop: "2rem" }}>
              <Link to="/client/rooms">
                <Button
                  style={{
                    background: goldAccent,
                    color: "#000",
                    border: "none",
                    padding: "0 30px",
                  }}
                >
                  Book Your Stay
                </Button>
              </Link>
              <Link to="/client/services">
                <Button
                  style={{
                    background: "transparent",
                    border: `1px solid ${goldAccent}`,
                    color: textWhite,
                    padding: "0 30px",
                  }}
                >
                  Explore Services
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      ))}
    </section>
  );
};

// ================= Footer =================
const AppFooter: React.FC = () => (
  <Footer
    style={{
      background: "#0a0a0a",
      color: "#fff",
      textAlign: "center",
      padding: "2.5rem 1rem",
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

// ================= ClientLayout =================
export const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  const currentUser = identity;

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
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const colors = useMemo(
    () => ({
      bg: isScrolled ? "rgba(10,10,10,0.95)" : "transparent",
      text: "#fff",
      accent: "#c9a96e",
      accentDark: "#b8934b",
      border: "rgba(201,169,110,0.3)",
    }),
    [isScrolled]
  );

  const renderNavLinks = (links: NavLink[]) =>
    links.map((link) => (
      <Link
        key={link.key}
        to={link.path}
        style={{
          color: colors.text,
          textDecoration: "none",
          textTransform: "uppercase",
          margin: "0 8px",
        }}
      >
        {link.name}
      </Link>
    ));

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "0 1rem" : "0 3rem",
    height: 80,
    background: colors.bg,
    borderBottom: `1px solid ${colors.border}`,
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Header style={headerStyle}>
        {!isMobile ? (
          <>
            <nav style={{ display: "flex", gap: 16 }}>
              {renderNavLinks(navLinks.slice(0, 3))}
            </nav>
            <Link to="/client">
              <img
                src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
                alt="Logo"
                style={{ height: 48 }}
              />
            </Link>
            <nav style={{ display: "flex", gap: 16 }}>
              {renderNavLinks(navLinks.slice(3))}
            </nav>
            <Space size="middle" style={{ marginLeft: 16 }}>
              <div style={{ color: colors.accent }}>+1 (555) 123-4567</div>
              {currentUser ? (
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

      <Content style={{ marginTop: 80 }}>
        {location.pathname === "/client" && <HeroSection />}
        <div style={{ minHeight: "60vh" }}>
          <Outlet />
        </div>
      </Content>

      <AppFooter />
    </Layout>
  );
};
