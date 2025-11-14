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

// ⚠️ Thêm import mới cho trang chi tiết dịch vụ của client
import { ClientGallery } from "./components/pages/client/Gallery";
import { RoomDetail } from "./components/pages/client/rooms/roomDetail";
import ServicesDetail from "./components/pages/client/services/ServicesDetail";
import { GalleryList } from "./components/pages/admin/Gallery/list";
import { GalleryCreate } from "./components/pages/admin/Gallery/create";
import { GalleryEdit } from "./components/pages/admin/Gallery/edit";
import { ClientEvent } from "./components/pages/client/events/ClientEvent";
import { EventList } from "./components/pages/admin/event/list";
import { EventCreate } from "./components/pages/admin/event/create";

import { GalleryShow } from "./components/pages/admin/Gallery/show";
import { EventShow } from "./components/pages/admin/event/show";
import { EventEdit } from "./components/pages/admin/event/edit";

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
            <Route path="client/gallery" element={<ClientGallery />} />
            <Route path="client/events" element={<ClientEvent />} />

            {/* ⚙️ Sửa ở đây: dùng ServicesDetail.tsx (mới) */}
            <Route path="client/services/:id" element={<ServicesDetail />} />
            <Route path="client/galleries" element={<ClientGallery />} />
            <Route path="client/events" element={<ClientEvent />} />
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
            {/* Gallery */}
            <Route path="gallery" element={<GalleryList />} />
            <Route path="gallery/create" element={<GalleryCreate />} />
            <Route path="gallery/edit/:id" element={<GalleryEdit />} />
            <Route path="gallery/show/:id" element={<GalleryShow />} />
            {/* Event */}
            <Route path="events" element={<EventList />} />
            <Route path="events/create" element={<EventCreate />} />

            <Route path="events/show/:id" element={<EventShow />} />
            <Route path="events/edit/:id" element={<EventEdit />} />
          </Route>

          {/* 🚀 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
