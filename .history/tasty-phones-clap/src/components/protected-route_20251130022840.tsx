// src/components/protected-route.tsx
import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedProps) => {
  const location = useLocation();
  const auth = localStorage.getItem("auth");

  // Debug: log ra để kiểm tra
  console.log("🔐 ProtectedRoute Debug:");
  console.log("Auth from localStorage:", auth);
  console.log("Allowed roles:", allowedRoles);

  // ❌ Chưa đăng nhập → Đẩy về login
  if (!auth) {
    console.log("❌ No auth found, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const user = JSON.parse(auth);
    console.log("Parsed user:", user);

    // Lấy role từ user object - kiểm tra cả user.role và user.data.role
    const userRole = user.role || (user.data && user.data.role);
    console.log("User role:", userRole);

    if (!userRole) {
      console.log("❌ No role found in user data");
      localStorage.removeItem("auth");
      return <Navigate to="/login" replace />;
    }

    // ✅ Nếu không yêu cầu role cụ thể → cho phép truy cập
    if (allowedRoles.length === 0) {
      console.log("✅ No role restriction, allowing access");
      return children;
    }

    // ❌ Nếu user không có role phù hợp
    if (!allowedRoles.includes(userRole)) {
      console.log(`❌ Role ${userRole} not in allowed roles: ${allowedRoles}`);

      // Redirect based on user role
      if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      if (userRole === "customer") {
        return <Navigate to="/client" replace />;
      }
      // Default fallback
      return <Navigate to="/login" replace />;
    }

    // ✅ Hợp lệ → render trang
    console.log("✅ Access granted");
    return children;
  } catch (error) {
    console.error("❌ Error parsing auth data:", error);
    localStorage.removeItem("auth");
    return <Navigate to="/login" replace />;
  }
};
