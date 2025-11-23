// src/components/pages/share/ForgotPassword.tsx
import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

export const ForgotPassword: React.FC = () => {
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/forgot-password", {
        email: values.email,
      });
      if (res.data.success) {
        setSuccess(res.data.message);
      } else {
        setError(res.data.message || "Đã xảy ra lỗi.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi gửi email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Quên mật khẩu
        </Title>

        {success && (
          <Alert
            message={success}
            type="success"
            style={{ marginBottom: 16 }}
          />
        )}
        {error && (
          <Alert message={error} type="error" style={{ marginBottom: 16 }} />
        )}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Gửi mật khẩu mới
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
