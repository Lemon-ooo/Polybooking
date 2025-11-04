import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { Card, Tag, Button, Typography, Space } from "antd";

const RoomCard = ({ room, index }) => {
  return (
    <Link to={"/rooms/" + room._id} onClick={() => scrollTo(0, 0)} key={room._id}>
      <Card
        hoverable
        cover={<img src={room.images[0]} alt="room" />}
        bodyStyle={{ padding: 16 }}
      >
        {index % 2 === 0 && (
          <Tag style={{ position: "absolute", top: 12, left: 12 }} color="white">
            <span style={{ color: "#111" }}>Best Seller</span>
          </Tag>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography.Text strong className="font-playfair" style={{ fontSize: 18 }}>
            {room.hotel.name}
          </Typography.Text>
          <Space size={4}>
            <img src={assets.starIconFilled} alt="Star-icon" /> 4.5
          </Space>
        </div>
        <Space size={8} style={{ marginTop: 8, color: "#6b7280" }}>
          <img src={assets.locationIcon} alt="Location-icon" />
          <span>{room.hotel.address}</span>
        </Space>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <Typography.Text>
            <span style={{ fontSize: 18, color: "#111827" }}>${room.pricePerNight}</span>/night
          </Typography.Text>
          <Button type="default" size="small" shape="round">Book Now</Button>
        </div>
      </Card>
    </Link>
  );
};

export default RoomCard;
