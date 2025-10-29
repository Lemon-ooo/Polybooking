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

// ✅ Import providers
import { authProvider } from "./providers/auth/authProvider";
import { dataProvider } from "./providers/data/dataProvider";
import { accessControlProvider } from "./providers/accessControl/accessControlProvider";

// ✅ Import layouts
import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";

// ✅ Import components
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

// ✅ Import pages THEO CẤU TRÚC CỦA BẠN
import { Login } from "./pages/shared/login";
import { Register } from "./pages/shared/register";
import { ForgotPassword } from "./pages/shared/forgotPassword";

// ✅ Import admin pages
import { AdminDashboard } from "./pages/admin/dashboard";
import { RoomList } from "./pages/admin/rooms/list";
import { RoomCreate } from "./pages/admin/rooms/create";
import { RoomEdit } from "./pages/admin/rooms/edit";
import { RoomShow } from "./pages/admin/rooms/show";

// ✅ Import client pages
import { ClientDashboard } from "./pages/client/dashboard";
import { BookingList } from "./pages/client/bookings/list";
import { BookingCreate } from "./pages/client/bookings/create";
import { Profile } from "./pages/client/profile";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                resources={[
                  // ✅ Admin resources
                  {
                    name: "rooms",
                    list: "/admin/rooms",
                    create: "/admin/rooms/create",
                    edit: "/admin/rooms/edit/:id",
                    show: "/admin/rooms/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Quản lý phòng",
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
                    },
                  },
                  // ✅ Client resources
                  {
                    name: "bookings",
                    list: "/client/bookings",
                    create: "/client/bookings/create",
                    edit: "/client/bookings/edit/:id",
                    show: "/client/bookings/show/:id",
                    meta: {
                      canDelete: false,
                      label: "Lịch đặt phòng",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "ggtzZD-qaw1Qq-1NK7Ly",
                }}
              >
                <Routes>
                  {/* ✅ Public routes */}
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

                  {/* ✅ Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <Authenticated
                        key="admin-authenticated"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        {() => {
                          const user = authProvider.getIdentity?.();
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
                      <Route path="show/:id" element={<RoomShow />} />
                    </Route>
                    <Route path="users">
                      <Route index element={<div>User Management</div>} />
                    </Route>
                  </Route>

                  {/* ✅ Client routes */}
                  <Route
                    path="/client"
                    element={
                      <Authenticated
                        key="client-authenticated"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        {() => {
                          const user = authProvider.getIdentity?.();
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

                  {/* ✅ Default redirect */}
                  <Route
                    index
                    element={
                      <Authenticated
                        key="root-authenticated"
                        fallback={<Navigate to="/login" />}
                      >
                        {() => {
                          const user = authProvider.getIdentity?.();
                          return user?.role === "admin" ? (
                            <Navigate to="/admin" replace />
                          ) : (
                            <Navigate to="/client" replace />
                          );
                        }}
                      </Authenticated>
                    }
                  />

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
