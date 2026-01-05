import React from "react";
import { Refine } from "@refinedev/core";
import { notificationProvider } from "@refinedev/antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";

import { PublicLayout } from "./components/layout/PublicLayout";
import { ClientLayout } from "./components/layout/ClientLayout";

import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { HomePage } from "./pages/home";
import { ProfilePage } from "./pages/profile";

// ----------------------------
// 🔒 Protected Route
// ----------------------------
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ----------------------------
// Ứng dụng chính
// ----------------------------
function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        notificationProvider={notificationProvider}
      >
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ---------- Private Routes ---------- */}
          <Route
            element={
              <ProtectedRoute>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* ---------- Redirect fallback ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
