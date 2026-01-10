import React, { useEffect, useState } from "react";
import { Card, Spin, Empty, message } from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  DollarCircleOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: identity, isLoading: identityLoading } = useGetIdentity<any>();
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // Format B: DD/MM/YYYY
  };

  const calcNights = (check_in: string, check_out: string) => {
    const start = new Date(check_in);
    const end = new Date(check_out);
    const diff = end.getTime() - start.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const renderGuests = (adults: number, children: number) => {
    let parts: string[] = [];

    if (adults > 0) {
      parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
    }

    if (children > 0) {
      parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
    }

    if (parts.length === 0) return "0 Guest";
    return parts.join(" + ");
  };

  const fetchBookings = async () => {
    try {
      if (!identity?.user_id) {
        message.error("You must login first.");
        return;
      }

      const res = await axiosInstance.get(
        `/bookings?user_id=${identity.user_id}`
      );
      const myBookings = res.data?.data?.data || [];
      setBookings(myBookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        message.error("You must login first.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!identityLoading) {
      fetchBookings();
    }
  }, [identityLoading]);

  if (loading || identityLoading)
    return <Spin size="large" style={{ marginTop: 50 }} />;

  return (
    <div>
      {/* ================== HERO BANNER ================== */}
      <div className="my-bookings-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="my-bookings-title">My Bookings</h1>
          <p className="hero-subtitle">
            View all your reservations in one place
          </p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        {bookings.length === 0 ? (
          <Empty description="You have no bookings yet." />
        ) : (
          bookings.map((booking) => {
            const nights = calcNights(booking.check_in, booking.check_out);

            return (
              <Card
                key={booking.id}
                className="booking-card"
                hoverable
                onClick={() => navigate(`/client/my-bookings/${booking.id}`)}
              >
                <div className="booking-top">
                  <div className="booking-title">Booking #{booking.id}</div>
                  <span className="booking-status">
                    {booking.status?.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="booking-grid">
                  <div className="booking-field">
                    <HomeOutlined className="i" />
                    <div>
                      <label>Rooms</label>
                      <span>
                        {booking.booking_items
                          ?.map(
                            (i: any) =>
                              `${i.room_type?.room_type_name} x ${i.quantity}`
                          )
                          .join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="booking-field">
                    <CalendarOutlined className="i" />
                    <div>
                      <label>Check-in</label>
                      <span>{formatDate(booking.check_in)}</span>
                    </div>
                  </div>

                  <div className="booking-field">
                    <CalendarOutlined className="i" />
                    <div>
                      <label>Check-out</label>
                      <span>{formatDate(booking.check_out)}</span>
                    </div>
                  </div>

                  <div className="booking-field">
                    <UserOutlined className="i" />
                    <div>
                      <label>Guests</label>
                      <span>
                        {renderGuests(booking.adults, booking.children)}
                      </span>
                    </div>
                  </div>

                  <div className="booking-field">
                    <CalendarOutlined className="i" />
                    <div>
                      <label>Nights</label>
                      <span>
                        {nights} {nights > 1 ? "Nights" : "Night"} /{" "}
                        {nights + 1} {nights + 1 > 1 ? "Days" : "Day"}
                      </span>
                    </div>
                  </div>

                  <div className="booking-field">
                    <DollarCircleOutlined className="i" />
                    <div>
                      <label>Total</label>
                      <span className="total">
                        {booking.total_price?.toLocaleString()} VND
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-footer">
                  <span>View Details</span>
                  <ArrowRightOutlined />
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ================== CUSTOM CSS (KEEP ORIGINAL) ================== */}
      <style>{`
        .booking-card {
          border-radius: 12px;
          padding: 18px 22px;
          margin-bottom: 18px;
          border: 1px solid #f0f0f0;
          transition: 0.25s ease;
        }

        .booking-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .booking-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .booking-title {
          font-size: 17px;
          font-weight: 600;
        }

        .booking-status {
          background: #f6f6f6;
          border: 1px solid #d9d9d9;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .booking-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 12px 18px;
          margin-bottom: 10px;
        }

        .booking-field {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .booking-field label {
          display: block;
          font-size: 12px;
          color: #888;
          margin-bottom: 2px;
        }

        .booking-field span {
          font-size: 14px;
          font-weight: 500;
        }

        .booking-field .i {
          color: #1677ff;
          font-size: 18px;
          margin-top: 3px;
        }

        .total {
          color: #d4380d;
          font-weight: 600;
          font-size: 15px;
        }

        .booking-footer {
          margin-top: 6px;
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #1677ff;
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
