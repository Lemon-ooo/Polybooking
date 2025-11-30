import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { Card, Typography, Spin, Button, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export const RoomTypeShow: React.FC = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    axiosInstance
      .get(`/room-types/${id}`)
      .then((res) => {
        console.log("API trả về: ", res.data);

        const item = res.data.data; // đây là object

        if (!item || typeof item !== "object") {
          console.error("❌ Dữ liệu API không hợp lệ");
          return;
        }

        setRoomType(item);
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
        <Spin size="large" />
      </div>
    );

  if (!roomType)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={4}>❌ Không tìm thấy loại phòng</Title>
      </div>
    );

  return (
    <Card
      style={{ maxWidth: 10000, margin: "0 auto", marginTop: 32, padding: 24 }}
    >
      <Title level={2}>Chi tiết loại phòng</Title>

      <Paragraph>
        <Text strong>ID:</Text> {roomType.room_type_id}
      </Paragraph>

      <Paragraph>
        <Text strong>Tên loại phòng:</Text> {roomType.room_type_name}
      </Paragraph>

      <Paragraph>
        <Text strong>Mô tả:</Text>
        <br />
        {roomType.description}
      </Paragraph>

      <Paragraph>
        <Text strong>Giá:</Text>{" "}
        <Tag color="green">
          {Number(roomType.base_price).toLocaleString()} VND
        </Tag>
      </Paragraph>

      <Paragraph>
        <Text strong>Sức chứa tối đa:</Text> {roomType.max_guests}
      </Paragraph>

      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh chính:</Text>
        <br />
        <img
          src={`http://localhost:8000/storage/${roomType.room_type_image}`}
          alt="Room type"
          style={{ width: 300, borderRadius: 10, marginTop: 10 }}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <Text strong>Ảnh phụ:</Text>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {roomType.images?.map((img: any) => (
            <img
              key={img.image_id}
              src={`http://localhost:8000/storage/${img.image_url}`}
              style={{ width: 150, borderRadius: 8 }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <Link to="/admin/room-types">
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            style={{
              borderRadius: 8,
              padding: "6px 16px",
              backgroundColor: "#1677ff",
            }}
          >
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    </Card>
  );
};
