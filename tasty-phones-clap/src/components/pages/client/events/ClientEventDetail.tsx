import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Spin,
  Empty,
  Tag,
  Space,
  Image,
  Timeline,
} from "antd";
import {
  CalendarOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  ReadOutlined,
  FlagOutlined,
  ThunderboltOutlined,
  StarOutlined,
  TeamOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../../../../providers/data/axiosConfig";

const { Title, Paragraph, Text } = Typography;
const BASE_IMAGE_URL = "http://localhost:8000/storage/";

const ClientEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch current event details
        const eventRes = await axiosInstance.get(`/events/${id}`);
        const currentEvent = eventRes.data.data || eventRes.data;
        setEvent(currentEvent);

        // 2. Fetch list for "Discover More"
        const listRes = await axiosInstance.get("/events");
        const allEvents = listRes.data.data || listRes.data;

        // Filter out the current event and take the top 3
        const filtered = allEvents
          .filter((item: any) => String(item.id) !== String(id))
          .slice(0, 3);

        setRelatedEvents(filtered);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f4f7f6",
        }}
      >
        <Spin size="large" tip="Loading event details..." />
      </div>
    );

  if (!event)
    return (
      <div style={{ padding: 100 }}>
        <Empty description="Event not found" />
      </div>
    );

  const isOneDayEvent = dayjs(event.start_date).isSame(
    dayjs(event.end_date),
    "day"
  );

  return (
    <div
      style={{
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      {/* 1. HERO HEADER */}
      <div
        style={{
          position: "relative",
          height: "400px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={`${BASE_IMAGE_URL}${event.banner}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(15px) brightness(0.6)",
          }}
          alt="background"
        />
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1100px",
            padding: "0 20px",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/client/events")}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "none",
              color: "#fff",
              borderRadius: "50px",
              fontWeight: 600,
            }}
          >
            Back to List
          </Button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "-180px auto 0",
          padding: "0 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: "24px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.1)",
          }}
          styles={{ body: { padding: "60px" } }}
        >
          {/* TITLE & TAGS */}
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <Space size="middle" style={{ marginBottom: "20px" }}>
              <Tag icon={<StarOutlined />} color="gold">
                FEATURED EVENT
              </Tag>
              <Tag icon={<GlobalOutlined />} color="blue">
                LATEST NEWS
              </Tag>
            </Space>
            <Title
              style={{
                fontSize: "42px",
                margin: "10px 0",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
              }}
            >
              {event.title}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              PolyBooking Newsroom • Published on{" "}
              {dayjs(event.created_at).format("MMMM DD, YYYY")}
            </Text>
          </div>

          {/* HIGHLIGHTS BAR */}
          <div
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "16px",
              padding: "30px",
              marginBottom: "50px",
            }}
          >
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <TeamOutlined
                  style={{
                    fontSize: "24px",
                    color: "#1890ff",
                    marginBottom: "10px",
                  }}
                />
                <Title level={5} style={{ margin: 0 }}>
                  Grand Scale
                </Title>
                <Text type="secondary">Thousands of attendees</Text>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <GlobalOutlined
                  style={{
                    fontSize: "24px",
                    color: "#52c41a",
                    marginBottom: "10px",
                  }}
                />
                <Title level={5} style={{ margin: 0 }}>
                  Networking
                </Title>
                <Text type="secondary">Global connections</Text>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <ThunderboltOutlined
                  style={{
                    fontSize: "24px",
                    color: "#faad14",
                    marginBottom: "10px",
                  }}
                />
                <Title level={5} style={{ margin: 0 }}>
                  Inspiration
                </Title>
                <Text type="secondary">Creative and bold sessions</Text>
              </Col>
            </Row>
          </div>

          {/* MAIN IMAGE */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Image
              src={`${BASE_IMAGE_URL}${event.banner}`}
              style={{
                width: "100%",
                maxWidth: "750px",
                borderRadius: "20px",
                boxShadow: "0 15px 45px rgba(0,0,0,0.15)",
              }}
              preview={true}
            />
          </div>

          <Row gutter={[60, 40]}>
            <Col xs={24} lg={15}>
              <div style={{ marginBottom: "50px" }}>
                <Title
                  level={3}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    marginBottom: "25px",
                  }}
                >
                  <ReadOutlined
                    style={{ marginRight: "12px", color: "#8a6e5b" }}
                  />
                  Full Story
                </Title>
                <Paragraph
                  style={{
                    fontSize: "17px",
                    lineHeight: "2.1",
                    color: "#333",
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                  }}
                >
                  {event.description}
                </Paragraph>
              </div>

              <Divider />

              {/* DYNAMIC TIMELINE */}
              <div style={{ marginTop: "40px" }}>
                <Title
                  level={4}
                  style={{
                    marginBottom: "30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FlagOutlined style={{ color: "#ff4d4f" }} /> Key Milestones
                </Title>
                <Timeline
                  mode="left"
                  items={[
                    {
                      label: dayjs(event.start_date).format("MMM DD, YYYY"),
                      children: (
                        <Text strong>
                          {isOneDayEvent ? "Event Opening" : "Commencement"}
                        </Text>
                      ),
                      color: "blue",
                    },
                    {
                      label: dayjs(event.end_date).format("MMM DD, YYYY"),
                      children: (
                        <Text strong>
                          {isOneDayEvent ? "Event Conclusion" : "Final Day"}
                        </Text>
                      ),
                      color: event.is_active ? "blue" : "gray",
                    },
                  ]}
                />
              </div>
            </Col>

            <Col xs={24} lg={9}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "35px",
                  borderRadius: "24px",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <Title
                  level={4}
                  style={{ marginBottom: "30px", fontSize: "20px" }}
                >
                  Quick Facts
                </Title>
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <CalendarOutlined
                      style={{ fontSize: "22px", color: "#1890ff" }}
                    />
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "block",
                        }}
                      >
                        TIME PERIOD
                      </Text>
                      <Text strong>
                        {isOneDayEvent
                          ? dayjs(event.start_date).format("MMMM DD, YYYY")
                          : `${dayjs(event.start_date).format(
                              "MMM DD"
                            )} - ${dayjs(event.end_date).format(
                              "MMM DD, YYYY"
                            )}`}
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <SafetyCertificateOutlined
                      style={{ fontSize: "22px", color: "#52c41a" }}
                    />
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "block",
                        }}
                      >
                        AVAILABILITY
                      </Text>
                      <Tag color={event.is_active ? "green" : "red"}>
                        {event.is_active ? "Open Access" : "Archived"}
                      </Tag>
                    </div>
                  </div>
                </Space>
                <Divider style={{ margin: "40px 0 20px" }} />
                <div style={{ textAlign: "center" }}>
                  <Text type="secondary" italic>
                    PolyBooking Editorial Team
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          {/* DISCOVER MORE SECTION */}
          {relatedEvents.length > 0 && (
            <div
              style={{
                marginTop: "80px",
                borderTop: "1px solid #eee",
                paddingTop: "50px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                <Title
                  level={3}
                  style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}
                >
                  Discover More
                </Title>
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/client/events")}
                >
                  View all
                </Button>
              </div>
              <Row gutter={[24, 24]}>
                {relatedEvents.map((item) => (
                  <Col xs={24} md={8} key={item.id}>
                    <Link to={`/client/events/${item.id}`}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ height: "180px", overflow: "hidden" }}>
                            <img
                              src={`${BASE_IMAGE_URL}${item.banner}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              alt={item.title}
                            />
                          </div>
                        }
                        style={{ borderRadius: "12px", overflow: "hidden" }}
                      >
                        <Card.Meta
                          title={
                            <span style={{ fontSize: "16px", fontWeight: 700 }}>
                              {item.title}
                            </span>
                          }
                          description={
                            <div style={{ marginTop: "8px" }}>
                              <CalendarOutlined
                                style={{ marginRight: "5px" }}
                              />
                              {dayjs(item.start_date).format("MMM DD, YYYY")}
                            </div>
                          }
                        />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ClientEventDetail;
