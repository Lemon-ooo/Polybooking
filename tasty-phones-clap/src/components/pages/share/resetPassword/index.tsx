import React from "react";
import { AuthPage } from "@refinedev/antd";
import { Form, Input, Button } from "antd";

const STATIC_EMAIL = "test@gmail.com";

export const ResetPassword = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Submitted values:", values);
    // TODO: Gọi API update password ở đây
  };

  return (
    <AuthPage
      type="updatePassword"
      loginLink={false}
      forgotPasswordLink={false}
      registerLink={false}
      title={false}
      wrapperProps={{
        style: {
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      renderContent={() => (
        <div
          style={{
            width: "420px",
            maxWidth: "95%",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", padding: "40px 40px 20px 40px" }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#333",
                margin: "0 0 4px 0",
              }}
            >
              Reset your password
            </h1>
            <p style={{ color: "#666", fontSize: 16, margin: 0 }}>
              for{" "}
              <strong style={{ color: "#007bff", fontWeight: 600 }}>
                {STATIC_EMAIL}
              </strong>
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: "0 40px 40px 40px" }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your new password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  style={{ color: "#000" }}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ height: 40, fontWeight: "bold" }}
                >
                  SAVE
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    />
  );
};
