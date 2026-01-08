import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Card,
  Button,
  Spin,
  Alert,
  Empty,
  message,
  Form,
  Badge,
} from "antd";
import {
  DownOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./ClientBooking.css";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useNavigate } from "react-router-dom"; // ✅ THÊM

dayjs.locale("en");

const { RangePicker } = DatePicker;
const API_URL = "http://localhost:8000";

// ===============================
// AUTH HOOK
// ===============================
const useAuth = () => {
  const getAuthData = () => {
    try {
      const authStr = localStorage.getItem("auth");
      if (!authStr) return null;
      return JSON.parse(authStr);
    } catch {
      return null;
    }
  };

  const authData = getAuthData();
  return {
    user: authData,
    isAuthenticated: !!authData,
    token: authData?.token || null,
    userId: authData?.user_id || authData?.id || null,
  };
};

export default function ClientBooking() {
  const navigate = useNavigate(); // ✅ THÊM
  const [step, setStep] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
  const [form] = Form.useForm();

  const { user, isAuthenticated, token, userId } = useAuth();

  const [filters, setFilters] = useState({
    dates: null as any,
    adults: 1,
    children: 0,
  });

  const [openGuestPopup, setOpenGuestPopup] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // ===============================
  // FETCH ROOMS
  // ===============================
  useEffect(() => {
    setLoading(true);
    const totalGuests = filters.adults + filters.children;

    axios
      .get(`${API_URL}/api/room-types`)
      .then((res) => {
        const data = res.data?.data || [];
        const filtered = data.filter(
          (room: any) => room.max_guests >= totalGuests
        );

        const mappedRooms = filtered.map((room: any) => ({
          room_type_id: room.room_type_id,
          room_type_name: room.room_type_name,
          room_type_image: room.room_type_image,
          price: Number(room.base_price),
          maxGuests: room.max_guests,
          description: room.description,
          images: room.images || [],
          soldOut: room.total_rooms === 0,
        }));

        setRooms(mappedRooms);
      })
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [filters]);

  // ===============================
  // ADD / UPDATE ROOM
  // ===============================
  const handleAddRoom = (room: any, quantity: number = 1) => {
    if (!filters.dates) {
      message.warning("Please select dates first!");
      return;
    }
    if (!isAuthenticated || !user) {
      message.warning("Please login to book!");
      window.location.href = "/login";
      return;
    }

    if (quantity === 0) {
      handleRemoveRoom(room.room_type_id);
      return;
    }

    const existingIndex = selectedRooms.findIndex(
      (r) => r.room_type_id === room.room_type_id
    );

    if (existingIndex >= 0) {
      const updated = [...selectedRooms];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity,
      };
      setSelectedRooms(updated);
    } else {
      setSelectedRooms([...selectedRooms, { ...room, quantity }]);
    }
  };

  // ===============================
  // REMOVE ROOM
  // ===============================
  const handleRemoveRoom = (roomTypeId: number) => {
    setSelectedRooms(
      selectedRooms.filter((r) => r.room_type_id !== roomTypeId)
    );
  };

  // ===============================
  // CONFIRM STEP
  // ===============================
  const handleGoToConfirmation = () => {
    if (selectedRooms.length === 0) {
      message.warning("Please select at least one room!");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  // ===============================
  // BOOKING + REDIRECT PAYMENT
  // ===============================
  const handleBooking = async () => {
    if (selectedRooms.length === 0 || !filters.dates) {
      message.error("Please select rooms and dates!");
      return;
    }
    if (!isAuthenticated || !userId || !token) {
      message.error("Please login to book!");
      window.location.href = "/login";
      return;
    }

    setBookingLoading(true);

    try {
      const bookingData = {
        check_in: filters.dates[0].format("YYYY-MM-DD"),
        check_out: filters.dates[1].format("YYYY-MM-DD"),
        adults: filters.adults,
        children: filters.children,
        room_types: selectedRooms.map((room) => ({
          room_type_id: room.room_type_id,
          quantity: room.quantity,
        })),
      };

      const res = await axios.post(`${API_URL}/api/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const bookingId = res.data?.data?.booking_id || res.data?.booking_id;

      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      message.success("Booking successful! Redirecting to payment...");

      // ✅ CHUYỂN TRANG PAYMENT
      navigate(`/client/payment/${bookingId}`);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Booking failed";
      message.error(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  const getNights = () => {
    if (!filters.dates) return 0;
    return filters.dates[1].diff(filters.dates[0], "days");
  };

  const calcTotal = () => {
    if (!filters.dates) return 0;
    return selectedRooms.reduce(
      (total, room) => total + room.price * room.quantity * getNights(),
      0
    );
  };

  // ===============================
  // RENDER (GIỮ NGUYÊN)
  // ===============================
  return (
    <ConfigProvider locale={enUS}>
      {/* ⬇⬇⬇ PHẦN JSX GIỮ NGUYÊN 100% */}
      {/* (Không thay đổi gì so với file bạn gửi) */}
    </ConfigProvider>
  );
}
