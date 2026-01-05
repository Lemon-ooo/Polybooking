// src/components/protected-route.tsx - FIXED VERSION
import { JSX, useEffect, useState } from "react";
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
  const [isChecking, setIsChecking] = useState(true);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    userRole: string | null;
  }>({
    isAuthenticated: false,
    userRole: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("auth");
      console.log("🔐 ProtectedRoute - Checking auth...");

      if (!auth) {
        console.log("❌ No auth found");
        setAuthState({ isAuthenticated: false, userRole: null });
        setIsChecking(false);
        return;
      }

      try {
        const user = JSON.parse(auth);
        console.log("👤 User data:", user);

        const role = user.role;
        console.log("🎭 User role:", role);
        console.log("📋 Allowed roles:", allowedRoles);

        if (!role) {
          console.log("❌ No role found in user data");
          localStorage.removeItem("auth");
          setAuthState({ isAuthenticated: false, userRole: null });
          setIsChecking(false);
          return;
        }

        // 🚨 QUAN TRỌNG: Kiểm tra role ngay lập tức
        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
          console.log(`🚫 Role ${role} not in allowed roles: ${allowedRoles}`);
          setAuthState({ isAuthenticated: false, userRole: role });
        } else {
          console.log("✅ Role check passed");
          setAuthState({ isAuthenticated: true, userRole: role });
        }

        setIsChecking(false);
      } catch (error) {
        console.error("❌ Error parsing auth:", error);
        localStorage.removeItem("auth");
        setAuthState({ isAuthenticated: false, userRole: null });
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [allowedRoles, location.pathname]);

  // 🚨 Hiển thị loading trong khi check
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  // ❌ Chưa đăng nhập
  if (!authState.isAuthenticated && !authState.userRole) {
    console.log("🚫 Not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ❌ Đã đăng nhập nhưng role không phù hợp
  if (!authState.isAuthenticated && authState.userRole) {
    console.log(`🚫 Role ${authState.userRole} not allowed for this route`);

    // Redirect based on role
    if (authState.userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (authState.userRole === "customer") {
      return <Navigate to="/client" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  // ✅ Hợp lệ
  console.log("✅ Access granted for role:", authState.userRole);
  return children;
};
