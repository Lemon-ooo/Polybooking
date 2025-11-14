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
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
// @ts-ignore
import { assets } from "../../assets/assets";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Footer as AppFooter } from "./Footer";

const { Header, Content } = Layout;
const BookIcon = () => <BookOutlined style={{ fontSize: "16px" }} />;

export const ClientLayout: React.FC = () => {
  const { token } = theme.useToken();
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
    { name: "Events", path: "/client/events", key: "/client/events" },
    {
      name: "Experience",
      path: "/client/experience",
      key: "/client/experience",
    },
    { name: "Gallery", path: "/client/gallery", key: "/client/gallery" },
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

  const linkColor = isScrolled ? "#374151" : "#fff";

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
    padding: "16px 64px",
    transition: "all 0.3s ease",
    background: isScrolled ? "rgba(255,255,255,0.85)" : "#5C4BFF",
    backdropFilter: isScrolled ? "blur(10px)" : "none",
    boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
  };

  return (
    <Layout style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Header style={headerStyle}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={assets.logo}
            alt="logo"
            style={{
              height: 36,
              filter: isScrolled ? "none" : "brightness(0) invert(1)",
              transition: "all 0.3s ease",
            }}
          />
        </Link>

        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
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
                  fontSize: 14,
                  position: "relative",
                  paddingBottom: 4,
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
                      height: 2,
                      background: linkColor,
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {!isMobile && (
          <Space size="large">
            <Button
              type="text"
              icon={
                <SearchOutlined style={{ fontSize: 20, color: linkColor }} />
              }
            />
            {currentUser ? (
              <>
                <Button
                  type="default"
                  onClick={() => navigate("/owner")}
                  style={{
                    borderRadius: 999,
                    padding: "4px 16px",
                    fontSize: 14,
                    fontWeight: 300,
                    marginLeft: 8,
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
                      src={currentUser?.image}
                    />
                    <span>
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
              >
                Login
              </Button>
            )}
          </Space>
        )}

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
                  size="small"
                  icon={<UserOutlined />}
                  src={currentUser?.image}
                />
              </Dropdown>
            )}
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20, color: "#fff" }} />}
              onClick={() => setIsMenuOpen(true)}
            />
          </Space>
        )}
      </Header>

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
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => setIsMenuOpen(false),
          }))}
        />
        {currentUser && (
          <Button
            type="default"
            icon={<DashboardOutlined />}
            onClick={() => {
              navigate("/owner");
              setIsMenuOpen(false);
            }}
            style={{ width: "100%", marginTop: 12 }}
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
            style={{ width: "100%", marginTop: 12 }}
          >
            Login
          </Button>
        )}
      </Drawer>

      <Content style={{ marginTop: 64 }}>
        <Outlet />
      </Content>

      <AppFooter />
    </Layout>
  );
};
