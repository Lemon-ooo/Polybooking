import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Layout, Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Login: React.FC = () => {
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const onFinish = async (values: any) => {
    setError("");

    login(values, {
      onSuccess: (data: any) => {
        const redirectTo = data?.redirectTo || "/";
        navigate(redirectTo, { replace: true });
      },
      onError: (error: any) => {
        console.error("❌ Login error:", error);
        setError(error?.message || "Email hoặc mật khẩu không đúng!");
      },
    });
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.95)", // nền sáng cho input dễ nhìn
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <HomeOutlined style={{ fontSize: 32, color: "#1890ff" }} />
          <Title level={3} style={{ margin: "16px 0 8px 0" }}>
            Đăng nhập
          </Title>
          <p style={{ color: "#666" }}>Hệ thống đặt phòng khách sạn</p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
              style={{ color: "#000" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              style={{ color: "#000" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              size="large"
              style={{ width: "100%" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};
