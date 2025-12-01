import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Card,
  Button,
  Spin,
  Alert,
  Empty,
  Modal,
  InputNumber,
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
import { useAuth } from "../../../protected-route";
dayjs.locale("vi");

const { RangePicker } = DatePicker;
const API_URL = "http://localhost:8000";

export default function ClientBooking() {
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [form] = Form.useForm();

  // Lấy thông tin user từ context/auth
  const { user, isAuthenticated } = useAuth(); // Giả sử bạn có AuthContext

  const [filters, setFilters] = useState({
    dates: null as any,
    adults: 1,
    children: 1,
    childAge: 5,
  });

  const [openGuestPopup, setOpenGuestPopup] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("me");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailRoom, setDetailRoom] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // ====== SERVICES STATE ======
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [serviceQuantities, setServiceQuantities] = useState<
    Record<number, number>
  >({});

  // ===============================
  // GET SERVICE IMAGE URL
  // ===============================
  const getImageUrl = (path: string) =>
    path
      ? `${API_URL}/storage/${path.replace(/^\/+/, "")}`
      : "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";

  // ===============================
  // FETCH SERVICES API (STEP 2)
  // ===============================
  useEffect(() => {
    axios
      .get(`${API_URL}/api/services`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const mapped = data.map((sv: any) => ({
          id: sv.service_id,
          name: sv.service_name,
          price: sv.service_price,
          image: sv.service_image,
          description: sv.description,
        }));
        setServices(mapped);
      })
      .catch(() => setServicesError("Không thể tải dịch vụ."))
      .finally(() => setServicesLoading(false));
  }, []);

  // ===============================
  // FILTER ROOMS (STEP 1)
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
      .catch((err) => {
        console.error(err);
        setRooms([]);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    if (step === 3) {
      const updated: Record<number, number> = { ...serviceQuantities };
      selectedServices.forEach((s) => {
        if (!updated[s.id]) updated[s.id] = 1;
      });
      setServiceQuantities(updated);
    }
  }, [step]);

  // ===============================
  // APPLY DISCOUNT
  // ===============================
  const applyDiscount = () => {
    if (discountCode === "GIAM10") {
      setDiscountAmount(1000000);
    } else if (discountCode === "VIP") {
      setDiscountAmount(5000000);
    } else {
      alert("Mã giảm giá không hợp lệ");
      setDiscountAmount(0);
    }
  };

  // ===============================
  // SELECT ROOM
  // ===============================
  const handleSelectRoom = (room: any) => {
    if (!filters.dates) {
      alert("Vui lòng chọn ngày trước!");
      return;
    }

    // Kiểm tra đăng nhập trước khi cho phép đặt phòng
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để đặt phòng!");
      // Có thể redirect đến trang login ở đây
      // navigate('/login');
      return;
    }

    setSelectedRoom(room);
    setStep(2);
    window.scrollTo(0, 0);
  };

  // ===============================
  // SERVICE FUNCTIONS
  // ===============================
  const toggleService = (sv: any) => {
    const exists = selectedServices.some((s) => s.id === sv.id);
    if (exists) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== sv.id));
      // Xóa quantity khi bỏ chọn
      setServiceQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[sv.id];
        return newQuantities;
      });
    } else {
      setSelectedServices((prev) => [...prev, sv]);
      // Set default quantity = 1 khi chọn
      setServiceQuantities((prev) => ({
        ...prev,
        [sv.id]: 1,
      }));
    }
  };

  const changeQuantity = (id: number, qty: number) => {
    setServiceQuantities((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  // ===============================
  // BOOKING FUNCTION - FIXED VERSION
  // ===============================
  const handleBooking = async (values: any) => {
    if (!selectedRoom || !filters.dates) {
      message.error("Vui lòng chọn phòng và ngày!");
      return;
    }

    // Kiểm tra đăng nhập
    if (!isAuthenticated || !user) {
      message.error("Vui lòng đăng nhập để đặt phòng!");
      // Có thể redirect đến trang login
      // navigate('/login');
      return;
    }

    setBookingLoading(true);

    try {
      // 1. TẠO BOOKING TRƯỚC (KHÔNG CÓ SERVICES)
      const bookingData = {
        user_id: user.user_id || user.id, // Lấy user_id từ user object
        check_in: filters.dates[0].format("YYYY-MM-DD"),
        check_out: filters.dates[1].format("YYYY-MM-DD"),
        guest_number: filters.adults + filters.children,
        room_type_ids: [selectedRoom.room_type_id],
        quantities: [1],
        customer_name: `${values.lastName} ${values.firstName}`,
        customer_phone: values.phone,
        customer_email: values.email,
        special_requests: values.specialRequests || "",
      };

      console.log("📦 Booking data:", bookingData);

      // Gọi API tạo booking
      const bookingResponse = await axios.post(
        `${API_URL}/api/bookings`,
        bookingData
      );
      const bookingId =
        bookingResponse.data.data?.booking_id ||
        bookingResponse.data.booking_id;

      console.log("✅ Booking created, ID:", bookingId);

      let servicesAdded = false;

      // 2. NẾU CÓ DỊCH VỤ ĐƯỢC CHỌN, THÊM SERVICES SAU KHI TẠO BOOKING
      if (selectedServices.length > 0 && bookingId) {
        try {
          // Tạo mảng services để gửi
          const servicesData = selectedServices.map((service) => ({
            service_id: service.id,
            quantity: serviceQuantities[service.id] || 1,
          }));

          console.log("🛎️ Services data to add:", servicesData);
          console.log(
            "🔗 API URL:",
            `${API_URL}/api/bookings/${bookingId}/add-services`
          );

          // 🚨 SỬA: DÙNG PUT METHOD THAY VÌ POST
          const serviceResponse = await axios.put(
            `${API_URL}/api/bookings/${bookingId}/add-services`,
            {
              services: servicesData,
            }
          );

          console.log("✅ Services added successfully:", serviceResponse.data);
          servicesAdded = true;
        } catch (serviceError: any) {
          console.error("❌ Failed to add services:", serviceError);
          console.error(
            "❌ Service error response:",
            serviceError.response?.data
          );

          // Hiển thị lỗi chi tiết
          const serviceErrorMessage =
            serviceError.response?.data?.message || serviceError.message;
          message.warning(
            `Đặt phòng thành công nhưng thêm dịch vụ thất bại: ${serviceErrorMessage}`
          );
        }
      }

      // 3. THÔNG BÁO THÀNH CÔNG
      if (servicesAdded) {
        message.success(
          "Đặt phòng và dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận."
        );
      } else if (selectedServices.length === 0) {
        message.success(
          "Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận."
        );
      } else {
        message.success(
          "Đặt phòng thành công! Dịch vụ sẽ được thêm sau khi xác nhận."
        );
      }

      // 4. RESET FORM VÀ TRỞ VỀ STEP 1
      setStep(1);
      setSelectedRoom(null);
      setSelectedServices([]);
      setServiceQuantities({});
      form.resetFields();
    } catch (error: any) {
      console.error("❌ Booking error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      message.error("Đặt phòng thất bại: " + errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  // ===============================
  // CALCULATION FUNCTIONS
  // ===============================
  const calcTotalServices = () => {
    return selectedServices.reduce((t, s) => {
      const qty = serviceQuantities[s.id] || 0;
      return t + Number(s.price) * qty;
    }, 0);
  };

  const calcTotal = () => {
    if (!selectedRoom || !filters.dates) return 0;

    const roomPrice = selectedRoom.price;
    const nights = filters.dates[1].diff(filters.dates[0], "days");
    const totalRoom = roomPrice * nights;
    const totalServices = calcTotalServices();

    return Math.max(totalRoom + totalServices - discountAmount, 0);
  };

  const getNights = () => {
    if (!filters.dates) return 0;
    return filters.dates[1].diff(filters.dates[0], "days");
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <ConfigProvider locale={viVN}>
      <div className="booking-page">
        {/* HERO BANNER*/}
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
                {/* DATE RANGE */}
                <div className="filter-item date-item">
                  <RangePicker
                    value={filters.dates}
                    onChange={(v) => setFilters({ ...filters, dates: v })}
                    className="date-range"
                    allowClear={false}
                    format={(value) => value.format("DD MMM")}
                    renderExtraFooter={() => "Nhấn để chọn ngày"}
                  />
                </div>

                {/* GUEST SELECT */}
                <div
                  className="filter-item guest-item"
                  onClick={() => setOpenGuestPopup(!openGuestPopup)}
                >
                  <span className="guest-label">
                    {filters.adults} người lớn, {filters.children} trẻ em
                  </span>
                  <DownOutlined className="arrow" />
                </div>

                {openGuestPopup && (
                  <div className="guest-popup">
                    <div className="room-title">Số người ở</div>
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
                      <span>Trẻ em dưới 12 tuổi</span>
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
                    {filters.children > 0 && (
                      <div className="age-row">
                        <span>Tuổi trẻ</span>
                        <select
                          value={filters.childAge}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              childAge: Number(e.target.value),
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((age) => (
                            <option key={age} value={age}>
                              {age} tuổi
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="popup-actions">
                      <button
                        className="done"
                        onClick={() => setOpenGuestPopup(false)}
                      >
                        Hoàn tất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BEST PRICE BAR */}
            <div className="best-price-box">
              <div className="best-price-left">
                <div className="best-title">ĐẶT PHÒNG Ở GIÁ TỐT NHẤT!</div>
                <div className="best-items">
                  <div className="bp-item">
                    <span className="bp-icon">✔</span> Đặt phòng trực tiếp
                  </div>
                  <div className="bp-item">
                    <span className="bp-icon">✔</span> Đảm bảo giá tốt nhất
                  </div>
                  <div className="bp-item">
                    <span className="bp-icon">✔</span> Dữ liệu được bảo mật
                  </div>
                </div>
              </div>
              <div className="best-price-right">
                <div className="best-label">Giá tốt nhất của chúng tôi</div>
                <div className="best-value">
                  {rooms.length > 0
                    ? Math.min(...rooms.map((r) => r.price)).toLocaleString()
                    : "0"}{" "}
                  ₫
                </div>
              </div>
            </div>

            {/* STEPS HEADER */}
            <div className="steps-header">
              {step > 1 ? (
                <button
                  className="steps-btn back"
                  onClick={() => setStep(step - 1)}
                >
                  ⟵ Quay lại
                </button>
              ) : (
                <div style={{ width: 80 }}></div>
              )}

              <div className="steps-title">
                {step === 1 && "Chọn phòng"}
                {step === 2 && "Dịch vụ"}
                {step === 3 && "Thông tin cá nhân"}
              </div>

              {step < 3 ? (
                <button
                  className="steps-btn next"
                  onClick={() => setStep(step + 1)}
                >
                  Tiếp tục đặt phòng ⟶
                </button>
              ) : (
                <div style={{ width: 120 }}></div>
              )}
            </div>

            <div className="steps-progress">
              <div
                className={`progress-bar ${
                  step === 1 ? "level-1" : step === 2 ? "level-2" : "level-3"
                }`}
              ></div>
            </div>

            {/* STEP 1 — CHỌN PHÒNG */}
            {step === 1 && (
              <>
                {loading ? (
                  <div className="loading">
                    <Spin size="large" />
                  </div>
                ) : rooms.length === 0 ? (
                  <Empty
                    description="Không có phòng phù hợp"
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  <div className="room-list-grid">
                    {rooms.map((room) => (
                      <Card className="room-card" key={room.room_type_id}>
                        <div className="room-img-wrap">
                          <img
                            src={
                              room.images?.[0]?.image_url
                                ? `${API_URL}/storage/${room.images[0].image_url}`
                                : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
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
                          <Button
                            className="detail-btn"
                            onClick={() => {
                              setDetailRoom(room);
                              setOpenDetail(true);
                            }}
                          >
                            Xem chi tiết
                          </Button>
                          {room.soldOut ? (
                            <Button disabled className="room-btn soldout">
                              Đã bán hết
                            </Button>
                          ) : (
                            <Button
                              className="room-btn"
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

            {/* STEP 2 — DỊCH VỤ THÊM */}
            {step === 2 && (
              <div className="card-box">
                <div className="container">
                  <p className="step2-sub">
                    (Chọn dịch vụ bạn muốn thêm vào phòng - có thể bỏ qua)
                  </p>
                  {servicesLoading ? (
                    <div className="loading">
                      <Spin size="large" />
                    </div>
                  ) : servicesError ? (
                    <Alert
                      message="Lỗi"
                      description={servicesError}
                      type="error"
                      showIcon
                    />
                  ) : services.length === 0 ? (
                    <Empty description="Chưa có dịch vụ nào" />
                  ) : (
                    <div className="addon-list-grid">
                      {services.map((service) => (
                        <div
                          className={`addon-card selectable ${
                            selectedServices.some((s) => s.id === service.id)
                              ? "active"
                              : ""
                          }`}
                          key={service.id}
                          onClick={() => toggleService(service)}
                        >
                          <img
                            src={getImageUrl(service.image)}
                            className="addon-img"
                            alt={service.name}
                          />
                          <div className="addon-content">
                            <h3 className="addon-title">
                              {service.name?.toUpperCase() || ""}
                            </h3>
                            <p className="addon-desc">{service.description}</p>
                            <p className="addon-price">
                              Từ {Number(service.price).toLocaleString()}₫
                            </p>
                            {selectedServices.some(
                              (s) => s.id === service.id
                            ) ? (
                              <button className="addon-selected">
                                Bỏ Chọn
                              </button>
                            ) : (
                              <button className="addon-btn">Thêm</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="step2-actions">
                    <Button type="primary" onClick={() => setStep(3)}>
                      Tiếp tục{" "}
                      {selectedServices.length > 0
                        ? `(${selectedServices.length} dịch vụ)`
                        : "(Không chọn dịch vụ)"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — THÔNG TIN KHÁCH HÀNG */}
            {step === 3 && (
              <div className="step3-wrapper">
                {/* LEFT SIDE – CUSTOMER INFO */}
                <div className="step3-left card-box">
                  <Form form={form} layout="vertical" onFinish={handleBooking}>
                    <h2 className="step-title">Khách hàng</h2>

                    <div className="booking-section">
                      <h3 className="label-title">Tôi đang đặt</h3>
                      <div className="booking-tabs">
                        <div
                          className={`tab ${
                            activeTab === "me" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("me")}
                        >
                          Cho tôi
                        </div>
                        <div
                          className={`tab ${
                            activeTab === "other" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("other")}
                        >
                          Cho người khác
                        </div>
                      </div>
                    </div>

                    <p className="sub-note">
                      Nhập thông tin của bạn để nhận phòng. Thông tin của các
                      khách khác có thể cung cấp lúc nhận phòng.
                    </p>

                    {/* Hiển thị thông tin user đã đăng nhập */}
                    {isAuthenticated && user && (
                      <div className="logged-in-user-info">
                        <Alert
                          message={`Bạn đang đặt phòng với tư cách: ${
                            user.name || user.email
                          }`}
                          type="info"
                          showIcon
                          style={{ marginBottom: 16 }}
                        />
                      </div>
                    )}

                    <div className="input-grid">
                      <Form.Item
                        name="firstName"
                        label="Tên"
                        rules={[
                          { required: true, message: "Vui lòng nhập tên" },
                        ]}
                        initialValue={user?.firstName || ""}
                      >
                        <Input placeholder="Nhập tên của bạn..." />
                      </Form.Item>
                      <Form.Item
                        name="lastName"
                        label="Họ"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ" },
                        ]}
                        initialValue={user?.lastName || ""}
                      >
                        <Input placeholder="Nhập họ đầy đủ của bạn..." />
                      </Form.Item>
                    </div>

                    <div className="input-grid">
                      <Form.Item
                        name="phone"
                        label="SĐT"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                        ]}
                        initialValue={user?.phone || ""}
                      >
                        <Input placeholder="Nhập số điện thoại liên hệ..." />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          {
                            required: true,
                            type: "email",
                            message: "Vui lòng nhập email hợp lệ",
                          },
                        ]}
                        initialValue={user?.email || ""}
                      >
                        <Input placeholder="Nhập địa chỉ email của bạn..." />
                      </Form.Item>
                    </div>

                    <Form.Item name="specialRequests" label="Thông tin bổ sung">
                      <Input.TextArea
                        placeholder="Nếu bạn có nhu cầu đặc biệt..."
                        rows={4}
                      />
                    </Form.Item>

                    <div className="booking-actions">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={bookingLoading}
                        size="large"
                        className="book-confirm-btn"
                      >
                        {bookingLoading
                          ? "Đang xử lý..."
                          : "Xác nhận đặt phòng"}
                      </Button>
                      <p className="booking-note">
                        * Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác
                        nhận đặt phòng
                      </p>
                    </div>
                  </Form>
                </div>

                {/* RIGHT SIDE – SUMMARY */}
                <div className="step3-right card-box">
                  <h3 className="summary-title">Đơn đặt phòng của tôi</h3>

                  {filters?.dates && (
                    <div className="summary-section">
                      <div className="date-detail">
                        <div>
                          <strong>Nhận phòng:</strong>{" "}
                          {filters.dates[0].format("DD MMM YYYY")}
                        </div>
                        <div>
                          <strong>Trả phòng:</strong>{" "}
                          {filters.dates[1].format("DD MMM YYYY")}
                        </div>
                      </div>
                      <div className="night-count">{getNights()} đêm</div>
                    </div>
                  )}

                  <div className="summary-item">
                    <span>Phòng:</span>
                    <strong>
                      {selectedRoom?.room_type_name || "Chưa chọn phòng"}
                    </strong>
                    <div className="price">
                      {selectedRoom ? selectedRoom.price.toLocaleString() : "0"}{" "}
                      ₫ / đêm
                    </div>
                  </div>

                  {selectedServices.length > 0 && (
                    <>
                      <span>Dịch vụ thêm:</span>
                      <br />
                      <br />
                      {selectedServices.map((s) => (
                        <div className="summary-item" key={s.id}>
                          <span>{s.name}</span>
                          <InputNumber
                            min={1}
                            value={serviceQuantities[s.id] || 1}
                            onChange={(v) =>
                              changeQuantity(s.id, Number(v || 1))
                            }
                            style={{ width: 60 }}
                          />
                          <strong>
                            {(
                              Number(s.price) * (serviceQuantities[s.id] || 1)
                            ).toLocaleString()}{" "}
                            ₫
                          </strong>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="summary-total-box">
                    <div className="summary-line">
                      <span>Tiền phòng ({getNights()} đêm)</span>
                      <strong>
                        {selectedRoom
                          ? (selectedRoom.price * getNights()).toLocaleString()
                          : "0"}{" "}
                        ₫
                      </strong>
                    </div>
                    {selectedServices.length > 0 && (
                      <div className="summary-line">
                        <span>Dịch vụ</span>
                        <strong>
                          {calcTotalServices().toLocaleString()} ₫
                        </strong>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="summary-line">
                        <span>Giảm giá</span>
                        <strong>-{discountAmount.toLocaleString()} ₫</strong>
                      </div>
                    )}
                    <div className="summary-total">
                      <span>Tổng thanh toán</span>
                      <strong>{calcTotal().toLocaleString()} ₫</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
