// src/components/pages/client/rooms/ClientRooms.tsx
import React from "react";
import { useTable } from "@refinedev/antd";
import { Card, Row, Col, Typography, Spin, Pagination, Tag } from "antd";
import {
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
} from "../../../../interfaces/rooms";

const { Title, Text } = Typography;

export const ClientRooms: React.FC = () => {
  // Lấy dữ liệu phòng từ refine
  const { tableProps, tableQueryResult, setCurrent } = useTable({
    resource: "rooms",
    pagination: {
      pageSize: 6, // mỗi trang 6 phòng
    },
  });

  const rooms = tableQueryResult?.data?.data ?? [];
  const total = tableQueryResult?.data?.meta?.total ?? 0;
  const currentPage = tableQueryResult?.data?.meta?.page ?? 1;
  const isLoading = tableQueryResult?.isLoading;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
        Danh sách phòng
      </Title>

      <Row gutter={[24, 24]}>
        {rooms.length === 0 ? (
          <Col span={24} style={{ textAlign: "center" }}>
            <Text type="secondary">Hiện chưa có phòng nào.</Text>
          </Col>
        ) : (
          rooms.map((room: any) => (
            <Col xs={24} sm={12} md={8} key={room.room_id}>
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
          ))
        )}
      </Row>

      {/* Pagination */}
      {rooms.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Pagination
            current={currentPage}
            pageSize={tableProps.pagination?.pageSize || 6}
            total={total}
            showSizeChanger={false}
            onChange={(page) => setCurrent?.(page)}
          />
        </div>
      )}
    </div>
  );
};
