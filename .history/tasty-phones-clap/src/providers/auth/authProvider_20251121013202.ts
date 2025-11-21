import { message } from "antd";
import {
  IAuthError,
  ILoginForm,
  IRegisterForm,
  IUser,
} from "../../interfaces/auth";

const API_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface AuthState {
  token: string;
  role: string;
  id: number;
  name: string;
  email: string;
}

export const authProvider = {
  // ======================
  // 🔐 LOGIN
  // ======================
  login: async ({ email, password }: ILoginForm) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ❌ Sai thông tin -> throw error để useLogin.onError xử lý
        throw new Error(data.message || "Email hoặc mật khẩu không đúng!");
      }

      // Xóa auth cũ
      localStorage.removeItem("auth");

      const token = data.token.startsWith("Bearer ")
        ? data.token
        : `Bearer ${data.token}`;

      const authState: AuthState = {
        ...data.user,
        token,
      };
      localStorage.setItem("auth", JSON.stringify(authState));

      // Redirect theo role
      const role = data.user.role;
      let redirectTo = "/";
      if (role === "admin") redirectTo = "/admin/dashboard";
      if (role === "client") redirectTo = "/client";

      message.success("Đăng nhập thành công!");

      return { success: true, redirectTo };
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại!");
      // Throw để useLogin.onError bắt
      throw error;
    }
  },

  // ======================
  // 🔓 LOGOUT
  // ======================
  logout: async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (auth) {
        const { token } = JSON.parse(auth) as AuthState;

        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        });
      }
    } catch (_) {}

    localStorage.removeItem("auth");
    message.success("Đăng xuất thành công!");
    return { success: true, redirectTo: "/login" };
  },

  // ======================
  // 🔓 REGISTER
  // ======================
  register: async ({
    name,
    email,
    password,
    password_confirmation,
  }: IRegisterForm) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Lấy thông báo từ backend
        let errorMessage = "Đăng ký thất bại!";

        // Nếu backend trả lỗi validation email
        if (data.errors?.email?.[0]) {
          errorMessage = "Email này đã được đăng ký!";
        } else if (data.message) {
          errorMessage = data.message;
        }

        // Hiển thị thông báo cho user
        message.error(errorMessage);

        throw new Error(errorMessage);
      }

      const token = data.token.startsWith("Bearer ")
        ? data.token
        : `Bearer ${data.token}`;

      const authState: AuthState = {
        ...data.user,
        token,
      };
      localStorage.setItem("auth", JSON.stringify(authState));

      const role = data.user.role;
      let redirectTo = "/";
      if (role === "admin") redirectTo = "/admin/dashboard";
      if (role === "client") redirectTo = "/client";

      message.success("Đăng ký thành công!");
      return { success: true, redirectTo };
    } catch (error: any) {
      // Đảm bảo mọi lỗi đều show
      if (!error.message) message.error("Đăng ký thất bại!");
      throw error;
    }
  },

  // ======================
  // 🧩 CHECK (bảo vệ route)
  // ======================
  check: async () => {
    const auth = localStorage.getItem("auth");

    if (!auth) {
      message.warning("Vui lòng đăng nhập để tiếp tục!");
      return { authenticated: false, redirectTo: "/login" };
    }

    try {
      const { role } = JSON.parse(auth) as AuthState;

      if (window.location.pathname.startsWith("/admin") && role !== "admin") {
        message.warning("Bạn không có quyền truy cập trang quản trị!");
        return { authenticated: false, redirectTo: "/client" };
      }

      return { authenticated: true };
    } catch {
      localStorage.removeItem("auth");
      message.error("Phiên đăng nhập không hợp lệ!");
      return { authenticated: false, redirectTo: "/login" };
    }
  },

  // ======================
  // 👤 GET IDENTITY
  // ======================
  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;

    try {
      const data = JSON.parse(auth) as AuthState;
      return data as IUser;
    } catch {
      localStorage.removeItem("auth");
      return null;
    }
  },
  // ======================
  // 🔄 FORGOT PASSWORD
  // ======================
  // ======================
  // 🔄 FORGOT PASSWORD
  // ======================
  forgotPassword: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể reset mật khẩu!");
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error: any) {
      throw new Error(error.message || "Có lỗi xảy ra!");
    }
  },

  // ======================
  // 🔁 RESET PASSWORD (Laravel không cần token, chỉ cần email)
  // ======================
  resetPassword: async ({ email, password }: any) => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể đặt lại mật khẩu!");
      }

      message.success("Đặt lại mật khẩu thành công!");
      return { success: true, redirectTo: "/login" };
    } catch (error: any) {
      message.error(error.message || "Lỗi đặt lại mật khẩu!");
      throw error;
    }
  },
  // ======================
  // ⚠️ ON ERROR
  // ======================
  onError: async (error: IAuthError) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("auth");
      message.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      return { logout: true, redirectTo: "/login" };
    }

    return { error };
  },
};
