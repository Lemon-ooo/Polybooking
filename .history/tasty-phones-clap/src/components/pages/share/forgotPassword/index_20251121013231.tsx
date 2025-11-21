import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { authProvider } from "../../providers/authProvider";
import { Link } from "react-router-dom";

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
      const res = await authProvider.forgotPassword(values.email);

      setMessage(res.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 420, margin: "60px auto" }}>
      <Title level={3}>Quên mật khẩu</Title>
      <p>Nhập email để nhận mật khẩu mới qua email.</p>

      {message && (
        <Alert type="success" message={message} style={{ marginBottom: 16 }} />
      )}
      {error && (
        <Alert type="error" message={error} style={{ marginBottom: 16 }} />
      )}

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email"
            size="large"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          Gửi mật khẩu mới
        </Button>
      </Form>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link to="/login">Quay lại đăng nhập</Link>
      </div>
    </Card>
  );
};
