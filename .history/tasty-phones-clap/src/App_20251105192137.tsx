import React from "react";
import { Refine, useGetIdentity } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";

import { authProvider, dataProvider, accessControlProvider } from "./providers";
import { Login } from "./components/pages/share/login";
import { Register } from "./components/pages/share/register";
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { ClientDashboard } from "./components/pages/client/dashboard";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: identity } = useGetIdentity();

  if (identity?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  } else if (identity?.role === "client") {
    return <ClientLayout>{children}</ClientLayout>;
  }

  // Nếu chưa xác định role (chưa đăng nhập)
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        accessControlProvider={accessControlProvider}
        notificationProvider={useNotificationProvider()}
        resources={[
          {
            name: "admin-dashboard",
            list: "/admin",
            meta: { label: "Dashboard", icon: <DashboardOutlined /> },
          },
          {
            name: "client-dashboard",
            list: "/",
            meta: { label: "Trang chủ", icon: <DashboardOutlined /> },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          {/* 🔓 Route công khai (không có layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Route riêng có layout */}
          <Route
            path="/*"
            element={
              <LayoutWrapper>
                <Routes>
                  {/* Admin */}
                  <Route path="/admin" element={<AdminDashboard />} />

                  {/* Client — path chính "/" */}
                  <Route path="/" element={<ClientDashboard />} />

                  {/* Mặc định điều hướng về "/" */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </LayoutWrapper>
            }
          />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
