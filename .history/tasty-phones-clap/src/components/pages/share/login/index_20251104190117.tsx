import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Layout, Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined, HotelOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Login: React.FC = () => {
  const { mutate: login, isLoading } = useLogin();
  const [error, setError] = useState<string>("");

  const onFinish = async (values: any) => {
    setError("");
    login(values, {
      onSuccess: () => {
        // Redirect sẽ được xử lý trong authProvider
      },
      onError: (error) => {
        setError(error.message || "Đăng nhập thất bại");
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
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <HotelOutlined style={{ fontSize: 32, color: "#1890ff" }} />
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
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              style={{ width: "100%" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          <p>Demo accounts:</p>
          <p>
            <strong>Admin:</strong> admin@example.com / password
          </p>
          <p>
            <strong>Client:</strong> client@example.com / password
          </p>
        </div>
      </Card>
    </Layout>
  );
};
