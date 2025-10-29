import { AuthPage } from "@refinedev/antd";

export const Register = () => {
  return (
    <AuthPage
      type="register"
      loginLink={true}
      title={
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>🏨 Polybooking</h1>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>
            Đăng ký tài khoản mới
          </p>
        </div>
      }
      formProps={{
        defaultValues: {
          email: "",
          password: "",
        },
      }}
      renderContent={(content: React.ReactNode, title: React.ReactNode) => {
        return (
          <div>
            {title}
            {content}
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính
                sách bảo mật của chúng tôi.
              </p>
            </div>
          </div>
        );
      }}
    />
  );
};
