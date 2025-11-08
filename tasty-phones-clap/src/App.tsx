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
import { Register } from "./components/pages/share/register";
import { HomePage } from "./components/pages/share/homePage";
import AllRooms from "./components/pages/share/rooms/rooms";
import RoomDetails from "./components/pages/share/rooms/roomDetails";
import AllServices from "./components/pages/share/services/services";
import ServiceDetails from "./components/pages/share/services/serviceDetails";

import { AdminDashboard } from "./components/pages/admin/dashboard";
import { ClientDashboard } from "./components/pages/client/dashboard";
import { ClientRooms } from "./components/pages/client/rooms";
import { ClientServices } from "./components/pages/client/services";

import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";
import { PublicLayout } from "./components/layout/PublicLayout";

import { ProtectedRoute } from "./components/protected-route"; // ✅ Bảo vệ route


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

          {/* 🚀 Public routes */}
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


          {/* 🚀 Client routes – bảo vệ bằng ProtectedRoute */}
          <Route
            path="/client"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <ClientDashboard />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/rooms"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <ClientRooms />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/rooms/:id"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <RoomDetails />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/services"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <ClientServices />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/services/:id"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <ServiceDetails />
                </ClientLayout>
              </ProtectedRoute>
            }
          />


          {/* 🚀 Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />


          {/* 🚀 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
