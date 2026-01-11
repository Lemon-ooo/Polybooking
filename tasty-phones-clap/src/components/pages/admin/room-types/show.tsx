import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import {
  Card,
  Typography,
  Spin,
  Button,
  Tag,
  Divider,
  Space,
  Empty,
} from "antd";
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
        const item = res.data.data;
        if (item && typeof item === "object") {
          setRoomType(item);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi API: ", err);
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
      style={{ maxWidth: 1000, margin: "0 auto", marginTop: 32, padding: 24 }}
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

      {/* ================= AMENITIES ================= */}
      <Divider />
      <Paragraph>
        <Text strong>Tiện ích:</Text>
      </Paragraph>

      {roomType.amenities && roomType.amenities.length > 0 ? (
        <Space wrap>
          {roomType.amenities.map((amenity: any) => (
            <Tag key={amenity.amenity_id} color="blue">
              {amenity.amenity_name}
            </Tag>
          ))}
        </Space>
      ) : (
        <Empty
          description="Không có tiện ích"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {/* ================= MAIN IMAGE ================= */}
      <Divider />
      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh chính:</Text>
        <br />
        {roomType.room_type_image ? (
          <img
            src={`http://localhost:8000/storage/${roomType.room_type_image}`}
            alt="Room type"
            style={{ width: 300, borderRadius: 10, marginTop: 10 }}
          />
        ) : (
          <Text type="secondary">Không có ảnh đại diện</Text>
        )}
      </div>

      {/* ================= SUB IMAGES ================= */}
      <Divider />
      <div style={{ marginTop: 16 }}>
        <Text strong>Ảnh phụ:</Text>
        <div
          style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}
        >
          {roomType.images && roomType.images.length > 0 ? (
            roomType.images.map((img: any) => (
              <img
                key={img.image_id}
                src={`http://localhost:8000/storage/${img.image_url}`}
                style={{ width: 150, borderRadius: 8 }}
              />
            ))
          ) : (
            <Text type="secondary">Không có ảnh phụ</Text>
          )}
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <Divider />
      <div style={{ marginTop: 16 }}>
        <Text strong>Đánh giá của khách:</Text>

        {/* Nếu có tổng rating */}
        {roomType.total_reviews > 0 && (
          <Paragraph style={{ marginTop: 6 }}>
            ⭐ <strong>{roomType.avg_rating}</strong> / 5.0 —
            {roomType.total_reviews} đánh giá
          </Paragraph>
        )}

        {roomType.reviews && roomType.reviews.length > 0 ? (
          <div style={{ marginTop: 10 }}>
            {roomType.reviews.map((rev: any, index: number) => (
              <Card
                key={index}
                size="small"
                style={{
                  marginBottom: 12,
                  background: "#fafafa",
                  borderRadius: 8,
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>{rev.user?.user_name || "Ẩn danh"}</Text>

                  <Text>⭐ {rev.rating}/5</Text>

                  {rev.comment && <Text>{rev.comment}</Text>}

                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(rev.created_at).toLocaleDateString("vi-VN")}
                  </Text>
                </Space>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            style={{ marginTop: 12 }}
            description="Chưa có đánh giá"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      {/* ================= BACK BUTTON ================= */}
      <Divider />
      <div style={{ marginTop: 24 }}>
        <Link to="/admin/room-types">
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            style={{ borderRadius: 8 }}
          >
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    </Card>
  );
};
