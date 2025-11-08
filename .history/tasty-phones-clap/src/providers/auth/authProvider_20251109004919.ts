import { message } from "antd";
import { IAuthError, ILoginForm, IUser } from "../../interfaces/auth";

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
        // ❌ Sai thông tin -> chỉ hiển thị lỗi, không redirect
        message.error(data.message || "Email hoặc mật khẩu không đúng!");
        return {
          success: false,
          error: {
            name: "Login Error",
            message: data.message || "Email hoặc mật khẩu không đúng",
          } as IAuthError,
        };
      }

      // Xóa auth cũ
      localStorage.removeItem("auth");

      // Chuẩn hoá token
      const token = data.token.startsWith("Bearer ")
        ? data.token
        : `Bearer ${data.token}`;

      // Lưu auth mới
      const authState: AuthState = {
        ...data.user,
        token,
      };
      localStorage.setItem("auth", JSON.stringify(authState));

      // 🎯 Redirect theo role
      const role = data.user.role;
      let redirectTo = "/";

      if (role === "admin") redirectTo = "/admin/dashboard";
      if (role === "client") redirectTo = "/client";

      // ✅ Thông báo thành công
      message.success("Đăng nhập thành công!");

      return {
        success: true,
        redirectTo,
      };
    } catch (error: any) {
      message.error("Đã có lỗi xảy ra khi đăng nhập!");
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Đã có lỗi xảy ra",
        } as IAuthError,
      };
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

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  // ======================
  // 🧩 CHECK (bảo vệ route)
  // ======================
  check: async () => {
    const auth = localStorage.getItem("auth");

    if (!auth) {
      message.warning("Vui lòng đăng nhập để tiếp tục!");
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      const { role } = JSON.parse(auth) as AuthState;

      if (window.location.pathname.startsWith("/admin") && role !== "admin") {
        message.warning("Bạn không có quyền truy cập trang quản trị!");
        return {
          authenticated: false,
          redirectTo: "/client",
        };
      }

      return { authenticated: true };
    } catch {
      localStorage.removeItem("auth");
      message.error("Phiên đăng nhập không hợp lệ!");
      return {
        authenticated: false,
        redirectTo: "/login",
      };
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
  // ⚠️ ON ERROR
  // ======================
  onError: async (error: IAuthError) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("auth");
      message.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    return { error };
  },
};
