import { AuthPage } from "@refinedev/antd";

export const ForgotPassword = () => {
  return (
    <AuthPage
      type="forgotPassword"
      loginLink={true}
      title={
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>🏨 Polybooking</h1>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>Quên mật khẩu</p>
        </div>
      }
      formProps={{
        defaultValues: {
          email: "",
        },
      }}
      renderContent={(content: React.ReactNode, title: React.ReactNode) => {
        return (
          <div>
            {title}
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <p style={{ color: "#666" }}>
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu
              </p>
            </div>
            {content}
          </div>
        );
      }}
    />
  );
};
