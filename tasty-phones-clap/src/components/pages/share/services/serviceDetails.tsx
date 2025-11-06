import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Space,
  Button,
  Tag,
  Row,
  Col,
  Card,
  Divider,
  List,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  duration?: string;
  features?: string[];
  availability?: string;
}

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);

  const servicesData: Service[] = [
    {
      _id: "1",
      name: "Airport Pickup",
      description:
        "Private airport transfer with air-conditioned car and professional driver. Hassle-free travel to your hotel.",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
      duration: "30-45 minutes",
      availability: "24/7 Available",
      features: [
        "Professional driver",
        "Air-conditioned vehicle",
        "Meet & greet service",
        "Luggage assistance",
        "Flight tracking",
      ],
    },
    {
      _id: "2",
      name: "Breakfast Buffet",
      description:
        "Start your day with a delicious buffet featuring international and local cuisine, freshly prepared every morning.",
      price: 15,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      duration: "6:00 AM - 10:00 AM",
      availability: "Daily",
      features: [
        "International cuisine",
        "Local specialties",
        "Fresh fruits & juices",
        "Hot & cold beverages",
        "Vegetarian options",
      ],
    },
    {
      _id: "3",
      name: "Spa & Massage",
      description:
        "Relax and rejuvenate with professional massage therapy, aromatherapy oils, and tranquil ambiance.",
      price: 50,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
      duration: "60-90 minutes",
      availability: "10:00 AM - 8:00 PM",
      features: [
        "Professional therapists",
        "Aromatherapy oils",
        "Relaxing ambiance",
        "Hot stone massage",
        "Couples massage available",
      ],
    },
    {
      _id: "4",
      name: "Laundry Service",
      description:
        "Fast and convenient laundry and ironing service to keep your clothes clean and fresh during your stay.",
      price: 10,
      image:
        "https://rjkool.com/wp-content/uploads/2021/09/laundry-services.jpg",
      duration: "24 hours",
      availability: "Daily pickup",
      features: [
        "Washing & drying",
        "Ironing service",
        "Dry cleaning",
        "Same-day service available",
        "Eco-friendly detergents",
      ],
    },
    {
      _id: "5",
      name: "City Tour",
      description:
        "Discover the beauty of the city with our guided sightseeing tours covering top attractions and hidden gems.",
      price: 90,
      image:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800",
      duration: "4-6 hours",
      availability: "Daily departures",
      features: [
        "Expert tour guide",
        "Air-conditioned transport",
        "Visit major attractions",
        "Photo opportunities",
        "Lunch included",
      ],
    },
    {
      _id: "6",
      name: "Car Rental",
      description:
        "Rent a car with or without a driver for flexible travel and easy exploration of nearby destinations.",
      price: 70,
      image:
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
      duration: "Per day",
      availability: "Subject to availability",
      features: [
        "Wide range of vehicles",
        "GPS navigation",
        "Insurance included",
        "Driver available",
        "Flexible rental periods",
      ],
    },
  ];

  useEffect(() => {
    const foundService = servicesData.find((s) => s._id === id);
    if (foundService) {
      setService(foundService);
    }
  }, [id]);

  if (!service) {
    return (
      <div style={{ padding: "100px 64px", textAlign: "center" }}>
        <Title level={3}>Loading...</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: "100px 64px 64px" }}>
      {/* Back Button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/services")}
        style={{ marginBottom: "24px", fontSize: "16px" }}
      >
        Back to Services
      </Button>

      <Row gutter={[48, 48]}>
        {/* Left Column - Image */}
        <Col xs={24} lg={12}>
          <img
            src={service.image}
            alt={service.name}
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
              borderRadius: "16px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            }}
          />
        </Col>

        {/* Right Column - Details */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Header */}
            <div>
              <Space align="center" wrap style={{ marginBottom: "16px" }}>
                <Title level={1} style={{ margin: 0, fontSize: "36px" }}>
                  {service.name}
                </Title>
                <Tag
                  color="orange"
                  style={{
                    fontSize: "18px",
                    padding: "8px 16px",
                    borderRadius: "999px",
                  }}
                >
                  ${service.price}
                </Tag>
              </Space>
              <Paragraph style={{ fontSize: "16px", color: "#6b7280" }}>
                {service.description}
              </Paragraph>
            </div>

            <Divider />

            {/* Service Info */}
            <Card style={{ background: "#f9fafb", border: "none" }}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Space size={12}>
                  <ClockCircleOutlined
                    style={{ fontSize: "20px", color: "#1677ff" }}
                  />
                  <div>
                    <Text strong>Duration:</Text>
                    <br />
                    <Text type="secondary">{service.duration}</Text>
                  </div>
                </Space>

                <Space size={12}>
                  <CheckCircleOutlined
                    style={{ fontSize: "20px", color: "#52c41a" }}
                  />
                  <div>
                    <Text strong>Availability:</Text>
                    <br />
                    <Text type="secondary">{service.availability}</Text>
                  </div>
                </Space>

                <Space size={12}>
                  <DollarOutlined
                    style={{ fontSize: "20px", color: "#faad14" }}
                  />
                  <div>
                    <Text strong>Price:</Text>
                    <br />
                    <Text type="secondary">${service.price} per service</Text>
                  </div>
                </Space>
              </Space>
            </Card>

            {/* Features */}
            <div>
              <Title level={4} style={{ marginBottom: "16px" }}>
                What's Included
              </Title>
              <List
                dataSource={service.features}
                renderItem={(item) => (
                  <List.Item style={{ border: "none", padding: "8px 0" }}>
                    <Space>
                      <CheckCircleOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>

            {/* Action Buttons */}
            <Space size={16} style={{ width: "100%", marginTop: "24px" }}>
              <Button
                type="primary"
                size="large"
                block
                style={{
                  background: "#1677ff",
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "8px",
                }}
              >
                Book Now
              </Button>
              <Button
                size="large"
                block
                style={{
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "8px",
                }}
              >
                Contact Us
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* Additional Information */}
      <Card
        style={{
          marginTop: "64px",
          background: "#f9fafb",
          border: "none",
          borderRadius: "16px",
        }}
      >
        <Title level={4} style={{ marginBottom: "16px" }}>
          Important Information
        </Title>
        <Paragraph style={{ fontSize: "14px", color: "#6b7280" }}>
          • Please book in advance to ensure availability
          <br />
          • Cancellation policy: Free cancellation up to 24 hours before service
          <br />
          • Payment can be made at the hotel reception or charged to your room
          <br />
          • For special requests or group bookings, please contact our concierge
          <br />• All prices are subject to applicable taxes and service charges
        </Paragraph>
      </Card>
    </div>
  );
};

export default ServiceDetails;

