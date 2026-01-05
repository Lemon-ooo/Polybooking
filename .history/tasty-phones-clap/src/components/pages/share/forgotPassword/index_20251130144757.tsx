import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography, Layout } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { authProvider } from "../../../../providers";
import "./ForgotPassword.css";

const { Title } = Typography;
const { Content } = Layout;

export const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await authProvider.forgotPassword(values.email);
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="forgot-password-container">
      <Content className="forgot-password-content">
        <Card className="forgot-password-card">
          <Title level={3} className="forgot-password-title">
            Quên mật khẩu
          </Title>
          <p className="forgot-password-description">
            Nhập email để nhận mật khẩu mới qua email.
          </p>

          {message && (
            <Alert
              type="success"
              message={message}
              className="forgot-password-alert"
            />
          )}
          {error && (
            <Alert
              type="error"
              message={error}
              className="forgot-password-alert"
            />
          )}

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="forgot-password-form"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email"
                size="large"
                className="forgot-password-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="forgot-password-button"
              >
                Gửi mật khẩu mới
              </Button>
            </Form.Item>
          </Form>

          <div className="forgot-password-link">
            <Link to="/login">Quay lại đăng nhập</Link>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};
