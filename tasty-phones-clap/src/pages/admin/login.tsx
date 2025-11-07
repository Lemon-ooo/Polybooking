import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

export const AdminLoginPage = () => {
  const { mutate: login } = useLogin();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setIsLoading(true);

    // useLogin().mutate uses callbacks; don't await the mutate call
    login(values, {
      onSuccess: (data) => {
        message.success("Đăng nhập thành công");
        setIsLoading(false);
        // Explicitly navigate to admin dashboard to ensure redirect
        try {
          navigate("/admin/dashboard");
        } catch (e) {
          // ignore navigation errors
        }
      },
      onError: (err: any) => {
        message.error(err?.message || "Đã có lỗi xảy ra");
        setIsLoading(false);
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        title="Đăng nhập quản trị"
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Form
          form={form}
          name="admin_login"
          onFinish={onFinish}
          layout="vertical"
          disabled={isLoading}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
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

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              size="large"
              loading={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
