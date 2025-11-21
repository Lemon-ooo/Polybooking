import React, { useState } from "react";
import { useForgotPassword } from "@refinedev/core";
import { Layout, Card, Form, Input, Button, Typography, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Login.css";

const { Title } = Typography;

export const ForgotPassword: React.FC = () => {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const [error, setError] = useState("");

  const onFinish = (values: any) => {
    setError("");

    forgotPassword(values, {
      onError: (err: any) => {
        setError(err?.message || "Không thể gửi email!");
      },
    });
  };

  return (
    <Layout className="login-layout">
      <Card className="login-card">
        <div className="login-header">
          <Title level={3}>Quên mật khẩu</Title>
          <p className="login-subtitle">Nhập email để nhận mật khẩu mới</p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="Nhập email"
              className="custom-input"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isPending}
          >
            Gửi mật khẩu mới
          </Button>

          <p style={{ textAlign: "center", marginTop: 12 }}>
            <Link to="/login">Quay lại đăng nhập</Link>
          </p>
        </Form>
      </Card>
    </Layout>
  );
};
