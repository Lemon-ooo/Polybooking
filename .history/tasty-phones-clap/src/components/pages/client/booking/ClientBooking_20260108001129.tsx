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

        setRooms(
          filtered.map((room: any) => ({
            room_type_id: room.room_type_id,
            room_type_name: room.room_type_name,
            room_type_image: room.room_type_image,
            price: Number(room.base_price),
            maxGuests: room.max_guests,
            description: room.description,
            images: room.images || [],
            soldOut: room.total_rooms === 0,
          }))
        );
      })
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [filters]);

  // ===============================
  // ROOM ACTIONS
  // ===============================
  const handleAddRoom = (room: any, quantity: number = 1) => {
    if (!filters.dates) {
      message.warning("Please select dates first!");
      return;
    }
    if (!isAuthenticated) {
      message.warning("Please login to book!");
      window.location.href = "/login";
      return;
    }

    const index = selectedRooms.findIndex(
      (r) => r.room_type_id === room.room_type_id
    );

    if (index >= 0) {
      const updated = [...selectedRooms];
      updated[index].quantity = quantity;
      setSelectedRooms(updated);
    } else {
      setSelectedRooms([...selectedRooms, { ...room, quantity }]);
    }
  };

  const handleRemoveRoom = (roomTypeId: number) => {
    setSelectedRooms(
      selectedRooms.filter((r) => r.room_type_id !== roomTypeId)
    );
  };

  const handleClearAllRooms = () => {
    setSelectedRooms([]);
    message.info("All selected rooms have been removed");
  };

  // ===============================
  // BOOKING
  // ===============================
  const handleBooking = async () => {
    if (!isAuthenticated || !token || !userId) return;

    setBookingLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/bookings`,
        {
          check_in: filters.dates[0].format("YYYY-MM-DD"),
          check_out: filters.dates[1].format("YYYY-MM-DD"),
          adults: filters.adults,
          children: filters.children,
          room_types: selectedRooms.map((r) => ({
            room_type_id: r.room_type_id,
            quantity: r.quantity,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Booking successful!");
      setStep(1);
      setSelectedRooms([]);
    } catch {
      message.error("Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const getNights = () =>
    filters.dates ? filters.dates[1].diff(filters.dates[0], "days") : 0;

  const calcTotal = () =>
    selectedRooms.reduce(
      (sum, r) => sum + r.price * r.quantity * getNights(),
      0
    );

  // ===============================
  // RENDER
  // ===============================
  return (
    <ConfigProvider locale={enUS}>
      <div className="booking-page">
        {step === 2 && (
          <Form form={form} onFinish={handleBooking} layout="vertical">
            <h2>Confirm Booking</h2>

            {selectedRooms.map((room) => (
              <div
                key={room.room_type_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                }}
              >
                <div>
                  <strong>{room.room_type_name}</strong> x {room.quantity}
                </div>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveRoom(room.room_type_id)}
                />
              </div>
            ))}

            <p style={{ fontSize: 18, marginTop: 16 }}>
              Total:{" "}
              <strong style={{ color: "#8B5E3C" }}>
                {calcTotal().toLocaleString()} ₫
              </strong>
            </p>

            {/* ===== ACTION BUTTONS ===== */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
              }}
            >
              <Button danger block onClick={handleClearAllRooms}>
                Remove all rooms
              </Button>

              <Button
                htmlType="submit"
                block
                loading={bookingLoading}
                style={{
                  backgroundColor: "#8B5E3C",
                  borderColor: "#8B5E3C",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Confirm Booking
              </Button>
            </div>
          </Form>
        )}
      </div>
    </ConfigProvider>
  );
}
