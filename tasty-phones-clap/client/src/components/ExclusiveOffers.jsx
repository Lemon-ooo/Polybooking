import React from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";
import { Row, Col, Card, Typography, Button, Badge } from "antd";

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />
        <Button type="link" className="max-md:mt-12">
          View All Offers
        </Button>
      </div>
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {exclusiveOffers.map((item) => (
          <Col key={item._id} xs={24} md={12} lg={8}>
            <Badge.Ribbon text={`${item.priceOff}% OFF`} color="red">
              <Card
                hoverable
                cover={<img src={item.image} alt={item.title} style={{ height: 220, objectFit: "cover" }} />}
              >
                <Typography.Title level={4} className="font-playfair" style={{ marginBottom: 0 }}>
                  {item.title}
                </Typography.Title>
                <Typography.Paragraph type="secondary" style={{ marginTop: 6 }}>
                  {item.description}
                </Typography.Paragraph>
                <Typography.Text type="secondary">Expires {item.expiryDate}</Typography.Text>
                <div style={{ marginTop: 12 }}>
                  <Button type="primary">View Offers</Button>
                </div>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ExclusiveOffers;
