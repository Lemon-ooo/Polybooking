// src/components/pages/client/bookings/BookingDetail.tsx

import React, { useEffect, useState } from "react";
import { Card, Spin, Tag, Table, Button, message, InputNumber } from "antd";
import {
  CalendarOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const statusColors: any = {
  pending: "orange",
  pending_payment: "orange",
  confirmed: "green",
  cancelled: "red",
  completed: "blue",
};

const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const navigate = useNavigate();

<<<<<<< HEAD
  const isEditable =
    booking?.status === "pending" || booking?.status === "confirmed";

  // ================== LOAD BOOKING DETAIL ==================
=======
  const formatDate = (d: string) => dayjs(d).format("DD/MM/YYYY");

>>>>>>> lamtangthanh
  const fetchDetail = async () => {
    try {
      const res = await axiosInstance.get(`/bookings/${id}`);
      setBooking(res.data.data);
    } catch (error) {
      console.error("Error loading booking detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get(`/services`);
      const data = res.data.data || [];

      setServices(
        data.map((sv: any) => ({
          id: sv.service_id,
          name: sv.service_name,
          price: Number(sv.service_price),
          description: sv.description,
          image: sv.image_url,
        }))
      );
    } catch (error) {
      console.log("Error loading services", error);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchServices();
  }, []);

  const toggleService = (sv: any) => {
    if (!isEditable) {
      message.warning("This booking cannot be modified.");
      return;
    }

    // ✅ VALIDATE: không add trùng service đã có
    const existed = booking?.services?.some((s: any) => s.service_id === sv.id);
    if (existed) {
      message.warning("This service is already added.");
      return;
    }

    const exists = selected.some((s) => s.id === sv.id);
    if (exists) {
      setSelected((prev) => prev.filter((p) => p.id !== sv.id));
      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[sv.id];
        return updated;
      });
    } else {
      setSelected((prev) => [...prev, sv]);
      setQuantities((prev) => ({ ...prev, [sv.id]: 1 }));
    }
  };

  const handleAddServices = async () => {
    // ✅ VALIDATE: booking tồn tại
    if (!booking) {
      message.error("Booking not found.");
      return;
    }

    // ✅ VALIDATE: trạng thái booking
    if (!isEditable) {
      message.error("This booking cannot be modified.");
      return;
    }
    if (!selected.length) {
      message.error("Please select at least 1 service.");
      return;
    }
    for (const sv of selected) {
      const qty = quantities[sv.id];
      if (!qty || qty < 1) {
        message.error(`Invalid quantity for service: ${sv.name}`);
        return;
      }
      if (qty > 50) {
        message.error(`Maximum quantity for ${sv.name} is 50`);
        return;
      }
    }

    try {
      const payload = selected.map((sv) => ({
        service_id: sv.id,
        quantity: quantities[sv.id] || 1,
      }));

      await axiosInstance.post(`/bookings/${id}/add-services`, {
        services: payload,
      });
      // ✅ VALIDATE: backend response
      if (!res.data || res.data.success === false) {
        message.error("Server rejected the request.");
        return;
      }

      message.success("Services added successfully!");
      fetchDetail();
    } catch (error) {
      console.error(error);
      message.error("Failed to add services.");
    }
  };

  if (loading)
    return <Spin size="large" style={{ marginTop: 50, display: "block" }} />;

  if (!booking)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>Booking not found</p>
    );

  const rawStatus = booking.status || "unknown";
  const displayStatus = rawStatus.replace(/_/g, " ").toUpperCase();

  // ===== GUESTS (ENGLISH FORMAT) =====
  const adults = Number(booking.adults || 0);
  const children = Number(booking.children || 0);

  const guestParts: string[] = [];
  if (adults > 0) guestParts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
  if (children > 0)
    guestParts.push(`${children} Child${children > 1 ? "ren" : ""}`);

  const guestsDisplay = guestParts.length > 0 ? guestParts.join(" + ") : "0 Guests";

  // ===== NIGHTS (ENGLISH FORMAT) =====
  let nights = booking.nights;
  if (!nights) {
    const ci = dayjs(booking.check_in);
    const co = dayjs(booking.check_out);
    nights = co.diff(ci, "day");
  }
  const days = nights + 1;
  const nightsDisplay = `${nights} Night${nights > 1 ? "s" : ""} / ${days} Day${days > 1 ? "s" : ""}`;

  const tableData: any[] = [];

  booking.items?.forEach((i: any) => {
    tableData.push({
      key: `room-${i.booking_item_id}`,
      name: i.room_type?.room_type_name || "Room",
      quantity: i.quantity || 1,
      total: Number(i.amount || i.total_price || 0),
    });
  });

  booking.services?.forEach((s: any) => {
    tableData.push({
      key: `service-${s.id}`,
      name: `Service: ${s.service_name}`,
      quantity: s.quantity,
      total: Number(s.total_price || 0),
    });
  });

  return (
    <div>
      <div className="booking-detail-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="booking-detail-title">Booking Detail</h1>
          <p className="hero-subtitle">Reservation #{booking.id}</p>
        </div>
      </div>

      <div style={{ padding: "40px 20px", maxWidth: 950, margin: "0 auto" }}>
        <Card className="detail-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
              cursor: "pointer",
              color: "#1677ff",
              width: "fit-content",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined style={{ marginRight: 6 }} />
            Back to My Bookings
          </div>

          <div className="detail-header">
            <h2>Booking #{booking.id}</h2>
            <Tag color={statusColors[rawStatus] || "default"}>
              {displayStatus}
            </Tag>
          </div>

          {/* === GUESTS + NIGHTS (ENGLISH) === */}
          <div className="detail-grid">
            <div className="detail-item">
              <HomeOutlined className="icon" />
              <div>
                <strong>Rooms:</strong>
                <p>
                  {booking.items
                    ?.map(
                      (i: any) =>
                        `${i.room_type?.room_type_name} x ${i.quantity}`
                    )
                    .join(", ")}
                </p>
              </div>
            </div>

            <div className="detail-item">
              <TeamOutlined className="icon" />
              <div>
                <strong>Guests:</strong>
                <p>{guestsDisplay}</p>
              </div>
            </div>

            <div className="detail-item">
              <CalendarOutlined className="icon" />
              <div>
                <strong>Nights:</strong>
                <p>{nightsDisplay}</p>
              </div>
            </div>

            <div className="detail-item">
              <CalendarOutlined className="icon" />
              <div>
                <strong>Check-in:</strong>
                <p>{formatDate(booking.check_in)}</p>
              </div>
            </div>

            <div className="detail-item">
              <CalendarOutlined className="icon" />
              <div>
                <strong>Check-out:</strong>
                <p>{formatDate(booking.check_out)}</p>
              </div>
            </div>

            <div className="detail-item">
              <DollarCircleOutlined className="icon" />
              <div>
                <strong>Total Amount:</strong>
                <p className="price">
<<<<<<< HEAD
                  {Number(booking.booking_total_amount).toLocaleString("vi-VN")}{" "}
=======
                  {Number(
                    booking.total_amount ||
                      booking.total ||
                      booking.total_price ||
                      0
                  ).toLocaleString("en-US")}{" "}
>>>>>>> lamtangthanh
                  ₫
                </p>
              </div>
            </div>
          </div>

          {/* BILLING + SERVICES giữ nguyên */}
          <h3 style={{ marginTop: 30 }}>Billing Details</h3>
          <Table
            dataSource={tableData}
            pagination={false}
            rowKey="key"
            columns={[
              { title: "Item", dataIndex: "name" },
              { title: "Quantity", dataIndex: "quantity" },
              {
                title: "Total Price",
                dataIndex: "total",
<<<<<<< HEAD
                render: (v) => Number(v).toLocaleString("vi-VN") + " ₫",
=======
                render: (v) => Number(v).toLocaleString("en-US") + " ₫",
>>>>>>> lamtangthanh
              },
            ]}
            style={{ marginTop: 10 }}
          />

          <div
            style={{
              marginTop: 20,
              textAlign: "right",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Total:{" "}
            {Number(
              booking.total_amount ||
                booking.total ||
                booking.total_price ||
                0
            ).toLocaleString("en-US")}{" "}
            ₫
          </div>

          <h3 style={{ marginTop: 40 }}>Add Extra Services</h3>

          <div className="service-grid">
            {services.map((sv) => {
              const active = selected.some((s) => s.id === sv.id);
              return (
                <div
                  key={sv.id}
                  className={`service-card ${active ? "active" : ""}`}
                  onClick={() => toggleService(sv)}
                >
                  <img src={sv.image || "/no-img.png"} alt={sv.name} />

                  <h4>{sv.name}</h4>
                  <p>{sv.description}</p>
                  <p className="sv-price">
                    {sv.price.toLocaleString("en-US")} ₫
                  </p>

                  {active && (
                    <div className="quantity-wrapper">
                      <span>Qty:</span>
                      <InputNumber
                        min={1}
                        max={50}
                        disabled={!isEditable}
                        value={quantities[sv.id]}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(v) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [sv.id]: v || 1,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selected.length > 0 && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              style={{ marginTop: 20 }}
              disabled={!isEditable}  
              onClick={handleAddServices}
            >
              Add Selected Services
            </Button>
          )}
        </Card>
      </div>

      {/* CSS giữ nguyên */}
      <style>{`
        .detail-card {
          border-radius: 14px !important;
          padding: 18px;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .detail-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .icon {
          font-size: 22px;
          color: #1890ff;
          margin-top: 4px;
        }

        .price {
          font-weight: 600;
          color: #d4380d;
        }

        .service-grid {
          margin-top: 20px;
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .service-card {
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
          transition: all .2s;
        }

        .service-card:hover {
          border-color: #4096ff;
        }

        .service-card.active {
          border-color: #1677ff;
          background: #e6f4ff;
        }

        .service-card img {
          width: 100%;
          height: 130px;
          border-radius: 8px;
          object-fit: cover;
          margin-bottom: 8px;
        }

        .sv-price {
          font-weight: 600;
          color: #d4380d;
        }

        .quantity-wrapper {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default BookingDetail;
