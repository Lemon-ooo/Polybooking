import React, { useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import { Row, Col, Typography, Image, Space, Tag, Collapse, Checkbox, Radio, Divider, Card, Button } from "antd";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};
const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 1500",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];
  return (
    <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Typography.Title className="font-playfair" level={2}>Homestay Rooms</Typography.Title>
          <Typography.Paragraph type="secondary" style={{ maxWidth: 696 }}>
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </Typography.Paragraph>
          {roomsDummyData.map((room) => (
            <Card key={room._id} style={{ marginTop: 24 }} bodyStyle={{ padding: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Image
                    onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}
                    src={room.images[0]}
                    alt="homestay-img"
                    preview={false}
                    style={{ borderRadius: 12, cursor: "pointer", maxHeight: 260, objectFit: "cover" }}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Typography.Text type="secondary">{room.hotel.city}</Typography.Text>
                  <Typography.Title level={3} className="font-playfair" style={{ marginTop: 4 }}>
                    <span onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }} style={{ cursor: "pointer" }}>
                      {room.hotel.name}
                    </span>
                  </Typography.Title>
                  <Space size="small">
                    <StarRating />
                    <Typography.Text>200+ reviews</Typography.Text>
                  </Space>
                  <Space size={8} style={{ marginTop: 8, color: "#6b7280" }}>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{room.hotel.address}</span>
                  </Space>
                  <Space size={[8, 8]} wrap style={{ marginTop: 12, marginBottom: 12 }}>
                    {room.amenities.map((item, index) => (
                      <Tag key={index} icon={<img src={facilityIcons[item]} alt={item} style={{ width: 16, height: 16 }} />}>{item}</Tag>
                    ))}
                  </Space>
                  <Typography.Text style={{ fontSize: 18, color: "#374151" }}>
                    ${room.pricePerNight} /night
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
        <Col xs={24} lg={8}>
          <Card title="FILTERS">
            <Collapse ghost>
              <Collapse.Panel header="Popular filters" key="1">
                {roomTypes.map((room, index) => (
                  <div key={index} style={{ marginTop: 4 }}>
                    <Checkbox>{room}</Checkbox>
                  </div>
                ))}
              </Collapse.Panel>
              <Collapse.Panel header="Price Range" key="2">
                {priceRanges.map((range, index) => (
                  <div key={index} style={{ marginTop: 4 }}>
                    <Checkbox>{`$ ${range}`}</Checkbox>
                  </div>
                ))}
              </Collapse.Panel>
              <Collapse.Panel header="Sort By" key="3">
                <Radio.Group direction="vertical">
                  <Space direction="vertical">
                    {sortOptions.map((option, index) => (
                      <Radio key={index} value={option}>{option}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Collapse.Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AllRooms;
