// src/components/protected-route.tsx
import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedProps {
  children: JSX.Element;
  role?: "admin" | "customer";
}

export const ProtectedRoute = ({ children, role }: ProtectedProps) => {
  const location = useLocation();
  const auth = localStorage.getItem("auth");

  // ❌ Chưa đăng nhập → Đẩy về login
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(auth);
  const userRole = user.role;

  // ❌ Nếu yêu cầu role nhưng user không có role đó
  if (role && role !== userRole) {
    // Nếu user là admin → đẩy về admin dashboard
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Nếu user là customer → đẩy về client
    if (userRole === "customer") {
      return <Navigate to="/client" replace />;
    }
  }

  // Nếu hợp lệ → render trang
  return children;
};
