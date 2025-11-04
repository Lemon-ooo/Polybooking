import React, { useState } from "react";
import Title from "../components/Title";
import { assets, userBookingsDummyData } from "../assets/assets";
import { Table, Tag, Button, Space, Image, Typography } from "antd";

const MyBookings = () => {
  const [bookings, setBookings] = useState(userBookingsDummyData);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <Table
          rowKey={(r) => r._id}
          dataSource={bookings}
          pagination={false}
          columns={[
            {
              title: "Homestays",
              render: (_, booking) => (
                <Space>
                  <Image src={booking.room.images[0]} width={88} height={64} style={{ objectFit: "cover", borderRadius: 8 }} />
                  <div>
                    <Typography.Text className="font-playfair" style={{ fontSize: 18 }}>
                      {booking.hotel.name}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ marginLeft: 6 }}>
                      ({booking.room.roomType})
                    </Typography.Text>
                    <div style={{ color: "#6b7280" }}>
                      <img src={assets.locationIcon} alt="location-icon" style={{ height: 14, marginRight: 6 }} />
                      <span>{booking.hotel.address}</span>
                    </div>
                    <div style={{ color: "#6b7280" }}>
                      <img src={assets.guestsIcon} alt="guests-icon" style={{ height: 14, marginRight: 6 }} />
                      <span>Customers: {booking.guests}</span>
                    </div>
                    <div>Total: ${booking.totalPrice}</div>
                  </div>
                </Space>
              ),
            },
            {
              title: "Date & Timings",
              render: (_, booking) => (
                <Space size={24}>
                  <div>
                    <div>Check-In:</div>
                    <Typography.Text type="secondary">
                      {new Date(booking.checkInDate).toLocaleString()}
                    </Typography.Text>
                  </div>
                  <div>
                    <div>Check-Out:</div>
                    <Typography.Text type="secondary">
                      {new Date(booking.checkOutDate).toLocaleString()}
                    </Typography.Text>
                  </div>
                </Space>
              ),
            },
            {
              title: "Payment",
              width: 180,
              render: (_, booking) => (
                <Space direction="vertical">
                  <Tag color={booking.isPaid ? "green" : "red"}>{booking.isPaid ? "Paid" : "UnPaid"}</Tag>
                  {!booking.isPaid && <Button size="small">Pay Now</Button>}
                </Space>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MyBookings;
