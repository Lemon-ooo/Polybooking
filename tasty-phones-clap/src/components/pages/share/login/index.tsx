import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        defaultValues: {
          email: "admin@example.com",
          password: "admin",
        },
      }}
      rememberMe={true}
      registerLink={false}
      forgotPasswordLink={true}
      title={
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>🏨 Polybooking</h1>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>
            Đăng nhập vào hệ thống
          </p>
        </div>
      }
    />
  );
};
