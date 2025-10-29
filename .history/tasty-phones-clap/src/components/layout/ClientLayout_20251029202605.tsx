import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Content } = Layout;

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div
          className="demo-logo"
          style={{ color: "white", marginRight: "24px" }}
        >
          🏨 Polybooking
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/client",
              label: "Trang chủ",
              onClick: () => navigate("/client"),
            },
            {
              key: "/client/bookings",
              label: "Đặt phòng",
              onClick: () => navigate("/client/bookings"),
            },
            {
              key: "/client/profile",
              label: "Hồ sơ",
              onClick: () => navigate("/client/profile"),
            },
          ]}
        />
      </Header>
      <Content style={{ padding: "24px", background: colorBgContainer }}>
        {children}
      </Content>
    </Layout>
  );
};
