import { AuthProvider } from "@refinedev/core";

const API_URL = "http://localhost:8000/api";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect dựa trên role
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
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Lỗi kết nối máy chủ",
          name: "Network Error",
        },
      };
    }
  },

  logout: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return { authenticated: true };
      } else {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
    } catch {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      };
    }
    return null;
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        redirectTo: "/login",
        logout: true,
      };
    }
    return { error };
  },

  getPermissions: async () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
    return null;
  },
};
