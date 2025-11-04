import React from "react";
import { roomsDummyData } from "../assets/assets";
import RoomCard from "./RoomCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Card } from "antd";

const FeaturedDestination = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 24px",
        background: "#f1f5f9",
      }}
    >
      <Title
        title="Featured Destinations"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />
      <div style={{ marginTop: 40, width: "100%", maxWidth: 1200 }}>
        <Row gutter={[24, 24]} justify="center">
          {roomsDummyData.slice(0, 4).map((room, index) => (
            <Col key={room._id} xs={24} sm={12} lg={12} xl={6}>
              {/* Bọc RoomCard bằng Card để đồng bộ style ANTD cho phần lưới */}
              <Card hoverable bodyStyle={{ padding: 0 }}>
                <RoomCard room={room} index={index} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        style={{ marginTop: 48 }}
      >
        View All Destinations
      </Button>
    </div>
  );
};

export default FeaturedDestination;
