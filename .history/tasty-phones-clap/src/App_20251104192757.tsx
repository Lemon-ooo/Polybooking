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

// ✅ Import providers theo cấu trúc của bạn
import { authProvider, dataProvider, accessControlProvider } from "./providers";

// ✅ Import pages
import { Login } from "./components/pages/share/login";
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { ClientDashboard } from "./components/pages/client/dashboard";

// ✅ Custom Layout Component cho Refine v5
const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: identity } = useGetIdentity();

  // Nếu chưa đăng nhập, hiển thị children không có layout
  if (!identity) {
    return <>{children}</>;
  }

  // Import layout động dựa trên role
  if (identity.role === "admin") {
    const AdminLayout = React.lazy(
      () => import("./components/layout/AdminLayout")
    );
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <AdminLayout>{children}</AdminLayout>
      </React.Suspense>
    );
  } else if (identity.role === "client") {
    const ClientLayout = React.lazy(
      () => import("./components/layout/ClientLayout")
    );
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <ClientLayout>{children}</ClientLayout>
      </React.Suspense>
    );
  }

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
          // ✅ Refine v5 không còn prop Layout, dùng custom layout trong routes
        >
          <CustomLayout>
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
          </CustomLayout>

          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
