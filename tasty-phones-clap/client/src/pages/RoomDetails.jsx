import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  assets,
  facilityIcons,
  roomCommonData,
  roomsDummyData,
} from "../assets/assets";
import StarRating from "../components/StarRating";
import { Row, Col, Image, Typography, Tag, DatePicker, InputNumber, Button, Divider, Space, Card } from "antd";
import dayjs from "dayjs";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    const room = roomsDummyData.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, [id]); // THÊM 'id' vào dependency array

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/*Room Details*/}
        <Row align="middle" gutter={[12, 12]}>
          <Col>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {room.hotel.name} <Typography.Text type="secondary">({room.roomType})</Typography.Text>
            </Typography.Title>
          </Col>
          <Col>
            <Tag color="orange">20% OFF</Tag>
          </Col>
        </Row>
        {/*Room Raiting*/}
        <Space size="small" style={{ marginTop: 8 }}>
          <StarRating />
          <Typography.Text>200+ reviews</Typography.Text>
        </Space>
        {/*Room Address*/}
        <Space size={8} style={{ marginTop: 8, color: "#6b7280" }}>
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </Space>
        {/*Room Images*/}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Image src={mainImage} alt="Room Image" style={{ borderRadius: 12 }} />
          </Col>
          <Col xs={24} lg={12}>
            <Row gutter={[12, 12]}>
              {room?.images.length > 1 &&
                room.images.map((image, index) => (
                  <Col xs={12} key={index}>
                    <Image
                      preview={false}
                      onClick={() => setMainImage(image)}
                      src={image}
                      alt="Room Image"
                      style={{
                        height: 160,
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: 10,
                        outline: mainImage === image ? "3px solid #fa8c16" : undefined,
                      }}
                    />
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
        {/*---*/}
        {/*Room Highlights*/}
        <Row justify="space-between" style={{ marginTop: 24 }}>
          <Col>
            <Typography.Title level={3} style={{ marginBottom: 12 }}>
              Experience Luxury Like Never Before
            </Typography.Title>
            <Space size={[8, 8]} wrap>
              {room.amenities.map((item, index) => (
                <Tag key={index} icon={<img src={facilityIcons[item]} alt={item} style={{ width: 16, height: 16 }} />}>
                  {item}
                </Tag>
              ))}
            </Space>
          </Col>
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              ${room.pricePerNight}/night
            </Typography.Title>
          </Col>
        </Row>
        {/*---*/}
        {/*CheckIn checkOut Form*/}
        <Card style={{ marginTop: 32, maxWidth: 1200, marginLeft: "auto", marginRight: "auto" }}>
          <Row align="middle" gutter={[16, 16]} justify="space-between">
            <Col xs={24} md={6}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Text strong>Check-In</Typography.Text>
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabledDate={(d) => d && d < dayjs().startOf("day")} />
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Text strong>Check-Out</Typography.Text>
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabledDate={(d) => d && d < dayjs().startOf("day")} />
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Text strong>Customers</Typography.Text>
                <InputNumber min={1} defaultValue={1} style={{ width: "100%" }} />
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Button type="primary" size="large" block>
                Check Availability
              </Button>
            </Col>
          </Row>
        </Card>
        {/* Common Specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Divider style={{ margin: "40px 0" }} />
        <div style={{ color: "#6b7280", maxWidth: 720 }}>
          <p>
            Customers will be allocated on the ground floor according to availability. You get a comfortable Two
            bedroom apartment has a true city feeling. The price quoted is for two customers, at the customers slot
            please mark the number of guests to get the exact price for groups. The customers will be allocated ground
            floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.
          </p>
        </div>
        {/*Hosted by  //chua len logo*/}

        <Space direction="vertical" size={12}>
          <Space size={12}>
            <img
              src={room.hotel.owner.image}
              alt="Host"
              style={{ height: 64, width: 64, borderRadius: 9999 }}
            />
            <div>
              <Typography.Title level={4} style={{ margin: 0 }}>Hosted by {room.hotel.name}</Typography.Title>
              <Space size="small" style={{ marginTop: 4 }}>
                <StarRating />
                <Typography.Text>200+ reviews</Typography.Text>
              </Space>
            </div>
          </Space>
          <Button type="primary">Contact Now</Button>
        </Space>
      </div>
    )
  );
};

export default RoomDetails;
