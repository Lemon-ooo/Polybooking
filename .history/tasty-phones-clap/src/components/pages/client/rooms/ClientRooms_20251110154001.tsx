// src/components/pages/client/rooms/ClientRooms.tsx
import React from "react";
import { useTable, List } from "@refinedev/antd";
import { Card, Row, Col, Typography, Spin, Pagination, Tag } from "antd";
import {
  Room,
  RoomListResponse,
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
} from "../../../../interfaces/rooms";

const { Title, Text } = Typography;

export const ClientRooms: React.FC = () => {
  const { tableQueryResult, tableProps, setCurrent } = useTable<Room>({
    resource: "rooms",
    pagination: {
      pageSize: 6,
    },
  });

  const data = tableQueryResult?.data as RoomListResponse | undefined;
  const rooms: Room[] =
    data?.data.map((r) => ({
      ...r,
      id: r.room_id, // map room_id sang id cho Refine
    })) || [];

  const total = data?.meta?.total ?? 0;
  const currentPage = data?.meta?.page ?? 1;
  const isLoading = tableQueryResult?.isLoading;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!rooms.length) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <Text type="secondary">Hiện chưa có phòng nào.</Text>
      </div>
    );
  }

  // Lấy pageSize an toàn
  const pageSize =
    typeof tableProps.pagination === "object"
      ? tableProps.pagination.pageSize
      : 6;

  return (
    <List>
      <div style={{ padding: "24px" }}>
        <Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
          Danh sách phòng
        </Title>

        <Row gutter={[24, 24]}>
          {rooms.map((room) => (
            <Col xs={24} sm={12} md={8} key={room.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={room.room_type?.name || room.room_number}
                    src={
                      room.room_type?.image_url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
              >
                <Title level={5}>
                  {room.room_type?.name || `Phòng ${room.room_number}`}
                </Title>
                <Text strong>{formatPrice(room.price)} / đêm</Text>
                <br />
                <Tag color={getRoomStatusColor(room.status)}>
                  {getRoomStatusLabel(room.status)}
                </Tag>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            onChange={(page) => setCurrent?.(page)}
          />
        </div>
      </div>
    </List>
  );
};
