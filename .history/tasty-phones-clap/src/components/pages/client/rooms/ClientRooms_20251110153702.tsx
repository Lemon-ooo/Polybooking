// src/components/pages/client/rooms/ClientRooms.tsx
import React from "react";
import { useTable } from "@refinedev/antd";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Tag,
  Pagination,
  Button,
} from "antd";
import {
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
  Room,
} from "../../../../interfaces/rooms";

const { Title, Text } = Typography;

export const ClientRooms: React.FC = () => {
  const { tableProps, tableQueryResult, setCurrent } = useTable<Room>({
    resource: "rooms",
    pagination: { pageSize: 6 },
  });

  const rooms =
    tableQueryResult?.data?.data?.map((r) => ({
      ...r,
      id: r.room_id,
    })) || [];
  const total = tableQueryResult?.data?.meta?.total || 0;
  const currentPage = tableQueryResult?.data?.meta?.page || 1;
  const isLoading = tableQueryResult?.isLoading;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Danh sách phòng
      </Title>

      {rooms.length === 0 ? (
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center" }}
        >
          Hiện chưa có phòng nào.
        </Text>
      ) : (
        <>
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
                  <Tag
                    color={getRoomStatusColor(room.status)}
                    style={{ marginTop: 8 }}
                  >
                    {getRoomStatusLabel(room.status)}
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination giống admin */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Pagination
              current={currentPage}
              pageSize={tableProps.pagination?.pageSize || 6}
              total={total}
              showSizeChanger={false}
              onChange={(page) => setCurrent?.(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};
