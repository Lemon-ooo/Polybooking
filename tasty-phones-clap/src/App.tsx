import React from "react";
import { Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  DashboardOutlined,
  HomeOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

import { authProvider, dataProvider, accessControlProvider } from "./providers";
import { Login } from "./components/pages/share/login";
import { Register } from "./components/pages/share/register"; // ✅ Thêm Register
import { HomePage } from "./components/pages/share/homePage";
import AllRooms from "./components/pages/share/rooms/rooms"; // ✅ Thêm AllRooms
import RoomDetails from "./components/pages/share/rooms/roomDetails"; // ✅ Thêm RoomDetails
import AllServices from "./components/pages/share/services/services"; // ✅ Thêm AllServices
import ServiceDetails from "./components/pages/share/services/serviceDetails"; // ✅ Thêm ServiceDetails
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { AdminLoginPage } from "./pages/admin/login";
import { ClientDashboard } from "./components/pages/client/dashboard";
import { ClientRooms } from "./components/pages/client/rooms"; // ✅ Thêm ClientRooms
import { ClientServices } from "./components/pages/client/services"; // ✅ Thêm ClientServices
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
          {
            name: "client-rooms",
            list: "/client/rooms",
            meta: { label: "Phòng", icon: <HomeOutlined /> },
          },
          {
            name: "client-services",
            list: "/client/services",
            meta: { label: "Dịch vụ", icon: <CustomerServiceOutlined /> },
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
          <Route
            path="/rooms"
            element={
              <PublicLayout>
                <AllRooms />
              </PublicLayout>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <PublicLayout>
                <RoomDetails />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <AllServices />
              </PublicLayout>
            }
          />
          <Route
            path="/services/:id"
            element={
              <PublicLayout>
                <ServiceDetails />
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
          <Route
            path="/client/rooms"
            element={
              <ClientLayout>
                <ClientRooms />
              </ClientLayout>
            }
          />
          <Route
            path="/client/rooms/:id"
            element={
              <ClientLayout>
                <RoomDetails />
              </ClientLayout>
            }
          />
          <Route
            path="/client/services"
            element={
              <ClientLayout>
                <ClientServices />
              </ClientLayout>
            }
          />
          <Route
            path="/client/services/:id"
            element={
              <ClientLayout>
                <ServiceDetails />
              </ClientLayout>
            }
          />

          {/* ✅ Admin routes */}
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  {/* Thêm các route admin khác ở đây */}
                </Routes>
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
