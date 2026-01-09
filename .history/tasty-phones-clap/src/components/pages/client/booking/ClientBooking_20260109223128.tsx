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
  // CHECK PAYMENT STATUS (CẬP NHẬT THEO STATUS CỦA BẠN)
  // ===============================
  const checkPaymentStatus = async (bId: number) => {
    try {
      setCheckingPayment(true);
      const res = await axios.get(`${API_URL}/api/bookings/${bId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const booking = res.data?.data || res.data;

      // Debug: Log để kiểm tra
      console.log("Payment status check:", {
        bookingId: bId,
        status: booking.status,
        data: booking,
      });

      // Danh sách các trạng thái được coi là thanh toán thành công
      // Theo constants của bạn: paid, check_in, check_out
      const paidStatuses = ["paid", "check_in", "check_out"];

      // Trạng thái hủy
      const canceledStatuses = ["canceled"];

      // Trạng thái chờ thanh toán
      const pendingStatus = "pending_payment";

      if (paidStatuses.includes(booking.status)) {
        setPaymentStatus("success");
        message.success("Payment successful! Redirecting to homepage...");

        // Tự động đóng modal và chuyển hướng sau 3 giây
        setTimeout(() => {
          setPaymentModalVisible(false);
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }, 3000);

        return true;
      }

      // Nếu booking đã bị hủy
      else if (canceledStatuses.includes(booking.status)) {
        setPaymentStatus("failed");
        message.error("Booking has been cancelled");
        return false;
      }

      // Nếu vẫn đang chờ thanh toán
      else if (booking.status === pendingStatus) {
        return false;
      }

      // Các trạng thái khác
      return false;
    } catch (error: any) {
      console.error("Check payment error:", error);

      // Xử lý lỗi chi tiết
      if (axios.isAxiosError(error)) {
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
          // Không hiển thị message để tránh làm phiền người dùng
        }
      }

      return false;
    } finally {
      setCheckingPayment(false);
    }
  };

  // ===============================
  // AUTO CHECK PAYMENT EVERY 3s (CẬP NHẬT VỚI XỬ LÝ LỖI)
  // ===============================
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (paymentModalVisible && bookingId && paymentStatus === "pending") {
      let errorCount = 0;
      const maxErrors = 5;

      interval = setInterval(async () => {
        try {
          await checkPaymentStatus(bookingId);
          errorCount = 0; // Reset error count on success
        } catch (error) {
          errorCount++;

          // Nếu có quá nhiều lỗi, dừng polling
          if (errorCount >= maxErrors) {
            console.warn(`Stopped payment polling after ${maxErrors} errors`);
            clearInterval(interval);

            // Thông báo cho người dùng
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
        room_types: selectedRooms.map((room) => ({
          room_type_id: room.room_type_id,
          quantity: room.quantity,
        })),
      };

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

      // Debug: Log response
      console.log("Booking Response:", bookingRes.data);

      // Lấy booking ID từ response (theo cấu trúc API của bạn)
      const bId =
        bookingRes.data?.data?.id ||
        bookingRes.data?.data?.booking_id ||
        bookingRes.data?.id;

      if (!bId) {
        console.error("Full booking response:", bookingRes.data);
        throw new Error("Booking ID not found in response");
      }

      setBookingId(bId);

      // STEP 2: Create VNPay payment URL
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

      const pUrl = paymentRes.data?.payment_url;

      if (!pUrl) {
        throw new Error("Payment URL not found");
      }

      // STEP 3: Show modal with QR code
      setPaymentUrl(pUrl);
      setPaymentStatus("pending");
      setPaymentModalVisible(true);
      message.success("Booking created! Please scan QR to pay");

      // Log để debug
      console.log("Booking created:", {
        bookingId: bId,
        paymentUrl: pUrl,
        totalAmount: calcTotal(),
      });
    } catch (error: any) {
      console.error("Booking error:", error);

      let errorMsg = "Booking failed";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.response?.data?.error?.message) {
          errorMsg = error.response.data.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }

        // Hiển thị chi tiết validation errors nếu có
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
      // Nếu đã thanh toán thành công, chuyển về trang chủ
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
      // Tự động chuyển hướng sau 5 giây nếu người dùng không tương tác
      timer = setTimeout(() => {
        message.info("Auto-redirecting to homepage...");
        window.location.href = "/";
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [paymentStatus]);

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
  // FORMAT STATUS FOR DISPLAY
  // ===============================
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_payment: "Pending Payment",
      paid: "Paid",
      check_in: "Checked In",
      check_out: "Checked Out",
      canceled: "Cancelled",
    };

    return statusMap[status] || status;
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
                                  onClick={() =>
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
                <div className="confirmation-main">
                  <div className="confirmation-left">
                    <Card className="booking-details-card">
                      <h2 className="section-title">Booking Details</h2>

                      {isAuthenticated && user && (
                        <Alert
                          message={`Booking as: ${
                            user.user_name || user.email
                          }`}
                          type="info"
                          showIcon
                          style={{ marginBottom: 24 }}
                        />
                      )}

                      <div className="booking-info">
                        <div className="info-row">
                          <span className="label">Check-in</span>
                          <span className="value">
                            {filters.dates?.[0].format("dddd, DD MMMM YYYY")}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Check-out</span>
                          <span className="value">
                            {filters.dates?.[1].format("dddd, DD MMMM YYYY")}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Duration</span>
                          <span className="value">{getNights()} night(s)</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Guests</span>
                          <span className="value">
                            {filters.adults} adult(s)
                            {filters.children > 0 &&
                              `, ${filters.children} child(ren)`}
                          </span>
                        </div>
                      </div>

                      <h3 className="subsection-title">Selected Rooms</h3>
                      <div className="selected-rooms-list">
                        {selectedRooms.map((room) => (
                          <div
                            key={room.room_type_id}
                            className="selected-room-item"
                          >
                            <div className="room-info">
                              <div className="room-name">
                                {room.room_type_name}
                              </div>
                              <div className="room-calc">
                                {room.price.toLocaleString()} ₫ ×{" "}
                                {room.quantity} room(s) × {getNights()} night(s)
                              </div>
                            </div>
                            <div className="room-total">
                              {(
                                room.price *
                                room.quantity *
                                getNights()
                              ).toLocaleString()}{" "}
                              ₫
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  handleRemoveRoom(room.room_type_id)
                                }
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="total-section">
                        <div className="total-label">Total Amount</div>
                        <div className="total-amount">
                          {calcTotal().toLocaleString()} ₫
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="confirmation-right">
                    <Card className="summary-card">
                      <h3 className="summary-title">Booking Summary</h3>
                      <div className="summary-item">
                        <span>Dates</span>
                        <span>
                          {filters.dates?.[0].format("DD/MM/YYYY")} →{" "}
                          {filters.dates?.[1].format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span>Stay</span>
                        <span>{getNights()} night(s)</span>
                      </div>
                      <div className="summary-item">
                        <span>Guests</span>
                        <span>
                          {filters.adults + filters.children} guest(s)
                        </span>
                      </div>
                      <hr />
                      {selectedRooms.map((room) => (
                        <div key={room.room_type_id} className="summary-room">
                          <span>
                            {room.room_type_name} × {room.quantity}
                          </span>
                          <span>
                            {(
                              room.price *
                              room.quantity *
                              getNights()
                            ).toLocaleString()}{" "}
                            ₫
                          </span>
                        </div>
                      ))}
                      <hr />
                      <div className="summary-total">
                        <span>Total</span>
                        <span className="total-price">
                          {calcTotal().toLocaleString()} ₫
                        </span>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Fixed footer with Confirm button */}
                <div className="fixed-booking-footer">
                  <div className="footer-content">
                    <div>
                      <div className="footer-total-label">Total</div>
                      <div className="footer-total-amount">
                        {calcTotal().toLocaleString()} ₫
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      loading={bookingLoading}
                      onClick={handleBooking}
                      className="confirm-booking-btn"
                      disabled={!filters.dates || selectedRooms.length === 0}
                    >
                      {bookingLoading
                        ? "Creating Booking..."
                        : "Confirm Booking"}
                    </Button>
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
                    handleBooking(); // Thử lại booking
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
