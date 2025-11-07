import React from "react";
import { Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";

import { authProvider, dataProvider, accessControlProvider } from "./providers";
import { Login } from "./components/pages/share/login";
import { Register } from "./components/pages/share/register"; // ✅ Thêm Register
import { HomePage } from "./components/pages/share/homePage";
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { ClientDashboard } from "./components/pages/client/dashboard";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";
import { PublicLayout } from "./components/layout/PublicLayout";

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
            list: "/client",
            meta: { label: "Trang chủ", icon: <DashboardOutlined /> },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          {/* ✅ Public routes (không yêu cầu đăng nhập) */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Client routes */}
          <Route
            path="/client"
            element={
              <ClientLayout>
                <ClientDashboard />
              </ClientLayout>
            }
          />

          {/* ✅ Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />

          {/* ✅ Redirect fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
