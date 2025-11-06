import React from "react";
import { Row, Col, Card, Typography, Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const AllServices: React.FC = () => {
  const navigate = useNavigate();

  const servicesData: Service[] = [
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
    <div style={{ padding: "100px 64px 64px", background: "#f9fafb" }}>
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <Title
          level={1}
          style={{
            fontSize: "40px",
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: "16px",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Our Premium Services
        </Title>
        <Paragraph
          style={{
            fontSize: "16px",
            color: "#6b7280",
            maxWidth: "672px",
            margin: "0 auto",
          }}
        >
          Choose from our exclusive range of hospitality services to enhance
          your stay with comfort, convenience, and style.
        </Paragraph>
      </div>

      {/* Services Grid */}
      <Row gutter={[40, 40]} style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {servicesData.map((service) => (
          <Col xs={24} sm={12} lg={8} key={service._id}>
            <Card
              hoverable
              cover={
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{
                      width: "100%",
                      height: "256px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <Tag
                    color="orange"
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "4px 12px",
                      borderRadius: "999px",
                    }}
                  >
                    ${service.price}
                  </Tag>
                </div>
              }
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              bodyStyle={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <Title
                  level={4}
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1f2937",
                    marginBottom: "8px",
                  }}
                >
                  {service.name}
                </Title>
                <Paragraph
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "24px",
                  }}
                >
                  {service.description}
                </Paragraph>
              </div>

              <div style={{ textAlign: "center", marginTop: "auto" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    navigate(`/services/${service._id}`);
                    window.scrollTo(0, 0);
                  }}
                  style={{
                    background: "#1677ff",
                    borderRadius: "999px",
                    padding: "12px 28px",
                    height: "auto",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  Learn More
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AllServices;

