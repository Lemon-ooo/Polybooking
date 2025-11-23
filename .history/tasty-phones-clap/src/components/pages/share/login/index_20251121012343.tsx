import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import "./Login.css"; // để style placeholder và responsive

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
        // Bắt lỗi từ backend nếu có, fallback message mặc định
        setError(
          error?.response?.data?.message || "Email hoặc mật khẩu không đúng!"
        );
      },
    });
  };

  return (
    <Layout className="login-layout">
      <Card className="login-card">
        <div className="login-header">
          <HomeOutlined className="login-icon" />
          <Title level={3}>Đăng nhập</Title>
          <p className="login-subtitle">Hệ thống đặt phòng khách sạn</p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
              className="custom-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              className="custom-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              size="large"
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <p style={{ textAlign: "center" }}>
            Quên mật khẩu? <Link to="/forgot-password">Nhấn vào đây</Link>
          </p>
        </Form>
      </Card>
    </Layout>
  );
};
