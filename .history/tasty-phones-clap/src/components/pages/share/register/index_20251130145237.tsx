import React from "react";
import { Form, Input, Button, Card, Typography, message, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../../../../providers/auth/authProvider";
import "./Register.css";

const { Title, Text } = Typography;
const { Content } = Layout;

interface IRegisterForm {
  user_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: IRegisterForm) => {
    if (!authProvider.register) {
      message.error("Chức năng đăng ký chưa được cấu hình.");
      return;
    }

    try {
      const payload = {
        user_name: values.user_name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      const result = await authProvider.register(payload);

      if (result?.success) {
        message.success("Đăng ký thành công!");
        navigate(result.redirectTo || "/client");
      }
    } catch (error: any) {
      const errors = error?.response?.errors || error?.errors;
      if (errors) {
        Object.keys(errors).forEach((field) => {
          form.setFields([
            {
              name: field as keyof IRegisterForm,
              errors: errors[field],
            },
          ]);
        });
      } else {
        message.error(error?.message || "Đăng ký thất bại");
      }
    }
  };

  return (
    <Layout className="register-container">
      <Content className="register-content">
        <Card className="register-card">
          <Title level={2} className="register-title">
            Tạo tài khoản mới
          </Title>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            className="register-form"
          >
            <Form.Item
              label="Họ và tên"
              name="user_name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input
                placeholder="Nhập họ và tên"
                className="register-input"
                style={{
                  background: "#fff",
                  color: "#000",
                  borderRadius: "6px",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                placeholder="example@email.com"
                className="register-input"
                style={{
                  background: "#fff",
                  color: "#000",
                  borderRadius: "6px",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password
                placeholder="********"
                className="register-input"
              />
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
              <Input.Password
                placeholder="********"
                className="register-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="register-button"
              >
                Đăng ký
              </Button>
            </Form.Item>

            <div className="register-link">
              <Text>
                Đã có tài khoản?{" "}
                <a onClick={() => navigate("/login")}>Đăng nhập</a>
              </Text>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};
