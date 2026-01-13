import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Card,
  Button,
  Spin,
  Alert,
  Empty,
  message,
  Badge,
  Modal,
  Descriptions,
  QRCode,
  Result,
} from "antd";
import {
  DownOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
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
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);

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
  // PAYMENT MODAL STATES
  // ===============================
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [checkingPayment, setCheckingPayment] = useState(false);

  // ===============================
  // FETCH ROOMS
  // ===============================
  useEffect(() => {
    setLoading(true);
    const totalGuests = filters.adults + filters.children;

    // Lấy room types trước
    axios
      .get(`${API_URL}/api/room-types`)
      .then(async (res) => {
        const roomTypes = res.data?.data || [];

        // Lọc theo số khách
        const filteredTypes = roomTypes.filter(
          (room: any) => room.max_guests >= totalGuests
        );

        // Lấy danh sách rooms để check trạng thái booked
        const roomsRes = await axios.get(`${API_URL}/api/rooms`);
        const roomsData = roomsRes.data?.data || [];

        // Tính số phòng booked theo room_type_id
        const bookedCount: any = roomsData.reduce((acc: any, r: any) => {
          if (r.room_status === "booked") {
            acc[r.room_type_id] = (acc[r.room_type_id] || 0) + 1;
          }
          return acc;
        }, {});

        // Map dữ liệu cuối cùng
        const mappedRooms = filteredTypes.map((room: any) => {
          const booked = bookedCount[room.room_type_id] || 0;
          const available = room.total_rooms - booked;

          return {
            room_type_id: room.room_type_id,
            room_type_name: room.room_type_name,
            room_type_image: room.room_type_image,
            price: Number(room.base_price),
            maxGuests: room.max_guests,
            description: room.description,
            images: room.images || [],
            total_rooms: room.total_rooms,
            booked,
            available,
            soldOut: available <= 0,
          };
        });

        setRooms(mappedRooms);
      })
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [filters]);

  // ===============================
  // RESET VOUCHER WHEN CHANGE ROOMS OR DATES
  // ===============================
  useEffect(() => {
    setVoucherApplied(false);
  }, [selectedRooms, filters.dates]);

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
  // CHECK PAYMENT STATUS (UPDATED FOR NEW API STRUCTURE)
  // ===============================
  const checkPaymentStatus = async (bId: number) => {
    try {
      setCheckingPayment(true);
      const res = await axios.get(`${API_URL}/api/bookings/${bId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🔍 Full API Response:", res.data);

      // Xử lý cấu trúc response mới
      let booking;

      // Case 1: { data: { booking: {...}, pricing: {...} } }
      if (res.data?.data?.booking) {
        booking = res.data.data.booking;
      }
      // Case 2: { data: {...} }
      else if (res.data?.data) {
        booking = res.data.data;
      }
      // Case 3: Direct response
      else {
        booking = res.data;
      }

      if (!booking) {
        console.error("❌ Booking not found in response:", res.data);
        return false;
      }

      console.log("📊 Booking status check:", {
        bookingId: bId,
        status: booking.status,
        data: booking,
      });

      // Danh sách các trạng thái thành công
      const paidStatuses = ["paid", "check_in", "check_out"];
      const canceledStatuses = ["canceled"];
      const pendingStatus = "pending_payment";

      if (paidStatuses.includes(booking.status)) {
        setPaymentStatus("success");
        message.success("✅ Payment successful! Redirecting to homepage...");

        setTimeout(() => {
          setPaymentModalVisible(false);
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }, 3000);

        return true;
      } else if (canceledStatuses.includes(booking.status)) {
        setPaymentStatus("failed");
        message.error("❌ Booking has been cancelled");
        return false;
      } else if (booking.status === pendingStatus) {
        console.log("⏳ Still pending payment...");
        return false;
      }

      console.warn("⚠️ Unknown booking status:", booking.status);
      return false;
    } catch (error: any) {
      console.error("💥 Check payment error:", error);

      if (axios.isAxiosError(error)) {
        console.log("📡 Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 401) {
          message.error("Session expired. Please login again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else if (error.response?.status === 403) {
          message.error("You don't have permission to view this booking");
        } else if (error.response?.status === 404) {
          message.warning("Booking not found");
        } else if (error.response?.status === 500) {
          console.warn("Server error when checking payment status");
        }
      }

      return false;
    } finally {
      setCheckingPayment(false);
    }
  };

  // ===============================
  // AUTO CHECK PAYMENT EVERY 3s
  // ===============================
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (paymentModalVisible && bookingId && paymentStatus === "pending") {
      let errorCount = 0;
      const maxErrors = 5;

      interval = setInterval(async () => {
        try {
          console.log(
            `🔄 Checking payment status for booking #${bookingId}...`
          );
          await checkPaymentStatus(bookingId);
          errorCount = 0;
        } catch (error) {
          errorCount++;
          console.error(`❌ Payment check error #${errorCount}:`, error);

          if (errorCount >= maxErrors) {
            console.warn(
              `🛑 Stopped payment polling after ${maxErrors} errors`
            );
            clearInterval(interval);

            message.info(
              "Payment status check paused. " +
                "Please check your banking app. " +
                "Your booking will be updated once payment is confirmed."
            );
          }
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentModalVisible, bookingId, paymentStatus]);

  // ===============================
  // BOOKING + SHOW QR PAYMENT
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
      // STEP 1: Create booking
      const bookingData = {
        check_in: filters.dates[0].format("YYYY-MM-DD"),
        check_out: filters.dates[1].format("YYYY-MM-DD"),
        adults: filters.adults,
        children: filters.children,
        voucher_code: voucherCode || null,
        room_types: selectedRooms.map((room) => ({
          room_type_id: room.room_type_id,
          quantity: room.quantity,
        })),
      };

      console.log("📤 Sending booking request:", bookingData);

      const bookingRes = await axios.post(
        `${API_URL}/api/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Booking Response:", bookingRes.data);

      // Lấy booking ID từ response mới
      let bId;

      // Thử các cấu trúc response khác nhau
      if (bookingRes.data?.data?.booking?.id) {
        bId = bookingRes.data.data.booking.id;
      } else if (bookingRes.data?.data?.id) {
        bId = bookingRes.data.data.id;
      } else if (bookingRes.data?.data?.booking_id) {
        bId = bookingRes.data.data.booking_id;
      } else if (bookingRes.data?.id) {
        bId = bookingRes.data.id;
      } else if (bookingRes.data?.booking_id) {
        bId = bookingRes.data.booking_id;
      }

      if (!bId) {
        console.error("❌ Full booking response:", bookingRes.data);
        throw new Error("Booking ID not found in response");
      }

      console.log("🎯 Booking created with ID:", bId);
      setBookingId(bId);

      // STEP 2: Create VNPay payment URL
      console.log("💳 Creating payment URL for booking:", bId);
      const paymentRes = await axios.post(
        `${API_URL}/api/payments/vnpay/booking`,
        { booking_id: bId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const pUrl =
        paymentRes.data?.payment_url || paymentRes.data?.data?.payment_url;

      if (!pUrl) {
        console.error("❌ Payment URL not found in:", paymentRes.data);
        throw new Error("Payment URL not found");
      }

      console.log("🔗 Payment URL created:", pUrl);

      // STEP 3: Show modal with QR code
      setPaymentUrl(pUrl);
      setPaymentStatus("pending");
      setPaymentModalVisible(true);
      message.success("🎉 Booking created! Please scan QR to pay");

      console.log("💰 Booking created:", {
        bookingId: bId,
        paymentUrl: pUrl,
        totalAmount: calcTotal(),
      });

      // Bắt đầu check payment status ngay
      setTimeout(() => {
        if (bookingId && paymentStatus === "pending") {
          checkPaymentStatus(bId);
        }
      }, 1000);
    } catch (error: any) {
      console.error("💥 Booking error:", error);

      let errorMsg = "Booking failed";

      if (axios.isAxiosError(error)) {
        console.log("📡 Booking error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.response?.data?.error?.message) {
          errorMsg = error.response.data.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }

        if (error.response?.data?.error?.details) {
          console.error(
            "Validation errors:",
            error.response.data.error.details
          );
        }
      }

      message.error(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  // ===============================
  // CLOSE PAYMENT MODAL
  // ===============================
  const handlePaymentModalClose = () => {
    if (paymentStatus === "success") {
      message.success("Returning to homepage...");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } else {
      Modal.confirm({
        title: "Cancel Payment?",
        content: "Your booking is created but not paid yet. Cancel payment?",
        okText: "Yes, Cancel",
        cancelText: "Continue Payment",
        onOk: () => {
          setPaymentModalVisible(false);
          setPaymentStatus("pending");
        },
        onCancel: () => {
          // Người dùng chọn tiếp tục thanh toán
        },
      });
    }
  };

  // ===============================
  // AUTO REDIRECT AFTER SUCCESS
  // ===============================
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (paymentStatus === "success") {
      timer = setTimeout(() => {
        message.info("Auto-redirecting to homepage...");
        window.location.href = "/";
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [paymentStatus]);

  // ===============================
  // AUTO CANCEL PAYMENT SESSION AFTER 15 MINUTES
  // ===============================
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (paymentModalVisible && paymentStatus === "pending") {
      timeoutId = setTimeout(() => {
        Modal.confirm({
          title: "Phiên thanh toán hết hạn",
          content: "Đã quá 15 phút mà chưa thanh toán. Bạn muốn bắt đầu lại?",
          okText: "Bắt đầu lại",
          cancelText: "Đóng",
          onOk: () => {
            setPaymentModalVisible(false);
            setBookingId(null);
            setPaymentUrl("");
            setPaymentStatus("pending");
          },
        });
      }, 15 * 60 * 1000); // 15 phút
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [paymentModalVisible, paymentStatus]);

  // ===============================
  // HELPER FUNCTIONS
  // ===============================
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
          <div
            className={`booking-container ${step === 2 ? "step2-active" : ""}`}
          >
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
                <div className="confirm-booking-fixed-bar">
                  <div className="booking-summary-left">
                    <div className="booking-summary-label">Selected Rooms</div>
                    <div className="booking-summary-details">
                      {selectedRooms.map((room) => (
                        <span key={room.room_type_id}>
                          {room.room_type_name} × {room.quantity}
                          {selectedRooms.indexOf(room) <
                            selectedRooms.length - 1 && ", "}
                        </span>
                      ))}
                      <strong> • {getTotalRooms()} room(s)</strong>
                    </div>
                  </div>

                  <div className="booking-summary-right">
                    <div className="booking-total">
                      <div className="booking-total-label">Total</div>
                      <div className="booking-total-amount">
                        {calcTotal().toLocaleString()} ₫
                      </div>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleGoToConfirmation}
                      className="confirm-fixed-btn"
                    >
                      Confirm Booking
                    </Button>
                  </div>
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
                                room.room_type_image
                                  ? `${API_URL}/storage/${room.room_type_image}`
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
                              <Button disabled block>
                                Sold Out
                              </Button>
                            ) : currentQuantity > 0 ? (
                              <div className="quantity-controls">
                                <Button
                                  size="small"
                                  onClick={() =>
                                    handleAddRoom(room, currentQuantity - 1)
                                  }
                                  danger={currentQuantity === 1}
                                >
                                  {currentQuantity === 1 ? (
                                    <DeleteOutlined />
                                  ) : (
                                    "-"
                                  )}
                                </Button>
                                <span className="quantity-display">
                                  {currentQuantity}
                                </span>
                                <Button
                                  size="small"
                                  type="primary"
                                  disabled={currentQuantity >= room.available}
                                  onClick={() =>
                                    currentQuantity < room.available &&
                                    handleAddRoom(room, currentQuantity + 1)
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            ) : (
                              <Button
                                type="primary"
                                block
                                onClick={() => handleAddRoom(room, 1)}
                                className="add-room-btn"
                              >
                                Add to Booking
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* STEP 2 - CONFIRMATION */}
            {step === 2 && (
              <div className="confirmation-wrapper">
                {/* Header */}
                <div className="confirmation-header">
                  <h1 className="confirmation-title">Confirm Your Booking</h1>
                  <p className="confirmation-subtitle">
                    Please review your booking details below. Make sure all
                    information is correct before proceeding to payment.
                  </p>
                </div>

                <div className="confirmation-main">
                  {/* Left - Booking Details */}
                  <div className="confirmation-left">
                    <Card className="booking-details-card">
                      {/* User Info */}
                      <div className="user-info-banner">
                        <div className="user-avatar">
                          {user?.user_name?.[0]?.toUpperCase() ||
                            user?.email?.[0]?.toUpperCase() ||
                            "G"}
                        </div>
                        <div className="user-details">
                          <h4>Booking as: {user?.user_name || user?.email}</h4>
                          <p>Member ID: {userId}</p>
                        </div>
                      </div>

                      <h2 className="section-title">Stay Details</h2>

                      <div className="booking-info-grid">
                        <div className="info-card">
                          <div className="info-label">
                            <CalendarOutlined /> Check-in
                          </div>
                          <div className="info-value">
                            {filters.dates?.[0].format("dddd, DD MMMM YYYY")}
                          </div>
                          <div
                            className="info-subtext"
                            style={{
                              marginTop: "5px",
                              fontSize: "14px",
                              color: "#999",
                            }}
                          >
                            14:00 - 22:00
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-label">
                            <CalendarOutlined /> Check-out
                          </div>
                          <div className="info-value">
                            {filters.dates?.[1].format("dddd, DD MMMM YYYY")}
                          </div>
                          <div
                            className="info-subtext"
                            style={{
                              marginTop: "5px",
                              fontSize: "14px",
                              color: "#999",
                            }}
                          >
                            Before 12:00
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-label">
                            <ClockCircleOutlined /> Duration
                          </div>
                          <div className="info-value">
                            {getNights()} night(s)
                          </div>
                          <div
                            className="info-subtext"
                            style={{
                              marginTop: "5px",
                              fontSize: "14px",
                              color: "#999",
                            }}
                          >
                            {filters.dates?.[0].format("DD/MM")} -{" "}
                            {filters.dates?.[1].format("DD/MM/YYYY")}
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-label">
                            <UserOutlined /> Guests
                          </div>
                          <div className="info-value">
                            {filters.adults + filters.children} guest(s)
                          </div>
                          <div
                            className="info-subtext"
                            style={{
                              marginTop: "5px",
                              fontSize: "14px",
                              color: "#999",
                            }}
                          >
                            {filters.adults} adult(s), {filters.children}{" "}
                            child(ren)
                          </div>
                        </div>
                      </div>

                      <div className="selected-rooms-section">
                        <h2 className="section-title">Selected Rooms</h2>

                        <div className="selected-rooms-list">
                          {selectedRooms.map((room) => (
                            <div
                              key={room.room_type_id}
                              className="room-card-item"
                            >
                              <div className="room-info-left">
                                <img
                                  src={
                                    room.images?.[0]?.image_url
                                      ? `${API_URL}/storage/${room.images[0].image_url}`
                                      : "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                                  }
                                  className="room-image-small"
                                  alt={room.room_type_name}
                                />
                                <div className="room-details">
                                  <h4>{room.room_type_name}</h4>
                                  <p>
                                    <UserOutlined /> Max {room.maxGuests} guests
                                  </p>
                                  <p>
                                    <HomeOutlined /> {room.quantity} room(s) ×{" "}
                                    {getNights()} night(s)
                                  </p>
                                </div>
                              </div>

                              <div className="room-price-right">
                                <div className="room-price">
                                  {(
                                    room.price *
                                    room.quantity *
                                    getNights()
                                  ).toLocaleString()}{" "}
                                  ₫
                                </div>
                                <div
                                  className="room-price-breakdown"
                                  style={{ fontSize: "13px", color: "#999" }}
                                >
                                  {room.price.toLocaleString()} ₫ ×{" "}
                                  {room.quantity} × {getNights()}
                                </div>
                                <button
                                  className="remove-btn"
                                  onClick={() =>
                                    handleRemoveRoom(room.room_type_id)
                                  }
                                >
                                  <DeleteOutlined /> Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Right - Booking Summary */}
                  <div className="confirmation-right">
                    <Card className="summary-card">
                      <div className="summary-header">
                        <h3 className="summary-title">Booking Summary</h3>
                        <span className="summary-badge">STEP 2/3</span>
                      </div>

                      <div className="summary-content">
                        <div className="summary-item">
                          <span className="summary-label">Check-in</span>
                          <span className="summary-value">
                            {filters.dates?.[0].format("DD MMM YYYY")}
                          </span>
                        </div>

                        <div className="summary-item">
                          <span className="summary-label">Check-out</span>
                          <span className="summary-value">
                            {filters.dates?.[1].format("DD MMM YYYY")}
                          </span>
                        </div>

                        <div className="summary-item">
                          <span className="summary-label">Nights</span>
                          <span className="summary-value">
                            {getNights()} night(s)
                          </span>
                        </div>

                        <div className="summary-item">
                          <span className="summary-label">Guests</span>
                          <span className="summary-value">
                            {filters.adults + filters.children}
                          </span>
                        </div>

                        <div
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#666",
                              marginBottom: "10px",
                            }}
                          >
                            Room Charges
                          </div>
                          {selectedRooms.map((room) => (
                            <div
                              key={room.room_type_id}
                              className="summary-item"
                            >
                              <span className="summary-label">
                                {room.room_type_name} × {room.quantity}
                              </span>
                              <span className="summary-value">
                                {(
                                  room.price *
                                  room.quantity *
                                  getNights()
                                ).toLocaleString()}{" "}
                                ₫
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="summary-total-section">
                          {/* VOUCHER SECTION */}
                          <div style={{ marginBottom: 16 }}>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#666",
                                marginBottom: 6,
                                fontWeight: 500,
                              }}
                            >
                              Voucher Code
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                              <input
                                type="text"
                                placeholder="Enter voucher code"
                                value={voucherCode}
                                onChange={(e) =>
                                  setVoucherCode(e.target.value.toUpperCase())
                                }
                                style={{
                                  flex: 1,
                                  padding: "8px 10px",
                                  borderRadius: 6,
                                  border: "1px solid #d9d9d9",
                                }}
                              />

                              <Button
                                loading={voucherLoading}
                                type={voucherApplied ? "default" : "primary"}
                                onClick={() => {
                                  if (!voucherCode) {
                                    message.warning(
                                      "Please enter voucher code"
                                    );
                                    return;
                                  }
                                  setVoucherApplied(true);
                                  message.success(
                                    `Voucher "${voucherCode}" applied`
                                  );
                                }}
                              >
                                {voucherApplied ? "Applied" : "Apply"}
                              </Button>
                            </div>

                            <div
                              style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 4,
                              }}
                            >
                              Voucher will be validated at payment step
                            </div>
                          </div>

                          <div className="summary-total-row">
                            <div className="total-left">
                              <span className="total-label">Total Amount</span>

                              {voucherApplied && (
                                <span className="voucher-applied">
                                  ✓ Voucher <b>{voucherCode}</b> will be applied
                                  at checkout
                                </span>
                              )}
                            </div>

                            <span className="total-amount">
                              {calcTotal().toLocaleString()} ₫
                            </span>
                          </div>

                          <div className="summary-note">
                            <InfoCircleOutlined />
                            Your booking will be confirmed after successful
                            payment. Free cancellation up to 24 hours before
                            check-in.
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="fixed-booking-footer">
                  <div className="footer-content">
                    <div className="footer-left">
                      <button
                        className="back-to-rooms-btn"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeftOutlined /> Back to Rooms
                      </button>
                    </div>

                    <div className="footer-right">
                      <div className="footer-total">
                        <div className="footer-total-label">Total to Pay</div>
                        <div className="footer-total-amount">
                          {calcTotal().toLocaleString()} ₫
                        </div>
                      </div>

                      <button
                        className="confirm-booking-btn-final"
                        onClick={handleBooking}
                        disabled={
                          bookingLoading ||
                          !filters.dates ||
                          selectedRooms.length === 0
                        }
                      >
                        {bookingLoading ? (
                          <>
                            <LoadingOutlined /> Processing...
                          </>
                        ) : (
                          <>
                            Proceed to Payment <ArrowRightOutlined />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===============================
            PAYMENT MODAL WITH QR CODE
            =============================== */}
        <Modal
          open={paymentModalVisible}
          onCancel={handlePaymentModalClose}
          footer={null}
          width={600}
          centered
          maskClosable={false}
          closable={paymentStatus !== "pending"}
        >
          {paymentStatus === "pending" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Button
                  type="text"
                  onClick={() => setPaymentModalVisible(false)}
                  icon={<ArrowLeftOutlined />}
                >
                  Back to Booking
                </Button>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#666",
                  }}
                >
                  Booking #{bookingId}
                </span>
                <div style={{ width: 80 }}></div>
              </div>
              <h2
                style={{ marginBottom: 24, fontSize: 24, fontWeight: "bold" }}
              >
                Scan QR to Pay
              </h2>

              <Alert
                message="Please scan this QR code with your VNPay banking app"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 24,
                  padding: 20,
                  background: "#f5f5f5",
                  borderRadius: 12,
                }}
              >
                <QRCode value={paymentUrl} size={280} />
              </div>

              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Booking ID">
                  <strong>#{bookingId}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {calcTotal().toLocaleString()} ₫
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge status="processing" text="Pending Payment" />
                </Descriptions.Item>
              </Descriptions>

              {checkingPayment && (
                <div style={{ marginTop: 24 }}>
                  <Spin />
                  <p style={{ marginTop: 8, color: "#666" }}>
                    Checking payment status... (
                    {new Date().toLocaleTimeString()})
                  </p>
                </div>
              )}

              <div style={{ marginTop: 24 }}>
                <Button
                  type="link"
                  onClick={() => window.open(paymentUrl, "_blank")}
                  style={{ fontSize: 14 }}
                >
                  Or click here to pay in new tab →
                </Button>
              </div>

              <Alert
                message="Payment Status Check"
                description="This window will automatically check payment status every 3 seconds. Keep it open while completing payment."
                type="warning"
                showIcon
                style={{ marginTop: 24 }}
              />

              {/* Debug section - chỉ hiện trong development */}
              {process.env.NODE_ENV === "development" && (
                <div
                  style={{
                    marginTop: 20,
                    padding: 10,
                    background: "#f0f0f0",
                    borderRadius: 8,
                  }}
                >
                  <p style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>
                    Debug Info (Development only):
                  </p>
                  <Button
                    type="dashed"
                    size="small"
                    onClick={async () => {
                      if (!bookingId) return;
                      try {
                        const res = await axios.get(
                          `${API_URL}/api/bookings/${bookingId}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        console.log("📊 Debug API Response:", res.data);
                        message.info("Check console for API response");
                      } catch (error) {
                        console.error("❌ Debug API Error:", error);
                      }
                    }}
                  >
                    Check API Response
                  </Button>
                </div>
              )}
            </div>
          )}

          {paymentStatus === "success" && (
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              title="Payment Successful!"
              subTitle={`Your booking #${bookingId} has been confirmed and paid. You will be redirected to homepage in a few seconds.`}
              extra={[
                <Button
                  type="primary"
                  key="home"
                  size="large"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Go to Homepage Now
                </Button>,
                <Button
                  key="bookings"
                  onClick={() => {
                    window.location.href = "/client/my-bookings";
                  }}
                >
                  View My Bookings
                </Button>,
              ]}
            />
          )}

          {paymentStatus === "failed" && (
            <Result
              status="error"
              icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              title="Payment Failed or Cancelled"
              subTitle="Your payment could not be processed or booking was cancelled. Please try again or contact support."
              extra={[
                <Button
                  type="primary"
                  key="retry"
                  onClick={() => {
                    setPaymentModalVisible(false);
                    setPaymentStatus("pending");
                    handleBooking();
                  }}
                >
                  Try Again
                </Button>,
                <Button
                  key="home"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Go to Homepage
                </Button>,
              ]}
            />
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
}
