// src/layouts/ClientLayout.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Layout, Button, Avatar, Dropdown } from "antd";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useLogout } from "@refinedev/core";
import { HeroSection } from "./HeroSection";
import { Footer } from "./Footer";
import { axiosInstance } from "./../../providers/data/axiosConfig";
import { ClientChatWidget } from "./ClientChatWidget";

const { Header, Content } = Layout;

interface NavLink {
  name: string;
  path: string;
  key: string;
}

interface CurrentUser {
  user_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

export const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // State lưu thông tin user hiện tại
  const [user, setUser] = useState<CurrentUser | null>(null);

  const { mutate: logout } = useLogout();

  const navLinks: NavLink[] = [
    { name: "Home", path: "/client", key: "/client" },
    { name: "Rooms & Suites", path: "/client/rooms", key: "/client/rooms" },
    { name: "About", path: "/client/about", key: "/client/about" },
    { name: "Services", path: "/client/services", key: "/client/services" },
    { name: "Events", path: "/client/events", key: "/client/events" },
    { name: "Gallery", path: "/client/galleries", key: "/client/galleries" },
    { name: "Booking", path: "/client/bookings", key: "/client/bookings" },
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
      bg: scrolled ? "#000" : "rgba(10, 10, 10, 0.3)",
      text: "#fff",
      accent: "#c9a96e",
      border: "rgba(201, 169, 110, 0.3)",
    }),
    [scrolled]
  );

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
    backdropFilter: scrolled ? "none" : "blur(10px)",
    WebkitBackdropFilter: scrolled ? "none" : "blur(10px)",
  };

  // Fetch user từ API /client/profile
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await axiosInstance.get("/client/profile");
      if (res.data.success && res.data.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // Fetch lần đầu khi load layout
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // LẮNG NGHE SỰ KIỆN "avatarUpdated" từ trang Profile → cập nhật ngay!
  useEffect(() => {
    const handleAvatarChange = () => {
      fetchCurrentUser();
    };

    window.addEventListener("avatarUpdated", handleAvatarChange);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarChange);
    };
  }, []);

  // TỰ ĐỘNG CẬP NHẬT KHI TAB ĐƯỢC FOCUS LẠI (dự phòng nếu đổi ảnh ở tab khác)
  useEffect(() => {
    const handleFocus = () => {
      fetchCurrentUser();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8f5f2" }}>
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
              src="https://png.pngtree.com/png-clipart/20240911/original/pngtree-3d-beautiful-letter-p-png-image_15989738.png"
              alt="Hotel Deluxe"
              style={{
                height: 76,
                width: 72, // Thêm width cố định để logo thành hình vuông (tùy chọn)
                maxHeight: "100%",
                objectFit: "cover", // Đổi thành cover để ảnh lấp đầy khung tròn đẹp hơn
                borderRadius: "50%", // Bo viền tròn hoàn toàn
                overflow: "hidden", // Đảm bảo ảnh không tràn ra ngoài viền tròn
                transition: "transform 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)", // Bóng nhẹ cho đẹp (tùy chọn)
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

          {/* RIGHT ACTIONS - Avatar hoặc Sign In */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flex: "0 0 auto",
            }}
          >
            {user ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "profile",
                      label: "My Profile",
                      onClick: () => navigate("/client/profile"),
                    },
                    {
                      key: "bookings",
                      label: "My Bookings",
                      onClick: () => navigate("/client/my-bookings"),
                    },
                    { key: "divider", type: "divider" },
                    { key: "logout", label: "Logout", onClick: () => logout() },
                  ],
                }}
                trigger={["click"]}
              >
                <Avatar
                  size={40}
                  src={
                    user.avatar_url
                      ? `${user.avatar_url}?t=${Date.now()}`
                      : undefined
                  }
                  icon={<UserOutlined />}
                  alt={user.user_name || "User"}
                  style={{
                    cursor: "pointer",
                    background: colors.accent,
                    color: "#000",
                    fontWeight: 600,
                    border: "2px solid rgba(255,255,255,0.2)",
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

      <Content>
        {pathname === "/client" && <HeroSection />}
        <div style={{ minHeight: "60vh", background: "#f8f5f2" }}>
          <Outlet />
        </div>
      </Content>
      <ClientChatWidget />

      <Footer />
    </Layout>
  );
};
