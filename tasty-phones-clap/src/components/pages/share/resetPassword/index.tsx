import { AuthPage } from "@refinedev/antd";
import React from "react";

export const ResetPassword = () => {
  return (
    <AuthPage
      type="resetPassword"
      loginLink={true}
      title={
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}> Polybooking</h1>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>Đặt lại mật khẩu</p>
        </div>
      }
      formProps={{
        defaultValues: {
          password: "",
          confirmPassword: "",
        },
      }}
      renderContent={(content: React.ReactNode, title: React.ReactNode) => {
        return (
          <div>
            {title}
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <p style={{ color: "#666" }}>
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>
            {content}
          </div>
        );
      }}
    />
  );
};
