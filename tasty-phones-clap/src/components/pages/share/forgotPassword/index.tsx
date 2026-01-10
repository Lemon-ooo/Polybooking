import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography, Layout } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { authProvider } from "../../../../providers";
import "./ForgotPassword.css";

const { Title } = Typography;

export const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

const onFinish = async (values: any) => {
  setError("");
  setMessage("");
  setLoading(true);

  try {
    const res = await authProvider.forgotPassword({ email: values.email });
    setMessage(res.message || "The password reset email has been sent!");
  } catch (err: any) {
    setError(err?.message || "Something went wrong. Please try again!");
  } finally {
    setLoading(false);
  }
};


  return (
    <Layout className="forgot-layout">
      <div className="forgot-hero">
        {/* TEXT LEFT */}
        <div className="forgot-overlay-text">
          <h1>Account Recovery</h1>
          <p>
            Don’t worry! We will send a new password to your email so you can
            continue enjoying premium services at PolyStay.
          </p>
        </div>

        {/* CARD */}
        <Card className="forgot-card">
          <Title level={3} className="forgot-title">
            Forgot Password
          </Title>

          <p className="forgot-description">
            Enter your email to receive a new password.
          </p>

          {message && (
            <Alert
              type="success"
              message={message}
              showIcon
              className="forgot-alert"
            />
          )}

          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              className="forgot-alert"
            />
          )}

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email address!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Button
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="forgot-button"
            >
              SEND NEW PASSWORD
            </Button>
          </Form>

          <div className="forgot-back">
            <Link to="/login">← Back to login</Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
