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
        <Routes>
          {/* Các route public KHÔNG có layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Các route có layout */}
          <Route
            path="/*"
            element={
              <LayoutWrapper>
                <Routes>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/client" element={<ClientDashboard />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />
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
