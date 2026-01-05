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
import { ForgotPassword } from "./components/pages/share/forgotPassword";

// Client pages
import { ClientDashboard } from "./components/pages/client/dashboard";
import { ClientRooms } from "./components/pages/client/rooms";
import { RoomDetail } from "./components/pages/client/rooms/roomDetail";
import ClientServices from "./components/pages/client/services/ClientServices";
import ServicesDetail from "./components/pages/client/services/ServicesDetail";
import { ClientGallery } from "./components/pages/client/Gallery";
import { ClientEvent } from "./components/pages/client/events/ClientEvent";

// Admin pages
import { AdminDashboard } from "./components/pages/admin/dashboard";
import { RoomList } from "./components/pages/admin/rooms/list";
import { RoomCreate } from "./components/pages/admin/rooms/create";
import { RoomEdit } from "./components/pages/admin/rooms/edit";

import { ServiceList } from "./components/pages/admin/services/list";
import { ServicesCreate } from "./components/pages/admin/services/create";
import ServicesEdit from "./components/pages/admin/services/edit";

import { GalleryList } from "./components/pages/admin/Gallery/list";
import { GalleryCreate } from "./components/pages/admin/Gallery/create";
import { GalleryEdit } from "./components/pages/admin/Gallery/edit";
import { GalleryShow } from "./components/pages/admin/Gallery/show";

import { EventList } from "./components/pages/admin/event/list";
import { EventCreate } from "./components/pages/admin/event/create";
import { EventShow } from "./components/pages/admin/event/show";
import { EventEdit } from "./components/pages/admin/event/edit";

import Amenities from "./components/pages/admin/amenities";
import { ClientAbout } from "./components/pages/client/about";
import ClientBooking from "./components/pages/client/booking/ClientBooking";
import { ProfileClient } from "./components/pages/client/profile";

// ======================================================
// 🚀 APP CHÍNH - ĐÃ SỬA
// ======================================================
export default function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        // accessControlProvider={accessControlProvider}
        notificationProvider={useNotificationProvider()}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          {/* --------------------------------------------- */}
          {/* 🚀 PUBLIC ROUTES (Không cần đăng nhập) */}
          {/* --------------------------------------------- */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* --------------------------------------------- */}
          {/* 🚀 CLIENT ROUTES (CẦN LOGIN, ROLE = CUSTOMER) */}
          {/* --------------------------------------------- */}
          <Route
            path="client"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route path="about" element={<ClientAbout />} />
            <Route path="rooms" element={<ClientRooms />} />
            <Route path="rooms/:id" element={<RoomDetail />} />
            <Route path="services" element={<ClientServices />} />
            <Route path="services/:id" element={<ServicesDetail />} />
            <Route path="galleries" element={<ClientGallery />} />
            <Route path="events" element={<ClientEvent />} />
            <Route path="profile" element={<ProfileClient />} />
            <Route path="bookings" element={<ClientBooking />} />
          </Route>

          {/* --------------------------------------------- */}
          {/* 🚀 ADMIN ROUTES (CẦN LOGIN, ROLE = ADMIN) */}
          {/* --------------------------------------------- */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Rooms */}
            <Route path="rooms" element={<RoomList />} />
            <Route path="rooms/create" element={<RoomCreate />} />
            <Route path="rooms/edit/:id" element={<RoomEdit />} />

            {/* Gallery */}
            <Route path="gallery" element={<GalleryList />} />
            <Route path="gallery/create" element={<GalleryCreate />} />
            <Route path="gallery/edit/:id" element={<GalleryEdit />} />
            <Route path="gallery/show/:id" element={<GalleryShow />} />

            {/* Services */}
            <Route path="services" element={<ServiceList />} />
            <Route path="services/create" element={<ServicesCreate />} />
            <Route path="services/edit/:id" element={<ServicesEdit />} />

            {/* Events */}
            <Route path="events" element={<EventList />} />
            <Route path="events/create" element={<EventCreate />} />
            <Route path="events/show/:id" element={<EventShow />} />
            <Route path="events/edit/:id" element={<EventEdit />} />

            {/* Amenities */}
            <Route path="amenities" element={<Amenities />} />
          </Route>

          {/* --------------------------------------------- */}
          {/* 🚀 FALLBACK */}
          {/* --------------------------------------------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
