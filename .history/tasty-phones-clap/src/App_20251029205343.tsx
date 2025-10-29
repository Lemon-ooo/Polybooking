import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayout,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// ✅ Import providers đã được tổ chức lại
import { authProvider } from "./providers/auth/authProvider";
import { dataProvider } from "./providers/data/dataProvider";
import { accessControlProvider } from "./providers/accessControl/accessControlProvider";

// ✅ Import layouts
import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";

// ✅ Import components
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

// ✅ Import pages
import { Login } from "./components/pages/share/login";
import { Register } from "./components/pages/share/register";
import { ForgotPassword } from "./components/pages/share/forgotPassword";

// ✅ Import admin pages
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { RoomList } from "./components/pages/admin/rooms/list";
import { RoomCreate } from "./components/pages/admin/rooms/create";
import { RoomEdit } from "./components/pages/admin/rooms/edit";

// ✅ Import client pages
import { ClientDashboard } from "./components/pages/client/dashboard";
import { BookingList } from "./components/pages/client/bookings/list";
import { BookingCreate } from "./components/pages/client/bookings/create";
import { Profile } from "./components/pages/client/profile";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                // ✅ Sử dụng providers đã được tổ chức
                dataProvider={dataProvider}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                resources={[
                  // ✅ Admin resources - chỉ hiển thị khi user là admin
                  {
                    name: "rooms",
                    list: "/admin/rooms",
                    create: "/admin/rooms/create",
                    edit: "/admin/rooms/edit/:id",
                    show: "/admin/rooms/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Quản lý phòng",
                      icon: "🏨", // Icon cho menu
                    },
                  },
                  {
                    name: "users",
                    list: "/admin/users",
                    create: "/admin/users/create",
                    edit: "/admin/users/edit/:id",
                    show: "/admin/users/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Quản lý người dùng",
                      icon: "👥",
                    },
                  },
                  // ✅ Client resources - chỉ hiển thị khi user là client
                  {
                    name: "bookings",
                    list: "/client/bookings",
                    create: "/client/bookings/create",
                    edit: "/client/bookings/edit/:id",
                    show: "/client/bookings/show/:id",
                    meta: {
                      canDelete: false,
                      label: "Lịch đặt phòng",
                      icon: "📅",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "ggtzZD-qaw1Qq-1NK7Ly",
                }}
              >
                <Routes>
                  {/* ✅ Public routes - không cần đăng nhập */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>

                  {/* ✅ Admin routes - chỉ cho user có role admin */}
                  <Route
                    path="/admin"
                    element={
                      <Authenticated
                        key="admin-authenticated"
                        fallback={<CatchAllNavigate to="/login" />}
                        v3LegacyAuthProviderCompatible={true}
                      >
                        {(params) => {
                          const { user } = params || {};
                          // ✅ Kiểm tra role admin
                          if (user?.role !== "admin") {
                            return <Navigate to="/client" replace />;
                          }
                          return (
                            <AdminLayout>
                              <Outlet />
                            </AdminLayout>
                          );
                        }}
                      </Authenticated>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="rooms">
                      <Route index element={<RoomList />} />
                      <Route path="create" element={<RoomCreate />} />
                      <Route path="edit/:id" element={<RoomEdit />} />
                    </Route>
                    <Route path="users">
                      <Route
                        index
                        element={<div>User Management - Coming Soon</div>}
                      />
                    </Route>
                  </Route>

                  {/* ✅ Client routes - cho user có role client */}
                  <Route
                    path="/client"
                    element={
                      <Authenticated
                        key="client-authenticated"
                        fallback={<CatchAllNavigate to="/login" />}
                        v3LegacyAuthProviderCompatible={true}
                      >
                        {(params) => {
                          const { user } = params || {};
                          // ✅ Kiểm tra role client
                          if (user?.role !== "client") {
                            return <Navigate to="/admin" replace />;
                          }
                          return (
                            <ClientLayout>
                              <Outlet />
                            </ClientLayout>
                          );
                        }}
                      </Authenticated>
                    }
                  >
                    <Route index element={<ClientDashboard />} />
                    <Route path="bookings">
                      <Route index element={<BookingList />} />
                      <Route path="create" element={<BookingCreate />} />
                    </Route>
                    <Route path="profile" element={<Profile />} />
                  </Route>

                  {/* ✅ Default redirect - dựa vào role sau khi login */}
                  <Route
                    index
                    element={
                      <Authenticated
                        key="root-authenticated"
                        fallback={<Navigate to="/login" />}
                      >
                        {(params) => {
                          const { user } = params || {};
                          return user?.role === "admin" ? (
                            <Navigate to="/admin" replace />
                          ) : (
                            <Navigate to="/client" replace />
                          );
                        }}
                      </Authenticated>
                    }
                  />

                  {/* ✅ 404 page */}
                  <Route path="*" element={<ErrorComponent />} />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
