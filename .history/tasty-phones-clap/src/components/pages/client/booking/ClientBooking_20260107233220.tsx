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
  Input,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import "./ClientBooking.css";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

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
  const [step, setStep] = useState(1); // 1: Chọn phòng | 2: Thông tin cá nhân
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
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
  // FETCH ROOMS (STEP 1)
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
  // SELECT ROOM
  // ===============================
  const handleSelectRoom = (room: any) => {
    if (!filters.dates) {
      message.warning("Vui lòng chọn ngày trước!");
      return;
    }
    if (!isAuthenticated || !user) {
      message.warning("Vui lòng đăng nhập để đặt phòng!");
      window.location.href = "/login";
      return;
    }
    setSelectedRoom(room);
    setStep(2);
    window.scrollTo(0, 0);
  };

  // ===============================
  // BOOKING - FIXED TO MATCH NEW API
  // ===============================
  const handleBooking = async (values: any) => {
    if (!selectedRoom || !filters.dates) {
      message.error("Vui lòng chọn phòng và ngày!");
      return;
    }
    if (!isAuthenticated || !userId || !token) {
      message.error("Vui lòng đăng nhập để đặt phòng!");
      window.location.href = "/login";
      return;
    }

    setBookingLoading(true);

    try {
      // Cấu trúc dữ liệu mới theo API
      const bookingData = {
        check_in: filters.dates[0].format("YYYY-MM-DD"),
        check_out: filters.dates[1].format("YYYY-MM-DD"),
        adults: filters.adults,
        children: filters.children,
        room_types: [
          {
            room_type_id: selectedRoom.room_type_id,
            quantity: 1,
          },
        ],
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${API_URL}/api/bookings`,
        bookingData,
        config
      );

      message.success(
        "Đặt phòng thành công! Chúng tôi sẽ liên hệ để xác nhận."
      );

      // Reset form
      setStep(1);
      setSelectedRoom(null);
      form.resetFields();
    } catch (error: any) {
      console.error("Booking error:", error);

      const errorMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Đặt phòng thất bại";

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
    if (!selectedRoom || !filters.dates) return 0;
    return selectedRoom.price * getNights();
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <ConfigProvider locale={viVN}>
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
                    {filters.adults} người lớn, {filters.children} trẻ em
                  </span>
                  <DownOutlined />
                </div>

                {openGuestPopup && (
                  <div className="guest-popup">
                    <div className="row">
                      <span>Người lớn</span>
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
                      <span>Trẻ em</span>
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

                    <div className="popup-actions">
                      <button onClick={() => setOpenGuestPopup(false)}>
                        Xong
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEPS HEADER */}
            <div className="steps-header">
              {step > 1 ? (
                <button className="steps-btn back" onClick={() => setStep(1)}>
                  ⟵ Quay lại
                </button>
              ) : (
                <div style={{ width: 80 }} />
              )}

              <div className="steps-title">
                {step === 1 && "Chọn phòng"}
                {step === 2 && "Xác nhận đặt phòng"}
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
                  <Empty description="Không có phòng phù hợp" />
                ) : (
                  <div className="room-list-grid">
                    {rooms.map((room) => (
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
                            <div className="soldout-badge">Hết phòng</div>
                          )}
                        </div>
                        <h3 className="room-title">{room.room_type_name}</h3>
                        <p className="room-desc">
                          Sức chứa: {room.maxGuests} khách
                        </p>
                        <p className="room-price">
                          Từ <strong>{room.price.toLocaleString()} ₫</strong> /
                          đêm
                        </p>
                        <div className="room-actions">
                          {room.soldOut ? (
                            <Button disabled>Đã bán hết</Button>
                          ) : (
                            <Button
                              type="primary"
                              onClick={() => handleSelectRoom(room)}
                            >
                              Chọn phòng
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="step3-wrapper">
                <div className="step3-left card-box">
                  <Form form={form} layout="vertical" onFinish={handleBooking}>
                    <h2 className="step-title">Xác nhận đặt phòng</h2>

                    {isAuthenticated && user && (
                      <Alert
                        message={`Bạn đang đặt phòng với tư cách: ${
                          user.user_name || user.email
                        }`}
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    )}

                    <div style={{ marginBottom: 24 }}>
                      <h3>Thông tin đặt phòng</h3>
                      <p>
                        <strong>Phòng:</strong> {selectedRoom?.room_type_name}
                      </p>
                      <p>
                        <strong>Check-in:</strong>{" "}
                        {filters.dates?.[0].format("DD/MM/YYYY")}
                      </p>
                      <p>
                        <strong>Check-out:</strong>{" "}
                        {filters.dates?.[1].format("DD/MM/YYYY")}
                      </p>
                      <p>
                        <strong>Số đêm:</strong> {getNights()} đêm
                      </p>
                      <p>
                        <strong>Số khách:</strong> {filters.adults} người lớn,{" "}
                        {filters.children} trẻ em
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        <span
                          style={{
                            color: "#1890ff",
                            fontSize: 18,
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
                      Xác nhận đặt phòng
                    </Button>
                  </Form>
                </div>

                <div className="step3-right card-box">
                  <h3>Tóm tắt đơn đặt</h3>
                  {filters.dates && (
                    <p>
                      {filters.dates[0].format("DD/MM/YYYY")} →{" "}
                      {filters.dates[1].format("DD/MM/YYYY")} ({getNights()}{" "}
                      đêm)
                    </p>
                  )}
                  <p>
                    <strong>{selectedRoom?.room_type_name}</strong>
                  </p>
                  <p>
                    {filters.adults} người lớn, {filters.children} trẻ em
                  </p>
                  <hr style={{ margin: "16px 0" }} />
                  <p style={{ fontSize: 18 }}>
                    Tổng:{" "}
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
