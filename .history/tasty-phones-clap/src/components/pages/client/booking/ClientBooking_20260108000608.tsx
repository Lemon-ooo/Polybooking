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
  InputNumber,
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
// AUTH HOOK (localStorage)
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
  // ADD/UPDATE ROOM
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
        quantity: quantity,
      };
      setSelectedRooms(updated);
    } else {
      setSelectedRooms([...selectedRooms, { ...room, quantity }]);
    }
    message.success(`Added ${room.room_type_name}`);
  };

  // ===============================
  // REMOVE ROOM
  // ===============================
  const handleRemoveRoom = (roomTypeId: number) => {
    setSelectedRooms(
      selectedRooms.filter((r) => r.room_type_id !== roomTypeId)
    );
    message.info("Room removed");
  };

  // ===============================
  // GO TO CONFIRMATION
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
  // BOOKING
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.post(`${API_URL}/api/bookings`, bookingData, config);

      message.success("Booking successful! We will contact you to confirm.");

      setStep(1);
      setSelectedRooms([]);
      form.resetFields();
    } catch (error: any) {
      console.error("Booking error:", error);

      const errorMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Booking failed";

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
    if (selectedRooms.length === 0 || !filters.dates) return 0;
    return selectedRooms.reduce(
      (total, room) => total + room.price * room.quantity * getNights(),
      0
    );
  };

  const getTotalRooms = () => {
    return selectedRooms.reduce((sum, room) => sum + room.quantity, 0);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <ConfigProvider locale={enUS}>
      <div className="booking-page">
        {/* HERO */}
        <div className="booking-hero-banner">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="hero-title">Booking</h1>
          </div>
        </div>

        <div className="booking-content-wrapper">
          <div className="booking-container">
            {/* FILTER BAR */}
            <div className="filter-container">
              <div className="filter-bar">
                <div className="filter-item date-item">
                  <RangePicker
                    value={filters.dates}
                    onChange={(v) => setFilters({ ...filters, dates: v })}
                    allowClear={false}
                    format={(value) => value.format("DD MMM")}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                  />
                </div>

                <div
                  className="filter-item guest-item"
                  onClick={() => setOpenGuestPopup(!openGuestPopup)}
                >
                  <span className="guest-label">
                    {filters.adults} Adults, {filters.children} Children
                  </span>
                  <DownOutlined />
                </div>

                {openGuestPopup && (
                  <div className="guest-popup">
                    <div className="row">
                      <span>Adults</span>
                      <div className="counter">
                        <button
                          onClick={() =>
                            setFilters({
                              ...filters,
                              adults: Math.max(1, filters.adults - 1),
                            })
                          }
                        >
                          -
                        </button>
                        <span>{filters.adults}</span>
                        <button
                          onClick={() =>
                            setFilters({
                              ...filters,
                              adults: filters.adults + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="row">
                      <span>Children</span>
                      <div className="counter">
                        <button
                          onClick={() =>
                            setFilters({
                              ...filters,
                              children: Math.max(0, filters.children - 1),
                            })
                          }
                        >
                          -
                        </button>
                        <span>{filters.children}</span>
                        <button
                          onClick={() =>
                            setFilters({
                              ...filters,
                              children: filters.children + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CART BADGE */}
              {selectedRooms.length > 0 && step === 1 && (
                <div style={{ marginTop: 16, textAlign: "right" }}>
                  <Badge count={getTotalRooms()} showZero>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleGoToConfirmation}
                      size="large"
                    >
                      Confirm Booking ({calcTotal().toLocaleString()} ₫)
                    </Button>
                  </Badge>
                </div>
              )}
            </div>

            {/* STEPS HEADER */}
            <div className="steps-header">
              {step > 1 ? (
                <button className="steps-btn back" onClick={() => setStep(1)}>
                  ⟵ Back
                </button>
              ) : (
                <div style={{ width: 80 }} />
              )}

              <div className="steps-title">
                {step === 1 && "Select Rooms"}
                {step === 2 && "Confirm Booking"}
              </div>

              <div style={{ width: 120 }} />
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                {loading ? (
                  <div className="loading">
                    <Spin size="large" />
                  </div>
                ) : rooms.length === 0 ? (
                  <Empty description="No rooms available" />
                ) : (
                  <div className="room-list-grid">
                    {rooms.map((room) => {
                      const selectedRoom = selectedRooms.find(
                        (r) => r.room_type_id === room.room_type_id
                      );
                      const currentQuantity = selectedRoom?.quantity || 0;

                      return (
                        <Card className="room-card" key={room.room_type_id}>
                          <div className="room-img-wrap">
                            <img
                              src={
                                room.images?.[0]?.image_url
                                  ? `${API_URL}/storage/${room.images[0].image_url}`
                                  : "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                              }
                              className="room-img"
                              alt={room.room_type_name}
                            />
                            {room.soldOut && (
                              <div className="soldout-badge">Sold Out</div>
                            )}
                            {currentQuantity > 0 && (
                              <div
                                className="soldout-badge"
                                style={{ background: "#52c41a" }}
                              >
                                Selected: {currentQuantity}
                              </div>
                            )}
                          </div>
                          <h3 className="room-title">{room.room_type_name}</h3>
                          <p className="room-desc">
                            Capacity: {room.maxGuests} guests
                          </p>
                          <p className="room-price">
                            From{" "}
                            <strong>{room.price.toLocaleString()} ₫</strong> /
                            night
                          </p>
                          <div className="room-actions">
                            {room.soldOut ? (
                              <Button disabled>Sold Out</Button>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    handleAddRoom(room, currentQuantity + 1)
                                  }
                                >
                                  Add
                                </Button>
                              </div>
                            )}
                          </div>
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
                <div className="step3-left card-box">
                  <Form form={form} layout="vertical" onFinish={handleBooking}>
                    <h2 className="step-title">Confirm Booking</h2>

                    {isAuthenticated && user && (
                      <Alert
                        message={`Booking as: ${user.user_name || user.email}`}
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    )}

                    <div style={{ marginBottom: 24 }}>
                      <h3>Booking Information</h3>
                      <p>
                        <strong>Check-in:</strong>{" "}
                        {filters.dates?.[0].format("DD/MM/YYYY")}
                      </p>
                      <p>
                        <strong>Check-out:</strong>{" "}
                        {filters.dates?.[1].format("DD/MM/YYYY")}
                      </p>
                      <p>
                        <strong>Nights:</strong> {getNights()} night(s)
                      </p>
                      <p>
                        <strong>Guests:</strong> {filters.adults} adult(s),{" "}
                        {filters.children} child(ren)
                      </p>

                      <h4 style={{ marginTop: 16 }}>Selected Rooms:</h4>
                      {selectedRooms.map((room) => (
                        <div
                          key={room.room_type_id}
                          style={{
                            padding: "8px 0",
                            borderBottom: "1px solid #f0f0f0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong>{room.room_type_name}</strong> x{" "}
                            {room.quantity}
                            <br />
                            <span style={{ fontSize: 12, color: "#888" }}>
                              {room.price.toLocaleString()} ₫/night x{" "}
                              {room.quantity} room(s) x {getNights()} night(s) ={" "}
                              {(
                                room.price *
                                room.quantity *
                                getNights()
                              ).toLocaleString()}{" "}
                              ₫
                            </span>
                          </div>
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveRoom(room.room_type_id)}
                          />
                        </div>
                      ))}

                      <p style={{ marginTop: 16, fontSize: 18 }}>
                        <strong>Total:</strong>{" "}
                        <span
                          style={{
                            color: "#1890ff",
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                        >
                          {calcTotal().toLocaleString()} ₫
                        </span>
                      </p>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={bookingLoading}
                      size="large"
                      block
                    >
                      Confirm Booking
                    </Button>
                  </Form>
                </div>

                <div className="step3-right card-box">
                  <h3>Booking Summary</h3>
                  {filters.dates && (
                    <p>
                      {filters.dates[0].format("DD/MM/YYYY")} →{" "}
                      {filters.dates[1].format("DD/MM/YYYY")} ({getNights()}{" "}
                      night(s))
                    </p>
                  )}
                  <p>
                    {filters.adults} adult(s), {filters.children} child(ren)
                  </p>
                  <hr style={{ margin: "16px 0" }} />
                  {selectedRooms.map((room) => (
                    <p key={room.room_type_id}>
                      <strong>{room.room_type_name}</strong> x {room.quantity}
                      <br />
                      <span style={{ fontSize: 12 }}>
                        {(
                          room.price *
                          room.quantity *
                          getNights()
                        ).toLocaleString()}{" "}
                        ₫
                      </span>
                    </p>
                  ))}
                  <hr style={{ margin: "16px 0" }} />
                  <p style={{ fontSize: 18 }}>
                    Total:{" "}
                    <strong style={{ color: "#1890ff" }}>
                      {calcTotal().toLocaleString()} ₫
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
