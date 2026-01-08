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

/* ================= AUTH ================= */
const useAuth = () => {
  const auth = localStorage.getItem("auth");
  const data = auth ? JSON.parse(auth) : null;

  return {
    user: data,
    isAuthenticated: !!data,
    token: data?.token || null,
    userId: data?.user_id || data?.id || null,
  };
};

export default function ClientBooking() {
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

  const [form] = Form.useForm();
  const { user, isAuthenticated, token, userId } = useAuth();

  /* ================= FETCH ROOMS ================= */
  useEffect(() => {
    setLoading(true);
    const totalGuests = filters.adults + filters.children;

    axios
      .get(`${API_URL}/api/room-types`)
      .then((res) => {
        const data = res.data?.data || [];
        setRooms(
          data
            .filter((r: any) => r.max_guests >= totalGuests)
            .map((room: any) => ({
              room_type_id: room.room_type_id,
              room_type_name: room.room_type_name,
              price: Number(room.base_price),
              maxGuests: room.max_guests,
              images: room.images || [],
              soldOut: room.total_rooms === 0,
            }))
        );
      })
      .finally(() => setLoading(false));
  }, [filters]);

  /* ================= ADD ROOM ================= */
  const handleAddRoom = (room: any) => {
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
      updated[index].quantity += 1;
      setSelectedRooms(updated);
    } else {
      setSelectedRooms([...selectedRooms, { ...room, quantity: 1 }]);
    }

    message.success(`Added ${room.room_type_name}`);
  };

  /* ================= REMOVE ROOM ================= */
  const handleRemoveRoom = (id: number) => {
    setSelectedRooms(selectedRooms.filter((r) => r.room_type_id !== id));
  };

  /* ================= BOOKING ================= */
  const handleBooking = async () => {
    if (!filters.dates || selectedRooms.length === 0) return;

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Booking successful!");
      setStep(1);
      setSelectedRooms([]);
      form.resetFields();
    } catch {
      message.error("Booking failed!");
    } finally {
      setBookingLoading(false);
    }
  };

  const nights = filters.dates
    ? filters.dates[1].diff(filters.dates[0], "days")
    : 0;

  const total = selectedRooms.reduce(
    (s, r) => s + r.price * r.quantity * nights,
    0
  );

  const totalRooms = selectedRooms.reduce((s, r) => s + r.quantity, 0);

  /* ================= RENDER ================= */
  return (
    <ConfigProvider locale={enUS}>
      <div className="booking-page">
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
              <button
                onClick={() =>
                  setFilters({ ...filters, adults: filters.adults + 1 })
                }
              >
                + Adult
              </button>
              <button
                onClick={() =>
                  setFilters({ ...filters, children: filters.children + 1 })
                }
              >
                + Child
              </button>
            </div>
          )}
        </div>

        {/* CART */}
        {step === 1 && selectedRooms.length > 0 && (
          <Badge count={totalRooms}>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => setStep(2)}
            >
              Confirm ({total.toLocaleString()} ₫)
            </Button>
          </Badge>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            {loading ? (
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
                    <Card key={room.room_type_id} className="room-card">
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

                      {selected && (
                        <div className="selected-badge">
                          Selected: {selected.quantity}
                        </div>
                      )}

                      <Button
                        type="primary"
                        block
                        onClick={() => handleAddRoom(room)}
                      >
                        {selected ? "Add More" : "Add"}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="step3-wrapper">
            <div className="card-box">
              <h2 className="step-title">Confirm Booking</h2>

              <Alert
                message={`Booking as: ${user?.user_name || user?.email}`}
                type="info"
                showIcon
              />

              {selectedRooms.map((room) => (
                <div className="confirm-row" key={room.room_type_id}>
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

              <p className="total-price">Total: {total.toLocaleString()} ₫</p>

              <Button
                type="primary"
                block
                size="large"
                loading={bookingLoading}
                onClick={handleBooking}
              >
                Confirm Booking
              </Button>
            </div>

            <div className="card-box">
              <h3>Summary</h3>
              <p>{nights} night(s)</p>
              <p>
                {filters.adults} adults, {filters.children} children
              </p>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}
