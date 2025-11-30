import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Typography, Spin, Tag, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export const RoomShow: React.FC = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [roomTypeName, setRoomTypeName] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Lấy thông tin phòng
        const res = await axios.get(`http://localhost:8000/api/rooms/${id}`);
        const data = res.data.data;
        setRoom(data);

        // Lấy tên loại phòng
        const typeRes = await axios.get(
          `http://localhost:8000/api/room-types/${data.room_type_id}`
        );
        setRoomTypeName(typeRes.data.data.room_type_name);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" />
      </div>
    );

  if (!room)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={4}>❌ Không tìm thấy phòng</Title>
      </div>
    );

  return (
    <Card
      style={{ maxWidth: 10000, margin: "0 auto", marginTop: 32, padding: 24 }}
    >
      <Title level={2}>Chi tiết phòng</Title>

      <Paragraph>
        <Text strong>ID phòng:</Text> {room.room_id}
      </Paragraph>

      <Paragraph>
        <Text strong>Số phòng:</Text> {room.room_number}
      </Paragraph>

      <Paragraph>
        <Text strong>Loại phòng:</Text> <Tag color="blue">{roomTypeName}</Tag>
      </Paragraph>

      <Paragraph>
        <Text strong>Trạng thái:</Text>{" "}
        <Tag
          color={
            room.room_status === "available"
              ? "green"
              : room.room_status === "occupied"
              ? "red"
              : "orange"
          }
        >
          {room.room_status}
        </Tag>
      </Paragraph>

      <Paragraph>
        <Text strong>Mô tả:</Text>
        <br />
        {room.description}
      </Paragraph>

      <div style={{ marginTop: 32 }}>
        <Link to="/admin/rooms">
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            style={{
              borderRadius: 8,
              padding: "6px 16px",
            }}
          >
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    </Card>
  );
};
