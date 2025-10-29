import { AuthProvider } from "@refinedev/core";
import { AuthResponse, User } from "../../types";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        localStorage.setItem("auth", JSON.stringify(data));

        return {
          success: true,
          redirectTo: data.user.role === "admin" ? "/admin" : "/client",
        };
      }

      return {
        success: false,
        error: { message: "Login failed", name: "Invalid credentials" },
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Network error", name: "Login failed" },
      };
    }
  },

  logout: async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth");
      return { success: true, redirectTo: "/login" };
    }
  },

  check: async () => {
    const auth = getAuthData();
    return auth
      ? { authenticated: true }
      : { authenticated: false, redirectTo: "/login", logout: true };
  },

  getIdentity: async () => {
    const auth = getAuthData();
    return auth?.user || null;
  },

  onError: async (error) => {
    if (error?.status === 401) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },

  getPermissions: async () => {
    const auth = getAuthData();
    return auth?.user.role || null;
  },
};

// Helper functions
const getAuthData = (): AuthResponse | null => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

const getToken = (): string => {
  const auth = getAuthData();
  return auth?.token || "";
};
