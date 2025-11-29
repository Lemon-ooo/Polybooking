import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Card,
  Button,
  Spin,
  Row,
  Col,
  Alert,
  Empty,
  Modal,
  InputNumber,
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
const API_URL = "http://localhost:8000/storage/";

// COMPONENT
export default function ClientBooking() {
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

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

  // ====== SERVICES STATE ======
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  // quantities per service id
  const [serviceQuantities, setServiceQuantities] = useState<
    Record<number, number>
  >({});

  // ===============================
  // GET SERVICE IMAGE URL
  // ===============================
  const getImageUrl = (path: string) =>
    path
      ? `http://localhost:8000/storage/${path.replace(/^\/+/, "")}`
      : "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";

  // ===============================
  // FETCH SERVICES API (STEP 2)
  // ===============================
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/services")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        // map lại key để code hiện tại vẫn dùng được
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
      .get("http://localhost:8000/api/room-types")
      .then((res) => {
        const data = res.data?.data || [];

        // Lọc theo số lượng khách
        const filtered = data.filter(
          (room: any) => room.max_guests >= totalGuests
        );

        // Map dữ liệu để component dễ dùng
        const mappedRooms = filtered.map((room: any) => ({
          room_type_id: room.room_type_id,
          room_type_name: room.room_type_name,
          room_type_image: room.room_type_image,
          price: Number(room.base_price),
          maxGuests: room.max_guests,
          description: room.description,
          images: room.images || [],
          soldOut: room.total_rooms === 0, // đánh dấu hết phòng
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
      setDiscountAmount(1000000); // ví dụ giảm 1 triệu
    } else if (discountCode === "VIP") {
      setDiscountAmount(5000000); // 5 triệu
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

    setSelectedRoom(room);
    setStep(2);
    window.scrollTo(0, 0);
  };

  // toggle service selection, set default qty = 1 when selecting
  const toggleService = (sv: any) => {
    const exists = selectedServices.some((s) => s.id === sv.id);

    if (exists) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== sv.id));
      // không xóa quantity nữa -> xóa ở step 3 nếu muốn
    } else {
      setSelectedServices((prev) => [...prev, sv]);
      // ❌ Không set số lượng tại Step 2
    }
  };

  const changeQuantity = (id: number, qty: number) => {
    setServiceQuantities((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  // ===============================
  // CHANGE STEP → AUTO SCROLL
  // ===============================
  const goStep = (s: number) => {
    setStep(s);
  };

  // ===============================
  // helper totals
  // ===============================
  const calcTotalServices = () => {
    return selectedServices.reduce((t, s) => {
      const qty = serviceQuantities[s.id] || 0;
      return t + Number(s.price) * qty;
    }, 0);
  };
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "card">("bank");

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
                  onClick={() => goStep(step - 1)}
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
                  onClick={() => goStep(step + 1)}
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
                                ? `${API_URL}${room.images[0].image_url}`
                                : room.room_type_image
                                ? `${API_URL}${room.room_type_image}`
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

            {/* DETAIL MODAL */}
            <Modal
              open={openDetail}
              footer={null}
              width={1100}
              onCancel={() => setOpenDetail(false)}
              className="room-detail-modal"
            >
              {detailRoom && (
                <div className="detail-wrapper">
                  <h2 className="detail-title">{detailRoom.room_type_name}</h2>

                  <img
                    src={
                      detailRoom.room_type_image
                        ? `${API_URL}${detailRoom.room_type_image}`
                        : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
                    }
                    className="detail-img"
                    alt=""
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop")
                    }
                  />

                  <div className="detail-info">
                    <div className="left">
                      <p>
                        <strong>Sức chứa:</strong> {detailRoom.maxGuests} khách
                      </p>
                      <p>
                        <strong>Mô tả: </strong>
                        {detailRoom.description ||
                          "Không gian hiện đại, đầy đủ tiện nghi."}
                      </p>
                    </div>

                    <div className="right">
                      <div className="room-price-box">
                        <div className="price">
                          {detailRoom.price.toLocaleString()} ₫
                        </div>
                        <div className="night">/ 1 đêm</div>
                      </div>

                      <Button
                        type="primary"
                        size="large"
                        className="select-room-btn"
                        onClick={() => {
                          handleSelectRoom(detailRoom);
                          setOpenDetail(false);
                        }}
                      >
                        Chọn phòng này
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Modal>

            {/* STEP 2 — DỊCH VỤ THÊM */}
            {step === 2 && (
              <div className="card-box">
                <div className="container">
                  <p className="step2-sub">
                    (Chọn dịch vụ bạn muốn thêm vào phòng)
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
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
                            }}
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
                </div>
              </div>
            )}

            {/* STEP 3 — THÔNG TIN KHÁCH HÀNG */}
            {step === 3 && (
              <div className="step3-wrapper">
                {/* LEFT SIDE – CUSTOMER INFO */}
                <div className="step3-left card-box">
                  <h2 className="step-title">Khách hàng</h2>

                  {/* Tabs */}
                  <div className="booking-section">
                    <h3 className="label-title">Tôi đang đặt</h3>

                    <div className="booking-tabs">
                      <div
                        className={`tab ${activeTab === "me" ? "active" : ""}`}
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
                  <br />
                  <p className="sub-note">
                    Nhập thông tin của bạn để nhận phòng. Thông tin của các
                    khách khác có thể cung cấp lúc nhận phòng.
                  </p>

                  {/* FORM */}
                  <div className="input-grid">
                    <div className="input-field">
                      <label>Tên</label>
                      <input placeholder="Nhập tên của bạn..." />
                    </div>

                    <div className="input-field">
                      <label>Họ</label>
                      <input placeholder="Nhập họ đầy đủ của bạn..." />
                    </div>
                  </div>

                  <div className="input-grid">
                    <div className="input-field icon-left">
                      <label>SĐT</label>
                      <input placeholder="Nhập số điện thoại liên hệ..." />
                    </div>

                    <div className="input-field icon-left">
                      <label>Email</label>
                      <input placeholder="Nhập địa chỉ email của bạn..." />
                    </div>
                  </div>

                  {/* CHECKBOX */}
                  <div className="checkbox-line">
                    <input type="checkbox" /> Tôi đồng ý nhận các ưu đãi đặc
                    biệt và tin tức
                  </div>
                  <div className="checkbox-line">
                    <input type="checkbox" /> Tôi đồng ý xử lý dữ liệu cá nhân
                    theo chính sách bảo mật
                  </div>
                  <br />
                  {/* Additional Info */}
                  <h3 className="label-title">Thông tin bổ sung</h3>
                  <div className="input-field">
                    <textarea placeholder="Nếu bạn có nhu cầu đặc biệt..." />
                  </div>
                  <br />
                  {/* Payment Method */}
                  <h3 className="label-title">Chọn hình thức thanh toán</h3>

                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                      />
                      Chuyển khoản
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      Thẻ tín dụng / Ghi nợ
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                        alt="VISA"
                        className="card-logo"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="card-logo"
                      />
                    </label>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethod === "card" && (
                    <div className="card-payment-form">
                      <div className="input-field">
                        <label>Số thẻ*</label>
                        <input type="text" placeholder="1234 5678 9101 1234" />
                      </div>

                      <div className="input-grid">
                        <div className="input-field small">
                          <label>Tháng/Năm hết hạn*</label>
                          <input type="text" placeholder="12/25" />
                        </div>
                        <div className="input-field small">
                          <label>CSC*</label>
                          <input type="password" placeholder="123" />
                        </div>
                      </div>

                      <div className="input-field">
                        <label>Tên in trên thẻ (không dấu)*</label>
                        <input type="text" placeholder="NGUYEN VAN A" />
                      </div>

                      <div className="input-field">
                        <label>Email*</label>
                        <input type="email" placeholder="name@email.com" />
                        <label className="checkbox-inline">
                          <input type="checkbox" /> Không sử dụng email
                        </label>
                      </div>

                      <div className="checkbox-line">
                        <input type="checkbox" /> Tôi đã đọc, hiểu rõ và đồng ý
                        với{" "}
                        <a href="#">
                          Chính sách bảo vệ và xử lý dữ liệu cá nhân
                        </a>
                      </div>

                      <button type="button" className="pay-btn">
                        Thanh toán
                      </button>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === "bank" && (
                    <div className="bank-transfer-info">
                      <p>Vui lòng chuyển khoản vào tài khoản dưới đây:</p>
                      <ul>
                        <li>
                          <strong>Ngân hàng:</strong> Ngân hàng XYZ
                        </li>
                        <li>
                          <strong>Số tài khoản:</strong> 123456789
                        </li>
                        <li>
                          <strong>Chủ tài khoản:</strong> Công ty ABC
                        </li>
                      </ul>
                      <p>
                        Sau khi chuyển khoản, vui lòng gửi xác nhận qua email
                        hoặc số điện thoại liên hệ.
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE – SUMMARY */}
                <div className="step3-right card-box">
                  <h3 className="summary-title">Đơn đặt phòng của tôi</h3>

                  {/* Dates & Nights */}
                  {filters?.dates && (
                    <div className="summary-section">
                      <div className="date-detail">
                        <div>
                          <strong>Nhận phòng:</strong>{" "}
                          {filters.dates[0].format("DD MMM YYYY")}
                        </div>
                        <br />
                        <div>
                          <strong>Trả phòng:</strong>{" "}
                          {filters.dates[1].format("DD MMM YYYY")}
                        </div>
                      </div>
                      <div className="night-count">
                        {filters.dates[1].diff(filters.dates[0], "days") + 1}{" "}
                        ngày • {filters.dates[1].diff(filters.dates[0], "days")}{" "}
                        đêm
                      </div>
                    </div>
                  )}

                  {/* Room */}
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

                  {/* Services */}
                  <span>Dịch vụ thêm:</span>
                  <br />
                  <br />
                  {selectedServices.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
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
                    </div>
                  )}

                  {/* Discount */}
                  <div className="discount-box">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá..."
                      className="discount-input"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button type="default" onClick={applyDiscount}>
                      Áp dụng
                    </Button>
                  </div>

                  {discountAmount > 0 && (
                    <div className="summary-item">
                      <span>Giảm giá:</span>
                      <div className="discount">
                        -{discountAmount.toLocaleString()} ₫
                      </div>
                    </div>
                  )}

                  {/* TOTAL */}
                  {(() => {
                    const roomPrice = selectedRoom ? selectedRoom.price : 0;
                    const nights = filters?.dates
                      ? filters.dates[1].diff(filters.dates[0], "days")
                      : 0;
                    const totalRoom = roomPrice * nights;
                    const totalServices = calcTotalServices();
                    const total = Math.max(
                      totalRoom + totalServices - discountAmount,
                      0
                    );

                    return (
                      <div className="summary-total-box">
                        <div className="summary-line">
                          <span>Tiền phòng ({nights} đêm)</span>
                          <strong>{totalRoom.toLocaleString()} ₫</strong>
                        </div>
                        <div className="summary-line">
                          <span>Dịch vụ</span>
                          <strong>{totalServices.toLocaleString()} ₫</strong>
                        </div>
                        {discountAmount > 0 && (
                          <div className="summary-line">
                            <span>Giảm giá</span>
                            <strong>
                              -{discountAmount.toLocaleString()} ₫
                            </strong>
                          </div>
                        )}
                        <div className="summary-total">
                          <span>Tổng thanh toán</span>
                          <strong>{total.toLocaleString()} ₫</strong>
                        </div>
                      </div>
                    );
                  })()}

                  <Button
                    type="primary"
                    className="book-btn"
                    disabled={!selectedRoom || !filters?.dates}
                  >
                    Đặt phòng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
