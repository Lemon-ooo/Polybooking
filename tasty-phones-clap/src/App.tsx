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
import { Login } from "./components/pages/share/login";
import { Register } from "./components/pages/share/register";

import { ClientDashboard } from "./components/pages/client/dashboard";
import { ClientRooms } from "./components/pages/client/rooms";
import { ClientServices } from "./components/pages/client/services";  
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { RoomList } from "./components/pages/admin/rooms/list";
import { ServiceList } from "./components/pages/admin/services/list";
// ⚠️ Thêm import mới cho trang chi tiết dịch vụ của client
import { ClientGallery } from "./components/pages/client/Gallery";
import { RoomDetail } from "./components/pages/client/rooms/roomDetail";
import ServicesDetail from "./components/pages/client/services/ServicesDetail";
import Services from './../client/src/pages/Services';
import { ServicesCreate } from "./components/pages/admin/services/create";
import { ServicesEdit } from "./components/pages/admin/services/edit";
import { RoomCreate } from "./components/pages/admin/rooms/create";


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

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* 🚀 Client routes */}
          <Route
            element={
              <ProtectedRoute>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="client" element={<ClientDashboard />} />
            <Route path="client/rooms" element={<ClientRooms />} />
            <Route path="client/rooms/:id" element={<RoomDetail />} />
            <Route path="client/services" element={<ClientServices />} />

            {/* ⚙️ Sửa ở đây: dùng ServicesDetail.tsx (mới) */}
            <Route path="client/services/:id" element={<ServicesDetail />} />
            <Route path="client/galleries" element={<ClientGallery />} />
          </Route>

      {/* 🚀 Admin routes */}
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
  <Route path="rooms/create" element={<RoomCreate />} />
  <Route path="services" element={<ServiceList />} />
  <Route path="services/create" element={<ServicesCreate />} />
  <Route path="services/edit/:id" element={<ServicesEdit />} />

</Route>


          {/* 🚀 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
