import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HomestayRed from "./components/HomestayRed";
<<<<<<< HEAD
=======
import Services from "./pages/Services";
>>>>>>> origin/lamtangthanh

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  return (
    <div>
      {!isOwnerPath && <Navbar />}
      {false && <HomestayRed />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
<<<<<<< HEAD
=======
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<Services />} />
>>>>>>> origin/lamtangthanh
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
