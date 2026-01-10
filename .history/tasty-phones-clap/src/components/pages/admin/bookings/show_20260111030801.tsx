// App.jsx hoặc Routes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingShow from "./pages/BookingShow";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/bookings/:id" element={<BookingShow />} />
        {/* Các route khác */}
      </Routes>
    </Router>
  );
}
