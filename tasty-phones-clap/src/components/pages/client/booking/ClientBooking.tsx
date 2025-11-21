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
// FAKE DATA PHÒNG
const fakeRooms = [
  {
    id: 1,
    name: "Phòng Suite La Belle",
    price: 850000, // 850.000đ / đêm
    maxGuests: 3,
    size: 36,
    images: [
      "https://ruedelamourhotel.com/wp-content/uploads/2025/05/QTX09567-copy-scaled.jpg",
    ],
  },
  {
    id: 2,
    name: "Phòng Suite L'Amour",
    price: 750000, // 750.000đ / đêm
    maxGuests: 2,
    size: 46,
    images: [
      "https://ruedelamourhotel.com/wp-content/uploads/2025/05/QTX09567-copy-scaled.jpg",
    ],
  },
  {
    id: 3,
    name: "Phòng Deluxe",
    price: 650000, // 650.000đ / đêm
    maxGuests: 2,
    size: 28,
    soldOut: true,
    images: [
      "https://ruedelamourhotel.com/wp-content/uploads/2025/05/QTX09567-copy-scaled.jpg",
    ],
  },
];

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
  const getImageUrl = (path: string) => {
    if (!path)
      return "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // ===============================
  // FETCH SERVICES API (STEP 2)
  // ===============================
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/services")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setServices(data);
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

    setTimeout(() => {
      const filtered = fakeRooms.filter(
        (room) => room.maxGuests >= totalGuests
      );
      setRooms(filtered);
      setLoading(false);
    }, 500);
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
                  {Math.min(...fakeRooms.map((r) => r.price)).toLocaleString()}{" "}
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
                ) : (
                  <div className="room-list-grid">
                    {rooms.map((room) => (
                      <Card className="room-card" key={room.id}>
                        <div className="room-img-wrap">
                          <img
                            src={room.images[0]}
                            className="room-img"
                            alt={room.name}
                          />
                          {room.soldOut && (
                            <div className="soldout-badge">Hết phòng</div>
                          )}
                        </div>

                        <h3 className="room-title">{room.name}</h3>

                        <p className="room-desc">
                          Sức chứa: {room.maxGuests} khách • {room.size} m²
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
                  <h2 className="detail-title">{detailRoom.name}</h2>

                  <img
                    src={detailRoom.images[0]}
                    className="detail-img"
                    alt=""
                  />

                  <div className="detail-info">
                    <div className="left">
                      <p>
                        <strong>Sức chứa:</strong> {detailRoom.maxGuests} khách
                      </p>
                      <p>
                        <strong>Diện tích:</strong> {detailRoom.size} m²
                      </p>
                      <p>
                        <strong>Mô tả: </strong>Không gian hiện đại, đầy đủ tiện
                        nghi, phù hợp cho các cặp đôi và gia đình.
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
                      {services.map((sv) => (
                        <div
                          className={`addon-card selectable ${
                            selectedServices.some((s) => s.id === sv.id)
                              ? "active"
                              : ""
                          }`}
                          key={sv.id}
                          onClick={() => toggleService(sv)}
                        >
                          <img
                            src={getImageUrl(sv.image)}
                            className="addon-img"
                            alt={sv.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
                            }}
                          />

                          <div className="addon-content">
                            <h3 className="addon-title">
                              {sv.name.toUpperCase()}
                            </h3>
                            <p className="addon-desc">{sv.description}</p>

                            <p className="addon-price">
                              Từ {Number(sv.price).toLocaleString()}₫
                            </p>

                            {selectedServices.some((s) => s.id === sv.id) ? (
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

            {step === 3 && (
              <div className="step3-wrapper">
                {/* LEFT SIDE – CUSTOMER INFO */}
                <div className="step3-left card-box">
                  <h2 className="step-title">Khách hàng</h2>

                  {/* Tabs */}
                  <div className="booking-section">
                    <span className="label-title">Tôi đang đặt</span>

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

                  <p className="sub-note">
                    Nhập thông tin của bạn để nhận phòng. Thông tin của các
                    khách khác có thể cung cấp lúc nhận phòng.
                  </p>

                  {/* FORM – FIRST ROW */}
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

                  {/* FORM – SECOND ROW */}
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

                  {/* Additional Info */}
                  <h3 className="section-title">Thông tin bổ sung</h3>

                  <div className="input-field">
                    <label>Yêu cầu cá nhân</label>
                    <textarea placeholder="Nếu bạn có bất kỳ nhu cầu đặc biệt nào, xin vui lòng chia sẻ với chúng tôi. Chúng tôi sẽ cố gắng hết sức để hỗ trợ bạn..." />
                  </div>

                  {/* Payment */}
                  <h3 className="section-title">Đảm bảo bằng thẻ ngân hàng</h3>
                  <div className="input-field">
                    <label>Yêu cầu cá nhân</label>
                    <textarea
                      placeholder={`Tổng số tiền phải được thanh toán đầy đủ.\nBạn cung cấp thông tin thẻ tín dụng của mình để khách sạn tiến hành thanh toán đơn đặt phòng cũng như gửi cho bạn xác nhận đặt phòng...`}
                    />
                  </div>
                </div>

                {/* RIGHT SIDE – SUMMARY */}
                <div className="step3-right card-box">
                  <h3 className="summary-title">Đơn đặt phòng của tôi</h3>

                  {/* TÍNH NGÀY – ĐÊM */}
                  {(() => {
                    if (!filters?.dates) return null;

                    const start = filters.dates[0];
                    const end = filters.dates[1];

                    const nights = end.diff(start, "days"); // số đêm
                    const days = nights + 1; // số ngày

                    return (
                      <div className="summary-section">
                        <div className="date-detail">
                          <div>
                            <strong>Nhận phòng:</strong>{" "}
                            {start.format("DD MMM YYYY")}
                          </div>
                          <div>
                            <strong>Trả phòng:</strong>{" "}
                            {end.format("DD MMM YYYY")}
                          </div>
                        </div>

                        <div className="night-count">
                          {days} ngày • {nights} đêm
                        </div>
                      </div>
                    );
                  })()}

                  {/* PHÒNG */}
                  <div className="summary-item">
                    <span>Phòng:</span>
                    <strong>{selectedRoom?.name || "Chưa chọn phòng"}</strong>

                    <div className="price">
                      {selectedRoom ? selectedRoom.price.toLocaleString() : "0"}{" "}
                      ₫ / đêm
                    </div>
                  </div>

                  {/* DỊCH VỤ CHI TIẾT */}
                  {selectedServices.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      {selectedServices.map((s) => (
                        <div className="summary-item" key={s.id}>
                          <span>{s.name}</span>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <InputNumber
                              min={1}
                              value={serviceQuantities[s.id] || 1}
                              onChange={(v) =>
                                changeQuantity(s.id, Number(v || 1))
                              }
                              style={{ width: 60 }}
                            />
                          </div>

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

                  {/* TỔNG DỊCH VỤ */}
                  <div className="summary-item">
                    <span>Dịch vụ thêm:</span>
                    <strong>{calcTotalServices().toLocaleString()} ₫</strong>
                  </div>

                  {/* MÃ GIẢM GIÁ */}
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

                  {/* TỔNG TIỀN */}
                  {(() => {
                    const roomPrice = selectedRoom ? selectedRoom.price : 0;
                    const nights = filters?.dates
                      ? filters.dates[1].diff(filters.dates[0], "days")
                      : 0;
                    const totalRoom = roomPrice * nights;
                    const totalServices = calcTotalServices();
                    const total = totalRoom + totalServices - discountAmount;

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
