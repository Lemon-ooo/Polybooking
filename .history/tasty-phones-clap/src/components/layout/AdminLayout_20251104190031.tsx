import React from "react";
import { Layout, Menu, Button, Dropdown, Avatar, theme } from "antd";
import { useLogout, useGetIdentity, useMenu } from "@refinedev/core";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  HomeOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { ThemedTitle } from "@refinedev/antd";

const { Header, Sider, Content } = Layout;

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();
  const { token } = theme.useToken();
  const { menuItems } = useMenu();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #303030",
          }}
        >
          <ThemedTitle
            collapsed={false}
            text="Admin Panel"
            icon={<ToolOutlined />}
          />
        </div>

        <Menu
          theme="dark"
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
          <div></div> {/* Spacer */}
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
                  onClick: () => logout(),
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
