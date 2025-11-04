import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HomestayRed from "./components/HomestayRed";
import Services from "./pages/Services";
import { Layout } from "antd";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  return (
    <Layout>
      {!isOwnerPath && <Navbar />}
      {false && <HomestayRed />}
      <Layout.Content
        style={{ minHeight: "70vh", paddingTop: isOwnerPath ? 0 : 64 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<Services />} />
        </Routes>
      </Layout.Content>
      <Footer />
    </Layout>
  );
};

export default App;
