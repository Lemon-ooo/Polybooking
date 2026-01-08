import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, Alert, message, Descriptions } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import "./ClientPayment.css";

const API_URL = "http://localhost:8000";

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
    token: authData?.token || null,
  };
};

export default function ClientPayment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch booking details
  useEffect(() => {
    if (!bookingId || !token) {
      message.error("Invalid booking or authentication");
      navigate("/client/booking");
      return;
    }

    fetchBookingDetails();
  }, [bookingId, token]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooking(res.data?.data || res.data);
    } catch (error: any) {
      message.error("Failed to load booking details");
      navigate("/client/booking");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to VNPay
  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      const res = await axios.post(
        `${API_URL}/api/payments/vnpay/booking`,
        { booking_id: bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentUrl = res.data?.payment_url;

      if (paymentUrl) {
        // Redirect to VNPay payment gateway
        window.location.href = paymentUrl;
      } else {
        throw new Error("Payment URL not found");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create payment";
      message.error(errorMsg);
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="payment-page">
        <Alert
          message="Booking not found"
          type="error"
          showIcon
          style={{ margin: "50px auto", maxWidth: 600 }}
        />
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <Card className="payment-card">
          <h1 className="payment-title">Complete Your Payment</h1>

          <Alert
            message="Please review your booking details before payment"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Descriptions
            title="Booking Information"
            bordered
            column={1}
            style={{ marginBottom: 24 }}
          >
            <Descriptions.Item label="Booking ID">
              #{booking.id}
            </Descriptions.Item>
            <Descriptions.Item label="Check-in">
              {new Date(booking.check_in).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Check-out">
              {new Date(booking.check_out).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Guests">
              {booking.adults} adults
              {booking.children > 0 && `, ${booking.children} children`}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span
                style={{
                  color:
                    booking.status === "paid"
                      ? "#52c41a"
                      : booking.status === "pending"
                      ? "#faad14"
                      : "#000",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {booking.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <span
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#1890ff",
                }}
              >
                {booking.total_price?.toLocaleString()} ₫
              </span>
            </Descriptions.Item>
          </Descriptions>

          {booking.status === "paid" ? (
            <Alert
              message="Payment Completed"
              description="Your booking has been paid successfully!"
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              action={
                <Button
                  type="primary"
                  onClick={() => navigate("/client/my-bookings")}
                >
                  View My Bookings
                </Button>
              }
            />
          ) : (
            <div className="payment-actions">
              <Button
                type="default"
                size="large"
                onClick={() => navigate("/client/booking")}
                style={{ marginRight: 16 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                loading={paymentLoading}
                onClick={handlePayment}
                style={{ minWidth: 200 }}
              >
                Pay with VNPay
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
