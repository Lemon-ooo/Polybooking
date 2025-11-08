import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Chào mừng đến với hệ thống đặt phòng</h1>
      <Card>
        <p>Đặt phòng khách sạn nhanh chóng và dễ dàng</p>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/client/bookings/create")}
        >
          Đặt phòng ngay
        </Button>
      </Card>
    </div>
  );
};