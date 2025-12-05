import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Card, Typography, Spin, Button, Tag, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

const DATETIME_FORMAT = "DD/MM/YYYY HH:mm:ss";

export const EventShow: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    axiosInstance
      .get(`/events/${id}`)
      .then((res) => {
        console.log("API trả về: ", res.data);

        const item = res.data.data;

        if (!item || typeof item !== "object") {
          console.error("❌ Dữ liệu API không hợp lệ");
          return;
        }

        setEvent(item);
      })
      .catch((err) => {
        console.log("❌ Lỗi API: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" tip="Đang tải chi tiết sự kiện..." />
      </div>
    );

  if (!event)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={4}>❌ Không tìm thấy sự kiện</Title>
      </div>
    );

  return (
    <Card
      style={{ maxWidth: 10000, margin: "0 auto", marginTop: 32, padding: 24 }}
      title={<Title level={2}>Chi tiết Sự kiện: {event.name}</Title>}
      extra={
        <Link to="/admin/events">
          {/* Cập nhật đường dẫn quay lại */}
          <Button type="default" icon={<ArrowLeftOutlined />}>
            Quay lại danh sách
          </Button>
        </Link>
      }
    >
      {/* <Paragraph>
        <Text strong>ID:</Text> {event.id}
      </Paragraph>
      <Divider dashed /> */}

      <Paragraph>
        <Text strong>Tên sự kiện:</Text> {event.name}
      </Paragraph>

      <Paragraph>
        <Text strong>Địa điểm:</Text> <Tag color="blue">{event.location}</Tag>
      </Paragraph>

      <Paragraph>
        <Text strong>Ngày diễn ra:</Text>{" "}
        <Tag color="volcano">{dayjs(event.date).format(DATETIME_FORMAT)}</Tag>
      </Paragraph>
      <Divider dashed />

      <Paragraph>
        <Text strong>Mô tả chi tiết:</Text>
        <br />
        <Paragraph style={{ whiteSpace: "pre-wrap" }}>
          {event.description}
        </Paragraph>
      </Paragraph>

      <Divider dashed />

      {/* HIỂN THỊ ẢNH BÌA */}
      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh Bìa Sự kiện:</Text>
        <br />
        {event.image ? (
          <img
            src={`http://localhost:8000/storage/${event.image}`}
            alt={event.name}
            style={{
              width: 400,
              borderRadius: 10,
              marginTop: 10,
              objectFit: "cover",
            }}
          />
        ) : (
          <Text italic type="secondary">
            (Không có ảnh bìa)
          </Text>
        )}
      </div>
    </Card>
  );
};
