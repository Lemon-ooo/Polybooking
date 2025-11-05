import React from "react";
import { Refine, useGetIdentity } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import { dataProvider } from "@refinedev/simple-rest";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ Import icons
import {
  DashboardOutlined,
  HomeOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";

// ✅ Import providers
import { accessControlProvider, authProvider } from "./providers";

// ✅ Import pages
import { Login } from "./components/pages/share/login";
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { ClientDashboard } from "./components/pages/client/dashboard";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider("http://localhost:8000/api")}
          authProvider={authProvider}
          accessControlProvider={accessControlProvider}
          notificationProvider={useNotificationProvider}
          routerProvider={routerBindings}
          resources={[
            // Admin resources
            {
              name: "admin-dashboard",
              list: "/admin",
              meta: {
                label: "Dashboard",
                icon: <DashboardOutlined />,
              },
            },
            // Client resources
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
            useNewQueryKeys: true,
          }}
          // ✅ Layout dựa trên role
          Layout={({ children }) => {
            const { data: identity } = useGetIdentity();

            if (identity?.role === "admin") {
              return <AdminLayout>{children}</AdminLayout>;
            } else if (identity?.role === "client") {
              return <ClientLayout>{children}</ClientLayout>;
            }

            // Nếu chưa đăng nhập, không hiển thị layout
            return <>{children}</>;
          }}
          LoginComponent={Login}
        >
          {/* ✅ Routes đơn giản */}
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Client Routes */}
            <Route path="/client" element={<ClientDashboard />} />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* ✅ Default redirect đến login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>

          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
