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
    padding: "0 60px",
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
          fontSize: "16px",
          fontWeight: 500,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          padding: "0 8px",
          position: "relative",
        }}
      >
        {link.name}
        {location.pathname === link.path && (
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: "20px",
              height: "2px",
              background: colors.accent,
            }}
          />
        )}
      </Link>
    ));

  return (
    <Layout style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Header style={headerStyle}>
        {/* Menu trái */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {renderNavLinks(navLinksLeft)}
        </div>

        {/* Logo giữa */}
        <Link to="/client">
          <img
            src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
            alt="Hotel Deluxe"
            style={{ height: 60 }}
          />
        </Link>

        {/* Menu phải + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {renderNavLinks(navLinksRight)}

          {/* Phone & Sign In / Avatar */}
          <Space size={20} align="center">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: colors.accent,
                fontSize: "14px",
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
                height: "24px",
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
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  src={currentUser?.image}
                  style={{
                    border: `1px solid ${colors.accent}`,
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
            ) : (
              <Button
                type="primary"
                onClick={() => navigate("/login")}
                style={{
                  background: colors.accent,
                  color: "#000",
                  height: 40,
                  borderRadius: 0,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  padding: "0 24px",
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
