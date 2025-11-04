import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { Layout, Menu, Button, Drawer, Grid, Input } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  CustomerServiceOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const BookIcon = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4 "
    />
  </svg>
);

const Navbar = () => {
  const navLinks = [
    { key: "home", label: "Home", path: "/" },
    { key: "rooms", label: "Rooms", path: "/rooms" },
    { key: "services", label: "Services", path: "/services" },
    { key: "experience", label: "Experience", path: "/" },
    { key: "about", label: "About", path: "/" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <Layout.Header
      style={{
        position: "fixed",
        zIndex: 50,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: screens.md ? "0 64px" : "0 16px",
        backdropFilter: isScrolled ? "blur(6px)" : undefined,
        background: isScrolled ? "rgba(255,255,255,0.8)" : "#6366F1",
        boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          style={{
            height: 36,
            filter: isScrolled ? "invert(1) opacity(0.8)" : undefined,
          }}
        />
      </Link>

      {screens.md && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Menu
            mode="horizontal"
            selectable={false}
            items={navLinks.map((l) => ({
              key: l.key,
              label: <Link to={l.path}>{l.label}</Link>,
              icon:
                l.key === "home" ? (
                  <HomeOutlined />
                ) : l.key === "rooms" ? (
                  <AppstoreOutlined />
                ) : l.key === "services" ? (
                  <CustomerServiceOutlined />
                ) : l.key === "about" ? (
                  <InfoCircleOutlined />
                ) : undefined,
            }))}
            style={{ background: "transparent", borderBottom: "none" }}
          />
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            allowClear
            style={{ width: 200 }}
          />
          <Button
            type={isScrolled ? "default" : "primary"}
            icon={<DashboardOutlined />}
            onClick={() => navigate("/owner")}
          >
            Dashboard
          </Button>
          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<BookIcon />}
                  onClick={() => navigate("/my-bookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <Button
              type={isScrolled ? "primary" : "default"}
              onClick={openSignIn}
            >
              Login
            </Button>
          )}
        </div>
      )}

      {!screens.md && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<BookIcon />}
                  onClick={() => navigate("/my-bookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsMenuOpen(true)}
          />
          <Drawer
            open={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            placement="left"
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              mode="inline"
              selectable={false}
              onClick={() => setIsMenuOpen(false)}
              items={[
                ...navLinks.map((l) => ({
                  key: l.key,
                  label: <Link to={l.path}>{l.label}</Link>,
                })),
                { type: "divider" },
                user
                  ? {
                      key: "dash",
                      icon: <DashboardOutlined />,
                      label: (
                        <span onClick={() => navigate("/owner")}>
                          Dashboard
                        </span>
                      ),
                    }
                  : {
                      key: "login",
                      label: <span onClick={openSignIn}>Login</span>,
                    },
              ]}
            />
          </Drawer>
        </div>
      )}
    </Layout.Header>
  );
};
export default Navbar;
