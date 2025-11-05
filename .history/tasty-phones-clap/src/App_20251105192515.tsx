import React from "react";
import { Refine, useGetIdentity } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { DashboardOutlined } from "@ant-design/icons";
import { authProvider, dataProvider, accessControlProvider } from "./providers";
import { Login } from "./components/pages/share/login";
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { ClientDashboard } from "./components/pages/client/dashboard";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";
import { PublicLayout } from "./components/layout/PublicLayout"; // ✅ Import PublicLayout
import { HomePage } from "./components/pages/public/HomePage"; // ✅ Import HomePage

// ✅ Custom Layout Wrapper Component
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: identity } = useGetIdentity();

  if (identity?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  } else if (identity?.role === "client") {
    return <ClientLayout>{children}</ClientLayout>;
  }

  // Nếu chưa đăng nhập, hiển thị PublicLayout cho route "/"
  return <PublicLayout>{children}</PublicLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        accessControlProvider={accessControlProvider}
        notificationProvider={useNotificationProvider}
        resources={[
          {
            name: "admin-dashboard",
            list: "/admin",
            meta: {
              label: "Dashboard",
              icon: <DashboardOutlined />,
            },
          },
          {
            name: "client-dashboard",
            list: "/client",
            meta: {
              label: "Trang chủ",
              icon: <DashboardOutlined />,
            },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <LayoutWrapper>
          <Routes>
            {/* ✅ Public Route - Trang chủ */}
            <Route path="/" element={<HomePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Client Routes */}
            <Route path="/client" element={<ClientDashboard />} />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* ✅ Redirect mặc định đến trang chủ thay vì login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LayoutWrapper>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
