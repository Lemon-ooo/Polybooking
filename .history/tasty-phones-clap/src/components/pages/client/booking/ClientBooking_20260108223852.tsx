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
import { useNavigate } from "react-router-dom";
import "./ClientBooking.css";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/en";

dayjs.locale("en");

const { RangePicker } = DatePicker;
const API_URL = "http://localhost:8000";

/* ===============================
   AUTH HOOK
================================ */
const useAuth = () => {
  try {
    const authStr = localStorage.getItem("auth");
    const authData = authStr ? JSON.parse(authStr) : null;

    return {
      user: authData,
      isAuthenticated: !!authData,
      token: authData?.token || null,
      userId: authData?.user_id || authData?.id || null,
    };
  } catch {
    return {
      user: null,
      isAuthenticated: false,
      token: null,
      userId: null,
    };
  }
};

export default function ClientBooking() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { user, isAuthenticated, token, userId } = useAuth();

  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [openGuestPopup, setOpenGuestPopup] = useState(false);

  const [filters, setFilters] = useState({
    dates: null as any,
    adults: 1,
    children: 0,
  });

  /* ===============================
     FETCH ROOMS
  ================================ */
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
            price: Number(room.base_price),
            maxGuests: room.max_guests,
            images: room.images || [],
            soldOut: room.total_rooms === 0,
          }))
        );
      })
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [filters]);

  /* ===============================
     HELPERS
  ================================ */
  const getNights = () =>
    filters.dates ? filters.dates[1].diff(filters.dates[0], "days") : 0;

  const calcTotal = () =>
    selectedRooms.reduce(
      (sum, r) => sum + r.price * r.quantity * getNights(),
      0
    );

  const getTotalRooms = () =>
    selectedRooms.reduce((sum, r) => sum + r.quantity, 0);

  /* ===============================
     ROOM ACTIONS
  ================================ */
  const handleAddRoom = (room: any, quantity: number) => {
    if (!filters.dates) {
      message.warning("Please select dates first!");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (quantity <= 0) {
      setSelectedRooms(
        selectedRooms.filter((r) => r.room_type_id !== room.room_type_id)
      );
      return;
    }

    setSelectedRooms((prev) => {
      const idx = prev.findIndex((r) => r.room_type_id === room.room_type_id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx].quantity = quantity;
        return clone;
      }
      return [...prev, { ...room, quantity }];
    });
  };

  /* ===============================
     BOOKING → PAYMENT
  ================================ */
  const handleBooking = async () => {
    if (!filters.dates || selectedRooms.length === 0) {
      message.error("Please select rooms and dates!");
      return;
    }

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await axios.post(
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingId = res.data?.data?.booking_id || res.data?.booking_id;

      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      message.success("Booking created. Redirecting to payment...");

      // ✅ ĐI SANG QR PAYMENT
      navigate(`/client/payment/${bookingId}`);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <ConfigProvider locale={enUS}>
      <div className="booking-page">
        <div className="booking-hero-banner">
          <div className="hero-overlay" />
          <h1 className="hero-title">Booking</h1>
        </div>

        <div className="booking-container">
          {/* FILTER */}
          <div className="filter-bar">
            <RangePicker
              value={filters.dates}
              onChange={(v) => setFilters({ ...filters, dates: v })}
              disabledDate={(d) => d && d < dayjs().startOf("day")}
            />

            <div
              className="guest-item"
              onClick={() => setOpenGuestPopup(!openGuestPopup)}
            >
              {filters.adults} Adults, {filters.children} Children{" "}
              <DownOutlined />
            </div>

            {openGuestPopup && (
              <div className="guest-popup">
                {["adults", "children"].map((type) => (
                  <div key={type} className="row">
                    <span>{type}</span>
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          [type]: Math.max(
                            type === "adults" ? 1 : 0,
                            (filters as any)[type] - 1
                          ),
                        })
                      }
                    >
                      -
                    </button>
                    <span>{(filters as any)[type]}</span>
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          [type]: (filters as any)[type] + 1,
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CART */}
          {selectedRooms.length > 0 && step === 1 && (
            <Badge count={getTotalRooms()}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => setStep(2)}
              >
                Confirm ({calcTotal().toLocaleString()} ₫)
              </Button>
            </Badge>
          )}

          {/* STEP 1 */}
          {step === 1 &&
            (loading ? (
              <Spin />
            ) : rooms.length === 0 ? (
              <Empty />
            ) : (
              <div className="room-list-grid">
                {rooms.map((room) => {
                  const selected = selectedRooms.find(
                    (r) => r.room_type_id === room.room_type_id
                  );

                  return (
                    <Card key={room.room_type_id}>
                      <img
                        src={
                          room.images?.[0]?.image_url
                            ? `${API_URL}/storage/${room.images[0].image_url}`
                            : "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                        }
                        alt=""
                      />
                      <h3>{room.room_type_name}</h3>
                      <p>{room.price.toLocaleString()} ₫ / night</p>

                      {room.soldOut ? (
                        <Button disabled>Sold Out</Button>
                      ) : selected ? (
                        <div>
                          <Button
                            onClick={() =>
                              handleAddRoom(room, selected.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          {selected.quantity}
                          <Button
                            onClick={() =>
                              handleAddRoom(room, selected.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => handleAddRoom(room, 1)}
                        >
                          Add
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            ))}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="fixed-booking-footer">
              <div>Total: {calcTotal().toLocaleString()} ₫</div>
              <Button
                type="primary"
                loading={bookingLoading}
                onClick={handleBooking}
              >
                Confirm Booking
              </Button>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
