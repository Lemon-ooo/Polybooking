import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Form, Input, Button, Card, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";

export const Login: React.FC = () => {
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const onFinish = (values: any) => {
    setError("");

    login(values, {
      onSuccess: () => {
        const auth = localStorage.getItem("auth");

        let redirectTo = "/";
        if (auth) {
          const user = JSON.parse(auth);
          if (user.role === "admin") redirectTo = "/admin";
          else if (user.role === "customer") redirectTo = "/client";
        }

        navigate(redirectTo, { replace: true });
      },
      onError: (error: any) => {
        setError(
          error?.response?.data?.message ||
            "Incorrect email or password!"
        );
      },
    });
  };

  return (
    <Layout className="login-layout">
      <div className="login-hero">
        {/* TEXT */}
        <div className="login-overlay-text">
          <h1>Experience luxury travel at</h1>
          <h2>PolyStay</h2>
          <p>
            Enjoy exclusive benefits and earn reward points when you register as
            a member
          </p>
        </div>

        {/* CARD */}
        <Card className="login-card">
          <div className="logo-wrapper">
            <img
              src="https://ruedelamourhotel.com/wp-content/uploads/2024/08/Logo-01.png"
              alt="logo"
              className="logo"
            />
          </div>

          <h2 className="login-title">Login</h2>
          <div className="login-divider" />

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
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember account
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <Button
              htmlType="submit"
              className="login-button"
              loading={isPending}
              block
            >
              LOGIN
            </Button>

            {/* REGISTER LINK */}
            <div className="login-register">
              Don’t have an account?{" "}
              <Link to="/register" className="register-link">
                Register now
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};
