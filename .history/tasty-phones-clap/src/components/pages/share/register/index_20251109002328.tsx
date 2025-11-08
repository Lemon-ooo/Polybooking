import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../../../../providers/auth/authProvider";
// ⚠️ import đúng đường dẫn của bạn

const { Title, Text } = Typography;

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (!authProvider.register) {
      message.error("Chức năng đăng ký chưa được cấu hình.");
      return;
    }

    const result = await authProvider.register(values);

    if (result?.success) {
      message.success("Đăng ký thành công!");
      navigate(result.redirectTo || "/client");
    } else {
      message.error(result?.error?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card
        title={<Title level={3}>Tạo tài khoản mới</Title>}
        style={{ width: 400 }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="********" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="password_confirmation"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="********" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>

          <Text>
            Đã có tài khoản? <a onClick={() => navigate("/login")}>Đăng nhập</a>
          </Text>
        </Form>
      </Card>
    </div>
  );
};