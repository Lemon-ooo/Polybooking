import React from "react";
import { Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import { dataProvider } from "@refinedev/simple-rest";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter } from "react-router-dom";

import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";

// Import pages

import { ClientDashboard } from "./pages/client/dashboard";
import { ClientBookingsList } from "./pages/client/bookings/list";
import { ClientBookingsCreate } from "./pages/client/bookings/create";
import { ClientProfile } from "./pages/client/profile";
import { accessControlProvider, authProvider } from "./providers";
import { Login } from "./components/pages/share/login";
import { AdminDashboard } from "./components/pages/admin/dashboard";

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
                role: "admin", // Chỉ admin mới thấy
              },
            },
            {
              name: "rooms",
              list: "/admin/rooms",
              meta: {
                label: "Quản lý phòng",
                icon: <HomeOutlined />,
                role: "admin",
              },
            },
            // Client resources
            {
              name: "client-dashboard",
              list: "/client",
              meta: {
                label: "Trang chủ",
                icon: <DashboardOutlined />,
                role: "client",
              },
            },
            {
              name: "bookings",
              list: "/client/bookings",
              create: "/client/bookings/create",
              meta: {
                label: "Đặt phòng",
                icon: <BookOutlined />,
                role: "client",
              },
            },
            {
              name: "profile",
              list: "/client/profile",
              meta: {
                label: "Hồ sơ",
                icon: <UserOutlined />,
                role: "client",
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
          }}
          // Quan trọng: Layout dựa trên role
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
          {/* Routes */}
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<AdminRoomsList />} />

            {/* Client Routes */}
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/bookings" element={<ClientBookingsList />} />
            <Route
              path="/client/bookings/create"
              element={<ClientBookingsCreate />}
            />
            <Route path="/client/profile" element={<ClientProfile />} />

            {/* Default redirect */}
            <Route
              path="/"
              element={<NavigateToResource resource="client-dashboard" />}
            />
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
