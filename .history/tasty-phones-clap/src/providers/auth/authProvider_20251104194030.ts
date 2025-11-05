import { AuthProvider } from "@refinedev/core";
import { LoginRequest, LoginResponse, User } from "../../interfaces"; // ✅ Import interfaces

const API_URL = "http://localhost:8000/api";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: LoginRequest) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // ✅ Check HTTP status trước
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect dựa trên role
        if (data.user.role === "admin") {
          return {
            success: true,
            redirectTo: "/admin",
          };
        } else {
          return {
            success: true,
            redirectTo: "/client",
          };
        }
      } else {
        return {
          success: false,
          error: {
            message: data.message || "Đăng nhập thất bại",
            name: "Login Error",
          },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || "Lỗi kết nối máy chủ",
          name: "Network Error",
        },
      };
    }
  },

  logout: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Logout API error:", error);
        // Vẫn tiếp tục xóa token client-side dù API fail
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async (ctx) => {
    // ✅ Refine v5 có context parameter
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true, // ✅ Thêm logout: true để clear mọi thứ
      };
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return {
          authenticated: true,
        };
      } else {
        // Token không hợp lệ
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return {
          authenticated: false,
          redirectTo: "/login",
          logout: true,
        };
      }
    } catch (error) {
      // Lỗi mạng, vẫn giữ token và cho là authenticated
      // Hoặc có thể return false tùy use case
      return {
        authenticated: true, // ✅ Giả sử vẫn authenticated nếu lỗi mạng
      };
    }
  },

  onError: async (error) => {
    console.error("Auth error:", error);

    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    return {};
  },

  getIdentity: async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user: User = JSON.parse(userStr);
        return {
          id: user.id,
          name: user.name,
          // ✅ Avatar có thể không có trong database của bạn
          avatar: undefined,
          role: user.role,
        };
      }
      return null;
    } catch (error) {
      console.error("Get identity error:", error);
      return null;
    }
  },

  getPermissions: async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user: User = JSON.parse(userStr);
        return user.role;
      }
      return null;
    } catch (error) {
      console.error("Get permissions error:", error);
      return null;
    }
  },

  // ✅ Refine v5 yêu cầu các method mới
  register: async (params) => {
    // Có thể implement sau
    return { success: false };
  },

  forgotPassword: async (params) => {
    // Có thể implement sau
    return { success: false };
  },

  updatePassword: async (params) => {
    // Có thể implement sau
    return { success: false };
  },
};
