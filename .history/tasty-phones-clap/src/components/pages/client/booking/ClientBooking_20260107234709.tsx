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
  const [step, setStep] = useState(1); // 1: Chọn phòng | 2: Xác nhận
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]); // Mảng các phòng đã chọn
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
  // ADD/UPDATE ROOM TO CART
  // ===============================
  const handleAddRoom = (room: any, quantity: number = 1) => {
    if (!filters.dates) {
      message.warning("Vui lòng chọn ngày trước!");
      return;
    }
    if (!isAuthenticated || !user) {
      message.warning("Vui lòng đăng nhập để đặt phòng!");
      window.location.href = "/login";
      return;
    }

    const existingIndex = selectedRooms.findIndex(
      (r) => r.room_type_id === room.room_type_id
    );

    if (existingIndex >= 0) {
      // Cập nhật số lượng
      const updated = [...selectedRooms];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: quantity,
      };
      setSelectedRooms(updated);
    } else {
      // Thêm mới
      setSelectedRooms([...selectedRooms, { ...room, quantity }]);
    }
    message.success(`Đã thêm ${room.room_type_name}`);
  };

  // ===============================
  // REMOVE ROOM FROM CART
  // ===============================
  const handleRemoveRoom = (roomTypeId: number) => {
    setSelectedRooms(
      selectedRooms.filter((r) => r.room_type_id !== roomTypeId)
    );
    message.info("Đã xóa phòng khỏi giỏ");
  };

  // ===============================
  // GO TO CONFIRMATION
  // ===============================
  const handleGoToConfirmation = () => {
    if (selectedRooms.length === 0) {
      message.warning("Vui lòng chọn ít nhất một phòng!");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  // ===============================
  // BOOKING
  // ===============================
  const handleBooking = async (values: any) => {
    if (selectedRooms.length === 0 || !filters.dates) {
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

      message.success(
        "Đặt phòng thành công! Chúng tôi sẽ liên hệ để xác nhận."
      );

      // Reset
      setStep(1);
      setSelectedRooms([]);
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
                      Xác nhận đặt phòng ({calcTotal().toLocaleString()} ₫)
                    </Button>
                  </Badge>
                </div>
              )}
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
                              <div className="soldout-badge">Hết phòng</div>
                            )}
                            {currentQuantity > 0 && (
                              <div
                                className="soldout-badge"
                                style={{ background: "#52c41a" }}
                              >
                                Đã chọn: {currentQuantity}
                              </div>
                            )}
                          </div>
                          <h3 className="room-title">{room.room_type_name}</h3>
                          <p className="room-desc">
                            Sức chứa: {room.maxGuests} khách
                          </p>
                          <p className="room-price">
                            Từ <strong>{room.price.toLocaleString()} ₫</strong>{" "}
                            / đêm
                          </p>
                          <div className="room-actions">
                            {room.soldOut ? (
                              <Button disabled>Đã bán hết</Button>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <InputNumber
                                  min={0}
                                  max={10}
                                  value={currentQuantity}
                                  onChange={(val) =>
                                    handleAddRoom(room, val || 0)
                                  }
                                  style={{ width: 80 }}
                                />
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    handleAddRoom(room, currentQuantity + 1)
                                  }
                                >
                                  Thêm
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

                      <h4 style={{ marginTop: 16 }}>Các phòng đã chọn:</h4>
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
                              {room.price.toLocaleString()} ₫/đêm x{" "}
                              {room.quantity} phòng x {getNights()} đêm ={" "}
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
                        <strong>Tổng tiền:</strong>{" "}
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
                    {filters.adults} người lớn, {filters.children} trẻ em
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
