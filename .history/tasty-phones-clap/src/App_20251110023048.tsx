import React from "react";
import { Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { authProvider, dataProvider, accessControlProvider } from "./providers";

import { PublicLayout } from "./components/layout/PublicLayout";
import { ClientLayout } from "./components/layout/ClientLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import { ProtectedRoute } from "./components/protected-route";

import { HomePage } from "./components/pages/share/homePage";
import AllRooms from "./components/pages/share/rooms/rooms";
import RoomDetails from "./components/pages/share/rooms/roomDetails";
import AllServices from "./components/pages/share/services/services";
import ServiceDetails from "./components/pages/share/services/serviceDetails";
import { Login } from "./components/pages/share/login";
import { Register } from "./components/pages/share/register";

import { ClientDashboard } from "./components/pages/client/dashboard";
import { ClientRooms } from "./components/pages/client/rooms";
import { ClientServices } from "./components/pages/client/services";
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { RoomList } from "./components/pages/admin/rooms/list";
import { ClientGallery } from "./components/pages/client/Gallery";

export default function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        accessControlProvider={accessControlProvider}
        notificationProvider={useNotificationProvider()}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          {/* 🚀 Public routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<AllRooms />} />
            <Route path="rooms/:id" element={<RoomDetails />} />
            <Route path="services" element={<AllServices />} />
            <Route path="services/:id" element={<ServiceDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* 🚀 Client routes (bảo vệ bằng ProtectedRoute) */}
          <Route
            element={
              <ProtectedRoute>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="client" element={<ClientDashboard />} />
            <Route path="client/rooms" element={<ClientRooms />} />
            <Route path="client/rooms/:id" element={<RoomDetails />} />
            <Route path="client/services" element={<ClientServices />} />
            <Route path="client/services/:id" element={<ServiceDetails />} />
            <Route path="client/galleries" element={<ClientGallery />} />
          </Route>

          {/* 🚀 Admin routes (bảo vệ bằng ProtectedRoute) */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="rooms" element={<RoomList />} />
          </Route>

          {/* 🚀 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
