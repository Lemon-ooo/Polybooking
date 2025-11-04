import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Typography, Button, Badge } from "antd";
const { Title: AntTitle, Paragraph } = Typography;

const Services = () => {
  const servicesData = [
    {
      _id: "1",
      name: "Airport Pickup",
      description:
        "Private airport transfer with air-conditioned car and professional driver. Hassle-free travel to your hotel.",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
    },
    {
      _id: "2",
      name: "Breakfast Buffet",
      description:
        "Start your day with a delicious buffet featuring international and local cuisine, freshly prepared every morning.",
      price: 15,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    },
    {
      _id: "3",
      name: "Spa & Massage",
      description:
        "Relax and rejuvenate with professional massage therapy, aromatherapy oils, and tranquil ambiance.",
      price: 50,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
    },
    {
      _id: "4",
      name: "Laundry Service",
      description:
        "Fast and convenient laundry and ironing service to keep your clothes clean and fresh during your stay.",
      price: 10,
      image:
        "https://rjkool.com/wp-content/uploads/2021/09/laundry-services.jpg",
    },
    {
      _id: "5",
      name: "City Tour",
      description:
        "Discover the beauty of the city with our guided sightseeing tours covering top attractions and hidden gems.",
      price: 90,
      image:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800",
    },
    {
      _id: "6",
      name: "Car Rental",
      description:
        "Rent a car with or without a driver for flexible travel and easy exploration of nearby destinations.",
      price: 70,
      image:
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
    },
  ];

  return (
    <div style={{ padding: "96px 24px", background: "#f9fafb" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <AntTitle level={2} style={{ marginBottom: 8 }}>
          Our Premium Services
        </AntTitle>
        <Paragraph type="secondary" style={{ maxWidth: 720, margin: "0 auto" }}>
          Choose from our exclusive range of hospitality services to enhance your stay with comfort,
          convenience, and style.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {servicesData.map((service) => (
          <Col key={service._id} xs={24} sm={12} lg={8}>
            <Badge.Ribbon text={`$${service.price}`} color="orange">
              <Card
                hoverable
                cover={
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{ height: 256, objectFit: "cover" }}
                  />
                }
              >
                <Card.Meta title={service.name} description={
                  <Paragraph type="secondary" style={{ marginTop: 8 }}>
                    {service.description}
                  </Paragraph>
                } />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                  <Link to={`/services/${service._id}`}>
                    <Button type="primary" shape="round">Learn More</Button>
                  </Link>
                </div>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Services;
