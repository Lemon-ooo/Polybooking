import React, { useState, useEffect } from "react";
import { Button, InputNumber, ConfigProvider, message } from "antd";
import axios from "axios";

const API = "http://localhost:8000/api";

export default function ClientBooking() {
  const USER_ID = 12; // lấy từ auth trong dự án thực tế

  // Step control
  const [step, setStep] = useState(1);

  // Step 1 state
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestNumber, setGuestNumber] = useState(1);

  // Booking ID
  const [bookingId, setBookingId] = useState(null);

  // Step 2 state
  const [services, setServices] = useState([]);
  const [serviceQuantities, setServiceQuantities] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);

  // Step 3 state
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Fetch room types + services
  useEffect(() => {
    axios.get(`${API}/room-types`).then((res) => setRoomTypes(res.data));
    axios.get(`${API}/services`).then((res) => setServices(res.data));
  }, []);

  // ------------------------------
  // STEP 1 → CREATE BOOKING
  // ------------------------------
  const createBooking = async () => {
    if (!selectedRoom) return message.error("Hãy chọn phòng!");

    try {
      const res = await axios.post(`${API}/bookings`, {
        user_id: USER_ID,
        check_in: checkIn,
        check_out: checkOut,
        guest_number: guestNumber,
        room_type_ids: [selectedRoom.id],
        quantities: [quantity],
      });

      setBookingId(res.data.booking.id);
      message.success("Tạo booking thành công!");
      setStep(2);
    } catch (err) {
      console.log(err);
      message.error("Lỗi tạo booking!");
    }
  };

  // ------------------------------
  // STEP 2 → ADD SERVICES
  // ------------------------------
  const confirmServices = async () => {
    if (!bookingId) return;

    const payload = selectedServices.map((sv) => ({
      service_id: sv.id,
      quantity: serviceQuantities[sv.id] || 1,
    }));

    try {
      await axios.post(`${API}/bookings/${bookingId}/services`, {
        services: payload,
      });

      message.success("Thêm dịch vụ thành công!");
      setStep(3);
    } catch (err) {
      console.log(err);
      message.error("Lỗi thêm dịch vụ!");
    }
  };

  // ------------------------------
  // STEP 3 → CONFIRM PAYMENT
  // ------------------------------
  const finishPayment = async () => {
    const totalAmount =
      selectedRoom.price * quantity +
      selectedServices.reduce(
        (t, sv) => t + sv.price * (serviceQuantities[sv.id] || 1),
        0
      ) -
      discountAmount;

    try {
      await axios.post(`${API}/bookings/${bookingId}/confirm-payment`, {
        amount: totalAmount,
        payment_method: paymentMethod,
      });

      message.success("Thanh toán thành công!");
      setStep(1); // reset flow
    } catch (err) {
      console.log(err);
      message.error("Thanh toán thất bại!");
    }
  };

  // ------------------------------
  // RENDER UI
  // ------------------------------
  return (
    <ConfigProvider
      theme={{
        token: { fontSize: 16, colorPrimary: "#d4a056" },
      }}
    >
      <div className="booking-container">
        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2>Chọn phòng</h2>

            {roomTypes.map((room) => (
              <div
                key={room.id}
                className={`room-box ${
                  selectedRoom?.id === room.id ? "active" : ""
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <h3>{room.room_type_name}</h3>
                <p>Giá: {room.base_price}₫ / đêm</p>
              </div>
            ))}

            <div className="mt-3">
              <label>Ngày nhận</label>
              <input type="date" onChange={(e) => setCheckIn(e.target.value)} />
              <label>Ngày trả</label>
              <input
                type="date"
                onChange={(e) => setCheckOut(e.target.value)}
              />

              <label>Khách</label>
              <InputNumber
                min={1}
                value={guestNumber}
                onChange={setGuestNumber}
              />

              <label>Số lượng phòng</label>
              <InputNumber min={1} value={quantity} onChange={setQuantity} />
            </div>

            <Button type="primary" className="mt-3" onClick={createBooking}>
              Tiếp tục
            </Button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2>Chọn dịch vụ</h2>

            {services.map((sv) => (
              <div key={sv.id} className="service-box">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedServices([...selectedServices, sv]);
                    else
                      setSelectedServices(
                        selectedServices.filter((x) => x.id !== sv.id)
                      );
                  }}
                />
                <span>
                  {sv.name} – {sv.price}₫
                </span>

                {selectedServices.find((x) => x.id === sv.id) && (
                  <InputNumber
                    min={1}
                    value={serviceQuantities[sv.id] || 1}
                    onChange={(v) =>
                      setServiceQuantities({
                        ...serviceQuantities,
                        [sv.id]: v,
                      })
                    }
                  />
                )}
              </div>
            ))}

            <Button type="primary" className="mt-3" onClick={confirmServices}>
              Tiếp tục
            </Button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2>Thanh toán</h2>

            <div>
              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Tiền mặt
              </label>

              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                Chuyển khoản
              </label>

              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Thẻ
              </label>
            </div>

            <label>Mã giảm giá</label>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />

            <Button type="primary" className="mt-3" onClick={finishPayment}>
              Xác nhận
            </Button>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}
