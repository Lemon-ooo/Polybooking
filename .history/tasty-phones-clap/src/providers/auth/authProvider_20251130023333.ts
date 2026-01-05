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

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Email hoặc mật khẩu không đúng!");
      }

      const apiData = res.data;

      if (!apiData?.token) {
        throw new Error("Backend không trả về token!");
      }

      const token =
        apiData.token_type === "Bearer"
          ? `Bearer ${apiData.token}`
          : apiData.token;

      localStorage.removeItem("auth");

      const authState: AuthState = {
        ...apiData.user,
        token,
      };

      localStorage.setItem("auth", JSON.stringify(authState));

      const role = apiData.user.role;
      let redirectTo = "/";

      if (role === "admin") redirectTo = "/admin/dashboard";
      if (role === "customer") redirectTo = "/client"; // sửa luôn role

      message.success("Đăng nhập thành công!");

      return { success: true, redirectTo };
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại!");
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
    user_name,
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
        body: JSON.stringify({
          user_name, // Sửa thành user_name thay vì name
          email,
          password,
          password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Backend validation errors:", data); // Debug log

        let errorMessage = "Đăng ký thất bại!";
        let backendErrors: any = {};

        // Xử lý lỗi validation từ Laravel
        if (data.errors) {
          backendErrors = data.errors;

          // Lấy thông báo lỗi đầu tiên để hiển thị
          const firstErrorKey = Object.keys(data.errors)[0];
          if (firstErrorKey && data.errors[firstErrorKey]?.[0]) {
            errorMessage = data.errors[firstErrorKey][0];
          }
        } else if (data.message) {
          errorMessage = data.message;
        }

        const error = new Error(errorMessage);
        (error as any).errors = backendErrors;
        (error as any).response = { errors: backendErrors };

        throw error;
      }

      // Xử lý thành công
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (!token) {
        throw new Error("Không nhận được token từ server");
      }

      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      const authState: AuthState = {
        ...user,
        token: formattedToken,
      };

      localStorage.setItem("auth", JSON.stringify(authState));

      // Điều hướng dựa trên role
      const role = user?.role || "customer";
      let redirectTo = "/";
      if (role === "admin") redirectTo = "/admin/dashboard";
      if (role === "customer" || role === "client") redirectTo = "/client";

      return { success: true, redirectTo };
    } catch (error: any) {
      console.error("Register error:", error);
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
  // 👤 GET IDENTITY (LẤY PROFILE TỪ BACKEND)
  // ======================
  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;

    try {
      const { token } = JSON.parse(auth);

      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể lấy profile");
      }

      // data trả về có thể là:
      // { data: { ...user } }
      // hoặc { user: { ...user } }
      // hoặc { ...user }
      const user = data.data || data.user || data;

      // Cập nhật lại localStorage nếu BE trả user mới
      const authState = JSON.parse(auth);
      localStorage.setItem("auth", JSON.stringify({ ...authState, ...user }));

      return user;
    } catch {
      localStorage.removeItem("auth");
      return null;
    }
  },
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

      // BE đã gửi email kèm mật khẩu mới → FE chỉ hiển thị message
      message.success("Mật khẩu mới đã được gửi qua email!");

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra!");
      throw error;
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
