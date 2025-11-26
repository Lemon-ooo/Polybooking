import React from "react";
import { Refine } from "@refinedev/core";
import "../src/assets/fonts/fonts.css";
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
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { RoomList } from "./components/pages/admin/rooms/list";
import { ServiceList } from "./components/pages/admin/services/list";
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
import { ServicesCreate } from "./components/pages/admin/services/create";
import { RoomCreate } from "./components/pages/admin/rooms/create";
import { RoomEdit } from "./components/pages/admin/rooms/edit";

// ✅ Thêm import cho trang Tiện Ích (admin)
import Amenities from "./components/pages/admin/amenities";
import ServicesEdit from "./components/pages/admin/services/edit";
import ClientServices from "./components/pages/client/services/ClientServices";
import { ClientAbout } from "./components/pages/client/about";
import { ForgotPassword } from "./components/pages/share/forgotPassword";

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
            <Route path="forgot-password" element={<ForgotPassword />} />
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
            <Route path="client/services/:id" element={<ServicesDetail />} />
            <Route path="client/galleries" element={<ClientGallery />} />
            <Route path="client/events" element={<ClientEvent />} />
            <Route path="client/about" element={<ClientAbout />} />
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
            <Route path="rooms/create" element={<RoomCreate />} />
            {/* Services */}
            <Route path="services" element={<ServiceList />} />
            <Route path="services/create" element={<ServicesCreate />} />
            <Route path="services/edit/:id" element={<ServicesEdit />} />
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
            <Route path="rooms/edit/:id" element={<RoomEdit />} />
            <Route path="amenities" element={<Amenities />} />
          </Route>

          {/* 🚀 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
