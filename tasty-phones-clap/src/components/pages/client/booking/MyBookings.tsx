// src/components/pages/client/bookings/MyBookings.tsx

import React, { useEffect, useState } from "react";
import { Card, Spin, Empty, message, Tag } from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  DollarCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

const statusColors: any = {
  pending: "orange",
  confirmed: "green",
  cancelled: "red",
  completed: "blue",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: identity, isLoading: identityLoading } = useGetIdentity<any>();
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
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
          <p className="hero-subtitle">View all your reservations in one place</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        {bookings.length === 0 ? (
          <Empty description="You have no bookings yet." />
        ) : (
          bookings.map((booking) => (
            <Card
              key={booking.booking_id}
              className="booking-card"
              hoverable
              onClick={() =>
                navigate(`/client/my-bookings/${booking.booking_id}`)
              }
            >
              <div className="booking-header">
                <h3>Booking #{booking.booking_id}</h3>
                <Tag color={statusColors[booking.status] || "default"}>
                  {booking.status.toUpperCase()}
                </Tag>
              </div>

              <div className="booking-content">
                
                {/* ROOM INFO */}
                <div className="booking-item">
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

                {/* CHECK-IN */}
                <div className="booking-item">
                  <CalendarOutlined className="icon" />
                  <div>
                    <strong>Check-in:</strong>
                    <p>{formatDate(booking.check_in)}</p>
                  </div>
                </div>

                {/* CHECK-OUT */}
                <div className="booking-item">
                  <CalendarOutlined className="icon" />
                  <div>
                    <strong>Check-out:</strong>
                    <p>{formatDate(booking.check_out)}</p>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="booking-item">
                  <DollarCircleOutlined className="icon" />
                  <div>
                    <strong>Total Amount:</strong>
                    <p className="price">
                      {booking.booking_total_amount?.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              </div>

              <div className="booking-footer">
                <span>View Details</span>
                <ArrowRightOutlined />
              </div>
            </Card>
          ))
        )}
      </div>

      {/* ================== CUSTOM CSS ================== */}
      <style>
        {`


        .booking-card {
          border-radius: 14px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .booking-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .booking-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 16px;
          margin-bottom: 12px;
        }

        .booking-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .booking-item .icon {
          font-size: 20px;
          color: #1890ff;
          margin-top: 4px;
        }

        .price {
          font-weight: 600;
          color: #d4380d;
        }

        .booking-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-weight: 500;
          color: #1677ff;
        }
      `}
      </style>
    </div>
  );
};

export default MyBookings;
