import React from "react";
import { Layout, Menu, Button, Dropdown, Avatar, theme } from "antd";
import { useLogout, useGetIdentity, useMenu } from "@refinedev/core";
import { UserOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { ThemedTitle } from "@refinedev/antd";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();
  const { token } = theme.useToken();
  const { menuItems } = useMenu();
  const navigate = useNavigate(); // ✅ Dùng để điều hướng sau logout

  // ✅ Hàm xử lý logout tương tự AdminLayout
  const handleLogout = async () => {
    await logout(); // Gọi refine logout để xoá token, user
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true }); // ✅ Điều hướng về login
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <ThemedTitle
            collapsed={false}
            text="Khách Sạn"
            icon={<HomeOutlined />}
          />
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: token.colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <div></div>

          <Dropdown
            menu={{
              items: [
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: "Hồ sơ",
                },
                {
                  type: "divider",
                },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Đăng xuất",
                  onClick: handleLogout, // ✅ Gọi hàm logout
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button
              type="text"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Avatar icon={<UserOutlined />} />
              <span>{identity?.name}</span>
            </Button>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
