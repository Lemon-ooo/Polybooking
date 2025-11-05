import React from "react";
import { Layout, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { ThemedTitle } from "@refinedev/antd";

const { Header, Content, Footer } = Layout;

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          background: token.colorBgContainer,
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        }}
      >
        {/* Logo + tên */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemedTitle
            collapsed={false}
            text="Khách Sạn"
            icon={<HomeOutlined />}
          />
        </div>

        {/* Nút đăng nhập / đăng ký */}
        <div style={{ display: "flex", gap: 12 }}>
          <Button type="default" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
          <Button type="primary" onClick={() => navigate("/register")}>
            Đăng ký
          </Button>
        </div>
      </Header>

      {/* NỘI DUNG */}
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          minHeight: "calc(100vh - 160px)",
        }}
      >
        {children}
      </Content>

      {/* FOOTER */}
      <Footer style={{ textAlign: "center", color: "#999" }}>
        © {new Date().getFullYear()} Khách Sạn — All Rights Reserved
      </Footer>
    </Layout>
  );
};
