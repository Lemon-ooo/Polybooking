import React from "react";
import { Refine, useGetIdentity } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ Import icons
import { DashboardOutlined } from "@ant-design/icons";

// ✅ Import providers
import { authProvider, dataProvider, accessControlProvider } from "./providers";

// ✅ Import pages với layout
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

  // Nếu chưa đăng nhập, không hiển thị layout
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider}
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
          }}
          LoginComponent={Login}
        >
          {/* ✅ Wrap toàn bộ content với LayoutWrapper */}
          <LayoutWrapper>
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
          </LayoutWrapper>

          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
