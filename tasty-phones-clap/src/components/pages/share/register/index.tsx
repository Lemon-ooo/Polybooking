import React from "react";
import { Form, Input, Button, Card, Typography, message, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../../../../providers/auth/authProvider";
import "./Register.css";

const { Title, Text } = Typography;

interface IRegisterForm {
  user_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IRegisterForm>();

  const onFinish = async (values: IRegisterForm) => {
    if (!authProvider.register) {
      message.error("Registration feature is not configured.");
      return;
    }

    try {
      const result = await authProvider.register(values);

      if (result?.success) {
        message.success("Registration successful!");
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
        message.error(error?.message || "Registration failed");
      }
    }
  };

  return (
    <Layout className="register-layout">
      <div className="register-hero">
        {/* TEXT LEFT */}
        <div className="register-overlay-text">
          <h1>Join PolyStay</h1>
          <p>
            Create an account to receive exclusive offers and experience
            world-class resort services.
          </p>
        </div>

        {/* REGISTER CARD */}
        <Card className="register-card">
          <Title level={2} className="register-title">
            Create Account
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Full Name"
              name="user_name"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input size="large" placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Invalid email address" },
              ]}
            >
              <Input size="large" placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password size="large" placeholder="********" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="password_confirmation"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="********" />
            </Form.Item>

            <Button
              htmlType="submit"
              block
              size="large"
              className="register-button"
            >
              REGISTER
            </Button>

            <div className="register-link">
              <Text>
                Already have an account?{" "}
                <a onClick={() => navigate("/login")}>Login</a>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};
