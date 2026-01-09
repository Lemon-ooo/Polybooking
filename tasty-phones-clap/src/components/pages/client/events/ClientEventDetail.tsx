import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "antd";
import {
  CalendarOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../../../../providers/data/axiosConfig";

const { Title, Paragraph, Text } = Typography;

const BASE_IMAGE_URL = "http://localhost:8000/storage/";

const ClientEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosInstance.get(`/events/${id}`);
        setEvent(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải sự kiện..." />
      </div>
    );

  if (!event)
    return (
      <div style={{ padding: 100 }}>
        <Empty description="Không tìm thấy sự kiện" />
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button onClick={() => navigate("/client/events")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {/* 1. BACKGROUND BANNER */}
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
            filter: "blur(20px) brightness(0.6)",
            transform: "scale(1.1)",
          }}
          alt="background"
        />

        {/* NÚT QUAY LẠI - PHONG CÁCH GLASSMORPHISM */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "calc(50% - 500px)", // Căn lề theo container content (1000px)
            zIndex: 10,
            padding: "0 20px",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "50px",
              height: "40px",
              padding: "0 20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
            className="btn-back-hover"
          >
            Back to Event List
          </Button>
        </div>
      </div>

      {/* 2. MAIN CONTAINER */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "-180px auto 0",
          padding: "0 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: "20px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
          }}
          styles={{ body: { padding: "50px 60px" } }}
        >
          {/* TIÊU ĐỀ */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Tag
              color="gold"
              style={{
                marginBottom: "16px",
                borderRadius: "4px",
                padding: "2px 12px",
              }}
            >
              OFFICIAL EVENT
            </Tag>
            <Title
              style={{
                fontSize: "42px",
                margin: "10px 0",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
              }}
            >
              {event.title}
            </Title>
            <Text
              type="secondary"
              style={{ fontSize: "15px", letterSpacing: "0.5px" }}
            >
              <GlobalOutlined style={{ marginRight: 8 }} /> Organized by
              PolyBooking Group
            </Text>
          </div>

          {/* ẢNH MINH HỌA TINH TẾ */}
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div
              style={{
                display: "inline-block",
                width: "90%",
                maxWidth: "650px",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={`${BASE_IMAGE_URL}${event.banner}`}
                style={{ width: "100%", height: "auto", display: "block" }}
                alt="event summary"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30")
                }
              />
            </div>
          </div>

          <Divider style={{ marginBottom: "40px" }} />

          {/* CHI TIẾT NỘI DUNG */}
          <Row gutter={[48, 40]}>
            <Col xs={24} lg={15}>
              <Title
                level={4}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "25px",
                  fontSize: "26px",
                  color: "#1a1a1a",
                }}
              >
                Event Overview
              </Title>
              <Paragraph
                style={{
                  fontSize: "17px",
                  lineHeight: "2.0",
                  color: "#4a4a4a",
                  whiteSpace: "pre-line",
                  textAlign: "justify",
                }}
              >
                {event.description}
              </Paragraph>
            </Col>

            <Col xs={24} lg={9}>
              <div
                style={{
                  backgroundColor: "#fafafa",
                  padding: "35px",
                  borderRadius: "18px",
                  border: "1px solid #f0f0f0",
                }}
              >
                <Title
                  level={5}
                  style={{
                    marginBottom: "25px",
                    fontSize: "18px",
                    color: "#1890ff",
                  }}
                >
                  Schedules & Status
                </Title>

                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <CalendarOutlined
                      style={{
                        color: "#1890ff",
                        fontSize: "18px",
                        marginTop: "4px",
                      }}
                    />
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "block",
                          color: "#bfbfbf",
                        }}
                      >
                        START DATE
                      </Text>
                      <Text strong style={{ fontSize: "15px" }}>
                        {dayjs(event.start_date).format("MMMM DD, YYYY")}
                      </Text>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <ClockCircleOutlined
                      style={{
                        color: "#faad14",
                        fontSize: "18px",
                        marginTop: "4px",
                      }}
                    />
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "block",
                          color: "#bfbfbf",
                        }}
                      >
                        END DATE
                      </Text>
                      <Text strong style={{ fontSize: "15px" }}>
                        {dayjs(event.end_date).format("MMMM DD, YYYY")}
                      </Text>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <SafetyCertificateOutlined
                      style={{
                        color: "#52c41a",
                        fontSize: "18px",
                        marginTop: "4px",
                      }}
                    />
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "block",
                          color: "#bfbfbf",
                        }}
                      >
                        EVENT STATUS
                      </Text>
                      <Tag
                        color={event.is_active ? "green" : "red"}
                        style={{ margin: "5px 0 0 0", borderRadius: "4px" }}
                      >
                        {event.is_active ? "Active Now" : "Closed"}
                      </Tag>
                    </div>
                  </div>
                </Space>

                <Divider style={{ margin: "30px 0" }} />

                <div
                  style={{
                    textAlign: "center",
                    color: "#bfbfbf",
                    fontSize: "13px",
                  }}
                >
                  <Text type="secondary italic">
                    Premium Service by PolyBooking
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ClientEventDetail;
