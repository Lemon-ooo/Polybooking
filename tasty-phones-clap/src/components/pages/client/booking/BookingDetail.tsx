import React, { useEffect, useState } from "react";
import {
  Card,
  Spin,
  Tag,
  Table,
  Button,
  message,
  InputNumber,
  Divider,
  Typography,
} from "antd";
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
import ReviewForm from "../reviews/ReviewForm"; // Đường dẫn của bạn

const { Title } = Typography;

const statusColors: any = {
  pending: "orange",
  pending_payment: "orange",
  confirmed: "green",
  cancelled: "red",
  completed: "blue",
  check_in: "green",
  check_out: "blue",
  paid: "cyan", // Thêm nếu cần
};

const BookingDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const navigate = useNavigate();

  const formatDate = (d: string) => dayjs(d).format("DD/MM/YYYY");

  const fetchDetail = async () => {
    try {
      const res = await axiosInstance.get(`/bookings/${id}`);
      setDetail(res.data.data);
    } catch (error) {
      console.error("Error loading booking detail:", error);
      message.error("Không thể tải thông tin booking");
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
  }, [id]);

  const toggleService = (sv: any) => {
    const exists = selected.some((s) => s.id === sv.id);
    exists
      ? setSelected((prev) => prev.filter((p) => p.id !== sv.id))
      : setSelected((prev) => [...prev, sv]);
    setQuantities((prev) =>
      exists
        ? (() => {
            const u = { ...prev };
            delete u[sv.id];
            return u;
          })()
        : { ...prev, [sv.id]: 1 }
    );
  };

  const handleAddServices = async () => {
    if (!selected.length) {
      message.error("Please select at least 1 service.");
      return;
    }

    try {
      const payload = selected.map((sv) => ({
        service_id: sv.id,
        quantity: quantities[sv.id] || 1,
      }));

      await axiosInstance.post(`/bookings/${id}/services`, {
        services: payload,
      });

      message.success("Services added successfully!");
      fetchDetail();
      setSelected([]);
      setQuantities({});
    } catch (error) {
      message.error("Failed to add services.");
      console.error(error);
    }
  };

  if (loading)
    return <Spin size="large" style={{ marginTop: 50, display: "block" }} />;

  if (!detail)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>Booking not found</p>
    );

  const booking = detail.booking;
  const pricing = detail.pricing || {};

  const rawStatus = booking.status || "unknown";
  const displayStatus = rawStatus.replace(/_/g, " ").toUpperCase();

  // Guest display
  const adults = booking.adults || 0;
  const children = booking.children || 0;
  const guestParts: string[] = [];
  if (adults > 0) guestParts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
  if (children > 0)
    guestParts.push(`${children} Child${children > 1 ? "ren" : ""}`);
  const guestsDisplay =
    guestParts.length > 0 ? guestParts.join(" + ") : "0 Guests";

  // Nights
  let nights = booking.nights;
  if (!nights) {
    const ci = dayjs(booking.check_in);
    const co = dayjs(booking.check_out);
    nights = co.diff(ci, "day");
  }
  const days = nights + 1;

  // Billing Summary
  const aggregated: Record<string, any> = {};
  if (booking.service_invoice?.charges?.length) {
    booking.service_invoice.charges.forEach((c: any) => {
      const name = c.service?.service_name || "Service";
      const key = `svc-${name}`;

      if (!aggregated[key]) {
        aggregated[key] = {
          type: "Service",
          name,
          qty: 0,
          price: Number(c.amount) / c.quantity,
        };
      }
      aggregated[key].qty += c.quantity;
    });
  }

  const tableData = Object.keys(aggregated).map((k) => ({
    key: k,
    type: aggregated[k].type,
    name: aggregated[k].name,
    qty: aggregated[k].qty,
    total: aggregated[k].price * aggregated[k].qty,
  }));

  const serviceTotal = tableData.reduce(
    (sum, row) => sum + Number(row.total || 0),
    0
  );

  const payments = booking.payments || [];
  const paid = payments.reduce(
    (t: number, p: any) => t + Number(p.amount || 0),
    0
  );

  const grand = Number(pricing.grand_total || booking.total_price || 0);
  const remaining = Math.max(grand - paid, 0);

  const canPay =
    rawStatus === "pending_payment" ||
    (rawStatus === "confirmed" && remaining > 0);

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
                <p>
                  {nights} Night{nights > 1 ? "s" : ""} / {days} Day
                  {days > 1 ? "s" : ""}
                </p>
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
          </div>

          <h3 style={{ marginTop: 30 }}>Billing Summary</h3>
          <Table
            dataSource={tableData}
            pagination={false}
            rowKey="key"
            columns={[
              { title: "Item", dataIndex: "name" },
              { title: "Quantity", dataIndex: "qty" },
              {
                title: "Total",
                dataIndex: "total",
                render: (v) => Number(v).toLocaleString("vi-VN") + " ₫",
              },
            ]}
            style={{ marginTop: 10 }}
          />

          <Divider />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Tổng dịch vụ: {serviceTotal.toLocaleString("vi-VN")} ₫
          </div>

          <Divider />

          <h3>Add Extra Services</h3>
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
                    {sv.price.toLocaleString("vi-VN")} ₫
                  </p>

                  {active && (
                    <div className="quantity-wrapper">
                      <span>Qty:</span>
                      <InputNumber
                        min={1}
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
              onClick={handleAddServices}
            >
              Add Selected Services
            </Button>
          )}

          {/* ==================== PHẦN ĐÁNH GIÁ ==================== */}
          {[
            "check_out",
            "checked_out",
            "completed",
            "paid",
            "finish",
            "finished",
            "done",
          ].includes(rawStatus.toLowerCase()) && (
            <div style={{ marginTop: 48 }}>
              <Divider />
              <Title level={3}>Rate your experience</Title>

              <div
                style={{
                  marginTop: 24,
                  padding: 24,
                  background: "#f9f9f9",
                  borderRadius: 12,
                  border: "1px solid #e8e8e8",
                }}
              >
                <Title level={4}>What would you like to share about this booking?</Title>
                <p style={{ color: "#555", marginBottom: 24 }}>
                 Reviews help other customers make easier choices. Thank you!
                </p>

                <ReviewForm
                  bookingId={booking.id}
                  onSuccess={() => {
                    message.success(
                      "Thank you! Your review has been successfully submitted."
                    );
                    fetchDetail(); // Reload để cập nhật (nếu sau này thêm danh sách review)
                  }}
                />
              </div>
            </div>
          )}

          {/* Thông báo nếu chưa check-out */}
          {![
            "check_out",
            "checked_out",
            "completed",
            "paid",
            "finish",
            "finished",
            "done",
          ].includes(rawStatus.toLowerCase()) && (
            <div
              style={{
                marginTop: 48,
                textAlign: "center",
                color: "#888",
                fontStyle: "italic",
              }}
            >
             You can only submit a review after you have completed checkout.
            </div>
          )}
        </Card>
      </div>

      {/* CSS giữ nguyên */}
      <style>{`
        .detail-card { border-radius: 14px !important; padding: 18px; }
        .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .detail-item { display: flex; gap: 12px; }
        .icon { font-size: 22px; color: #1890ff; margin-top: 4px; }
        .service-grid { margin-top: 20px; display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .service-card { border: 1px solid #eee; border-radius: 10px; padding: 12px; cursor: pointer; transition: all .2s; }
        .service-card:hover { border-color: #4096ff; }
        .service-card.active { border-color: #1677ff; background: #e6f4ff; }
        .service-card img { width: 100%; height: 130px; border-radius: 8px; object-fit: cover; margin-bottom: 8px; }
        .sv-price { font-weight: 600; color: #d4380d; }
        .quantity-wrapper { margin-top: 10px; display: flex; align-items: center; gap: 10px; }
      `}</style>
    </div>
  );
};

export default BookingDetail;
