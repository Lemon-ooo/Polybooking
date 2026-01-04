import React from "react";
import { Refine } from "@refinedev/core";
import "../src/assets/fonts/fonts.css";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { authProvider, dataProvider } from "./providers";

import { ClientLayout } from "./components/layout/ClientLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import { ProtectedRoute } from "./components/protected-route";

// Public pages
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
import { ClientAbout } from "./components/pages/client/about";
import ClientBooking from "./components/pages/client/booking/ClientBooking";
import { ProfileClient } from "./components/pages/client/profile";

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

import { GalleryShow } from "./components/pages/admin/Gallery/show";

import { EventList } from "./components/pages/admin/event/list";
import { EventCreate } from "./components/pages/admin/event/create";
import { EventShow } from "./components/pages/admin/event/show";
import { EventEdit } from "./components/pages/admin/event/edit";

import Amenities from "./components/pages/admin/amenities";

import { RoomTypeList } from "./components/pages/admin/room-types/list";
import { RoomTypeCreate } from "./components/pages/admin/room-types/create";
import { RoomTypeEdit } from "./components/pages/admin/room-types/edit";
import { RoomTypeShow } from "./components/pages/admin/room-types/show";
import { RoomShow } from "./components/pages/admin/rooms/show";
import { ServicesShow } from "./components/pages/admin/services/show";
import { AmenitiesShow } from "./components/pages/admin/amenities/show";
import AdminBookingManagement from "./components/pages/admin/bookings";
import MyBookings from "./components/pages/client/booking/MyBookings";
import BookingDetail from "./components/pages/client/booking/BookingDetail";
import GalleryEdit from "./components/pages/admin/Gallery/edit";
import { UserList } from "./components/pages/admin/user/list";

// ======================================================
// 🚀 APP CHÍNH - ĐÃ SỬA
// ======================================================
export default function App() {
  return (
    <BrowserRouter>
    
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        notificationProvider={useNotificationProvider()}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
        
      >
        <Routes>
          {/* ============================================= */}
          {/* 🚀 REDIRECT TỪ ROOT "/" → "/client" */}
          {/* ============================================= */}
          <Route path="/" element={<Navigate to="/client" replace />} />
      
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          

          {/* --------------------------------------------- */}
          {/* 🚀 CLIENT ROUTES (ROLE = CUSTOMER) */}
          {/* --------------------------------------------- */}
          <Route
            path="client/*"
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
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="my-bookings/:id" element={<BookingDetail />} />
          </Route>

          {/* --------------------------------------------- */}
          {/* 🚀 ADMIN ROUTES (ROLE = ADMIN) */}
          {/* --------------------------------------------- */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookingManagement />} />

            {/* Rooms */}
            <Route path="rooms" element={<RoomList />} />
            <Route path="rooms/create" element={<RoomCreate />} />
            <Route path="rooms/edit/:id" element={<RoomEdit />} />
            <Route path="rooms/show/:id" element={<RoomShow />} />

            {/* Room Types */}
            <Route path="room-types" element={<RoomTypeList />} />
            <Route path="room-types/show/:id" element={<RoomTypeShow />} />
            <Route path="room-types/create" element={<RoomTypeCreate />} />
            <Route path="room-types/edit/:id" element={<RoomTypeEdit />} />

            {/* Amenities */}
            <Route path="amenities" element={<Amenities />} />
            <Route path="amenities/show/:id" element={<AmenitiesShow />} />

            {/* Gallery */}
            <Route path="galleries" element={<GalleryList />} />
            <Route path="galleries/create" element={<GalleryCreate />} />
            <Route path="galleries/edit/:id" element={<GalleryEdit />} />
            <Route path="galleries/show/:id" element={<GalleryShow />} />

            {/* Services */}
            <Route path="services" element={<ServiceList />} />
            <Route path="services/create" element={<ServicesCreate />} />
            <Route path="services/edit/:id" element={<ServicesEdit />} />
            <Route path="services/show/:id" element={<ServicesShow />} />

            {/* Events */}
            <Route path="events" element={<EventList />} />
            <Route path="events/create" element={<EventCreate />} />
            <Route path="events/show/:id" element={<EventShow />} />
            <Route path="events/edit/:id" element={<EventEdit />} />

            {/* customers */}
            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<EventCreate />} />
            <Route path="users/edit/:id" element={<EventEdit />} />
          </Route>

          {/* --------------------------------------------- */}
          {/* 🚀 FALLBACK */}
          {/* --------------------------------------------- */}
          <Route path="*" element={<Navigate to="/client" replace />} />
        </Routes>
      </Refine>

      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        notificationProvider={useNotificationProvider()}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
        resources={[
          {
            name: "services",
            list: "/admin/services",
            create: "/admin/services/create",
            edit: "/admin/services/edit/:id",
            show: "/admin/services/show/:id",
          },
          {
            name: "rooms",
            list: "/admin/rooms",
            create: "/admin/rooms/create",
            edit: "/admin/rooms/edit/:id",
            show: "/admin/rooms/show/:id",
          },
          {
            name: "room-types",
            list: "/admin/room-types",
            create: "/admin/room-types/create",
            edit: "/admin/room-types/edit/:id",
            show: "/admin/room-types/show/:id",
          },
          {
            name: "gallery",
            list: "/admin/gallery",
            create: "/admin/gallery/create",
            edit: "/admin/gallery/edit/:id",
            show: "/admin/gallery/show/:id",
          },
          {
            name: "events",
            list: "/admin/events",
            create: "/admin/events/create",
            edit: "/admin/events/edit/:id",
            show: "/admin/events/show/:id",
          },
        ]}
      />
    </BrowserRouter>
  );
}
