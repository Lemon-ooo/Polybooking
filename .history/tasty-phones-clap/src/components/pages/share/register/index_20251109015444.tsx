import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../../../../providers/auth/authProvider";

const { Title, Text } = Typography;

interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IRegisterForm>();

  const onFinish = async (values: IRegisterForm) => {
    if (!authProvider.register) {
      message.error("Chức năng đăng ký chưa được cấu hình.");
      return;
    }

    try {
      const result = await authProvider.register(values);

      if (result?.success) {
        message.success("Đăng ký thành công!");
        navigate(result.redirectTo || "/client");
      } else {
        // Nếu backend trả về lỗi email đã tồn tại
        const errorMessage =
          result?.error?.message || "Đăng ký thất bại. Vui lòng thử lại.";

        // Hiển thị thông báo ở input email
        if (errorMessage.toLowerCase().includes("email")) {
          form.setFields([
            {
              name: "email",
              errors: [errorMessage],
            },
          ]);
        } else {
          message.error(errorMessage);
        }
      }
    } catch (error: any) {
      message.error(error?.message || "Đăng ký thất bại");
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
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
            ]}
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
