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

// ✅ Custom Layout Wrapper Component
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: identity } = useGetIdentity();

  if (identity?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  } else if (identity?.role === "client") {
    return <ClientLayout>{children}</ClientLayout>;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        accessControlProvider={accessControlProvider}
        notificationProvider={useNotificationProvider}
        // ❌ REMOVE routerProvider - tạm thời không dùng
        // routerProvider={routerBindings}
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </LayoutWrapper>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
