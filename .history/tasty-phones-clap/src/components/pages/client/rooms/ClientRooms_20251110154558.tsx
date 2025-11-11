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
  Alert,
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

  // Debug dữ liệu
  console.log("=== CLIENT ROOMS DEBUG ===");
  console.log("tableProps:", tableProps);
  console.log("tableQueryResult:", tableQueryResult);
  console.log("dataSource:", tableProps?.dataSource);
  console.log("raw data:", tableQueryResult?.data);

  // Lấy dữ liệu theo nhiều cách để đảm bảo compatibility
  const rooms = React.useMemo(() => {
    if (tableProps?.dataSource && tableProps.dataSource.length > 0) {
      return tableProps.dataSource;
    }
    if (tableQueryResult?.data?.data) {
      return tableQueryResult.data.data;
    }
    if (Array.isArray(tableQueryResult?.data)) {
      return tableQueryResult.data;
    }
    return [];
  }, [tableProps?.dataSource, tableQueryResult?.data]);

  // Lấy thông tin phân trang
  const total = React.useMemo(() => {
    return (
      tableProps?.pagination?.total ||
      tableQueryResult?.data?.total ||
      tableQueryResult?.data?.meta?.total ||
      0
    );
  }, [tableProps?.pagination?.total, tableQueryResult?.data]);

  const currentPage = React.useMemo(() => {
    return (
      tableProps?.pagination?.current || tableQueryResult?.data?.meta?.page || 1
    );
  }, [tableProps?.pagination?.current, tableQueryResult?.data]);

  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  // Hiển thị lỗi nếu có
  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối đến server."}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => tableQueryResult?.refetch()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  // Hiển thị loading
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải danh sách phòng...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Danh sách phòng
      </Title>

      {/* Thông tin debug (có thể ẩn đi sau khi fix xong) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            background: "#f5f5f5",
            padding: 8,
            marginBottom: 16,
            borderRadius: 6,
            fontSize: 12,
          }}
        >
          <Text type="secondary">
            Debug: {rooms.length} phòng | Total: {total} | Page: {currentPage}
          </Text>
        </div>
      )}

      {rooms.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Hiện chưa có phòng nào.
          </Text>
          <br />
          <Button
            type="primary"
            style={{ marginTop: 16 }}
            onClick={() => tableQueryResult?.refetch()}
          >
            Tải lại
          </Button>
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {rooms.map((room: any) => (
              <Col xs={24} sm={12} lg={8} key={room.id}>
                <Card
                  hoverable
                  style={{ height: "100%" }}
                  cover={
                    <div style={{ height: 200, overflow: "hidden" }}>
                      <img
                        alt={
                          room.room_type?.name || `Phòng ${room.room_number}`
                        }
                        src={
                          room.room_type?.image_url ||
                          room.image_url ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button type="primary" size="small">
                      Xem chi tiết
                    </Button>,
                    <Button size="small">Đặt phòng</Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Title level={4} style={{ margin: 0 }}>
                        {room.room_type?.name || `Phòng ${room.room_number}`}
                      </Title>
                    }
                    description={
                      <div>
                        <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                          {formatPrice(room.price)} / đêm
                        </Text>
                        <br />
                        <Tag
                          color={getRoomStatusColor(room.status)}
                          style={{ marginTop: 8, marginBottom: 8 }}
                        >
                          {getRoomStatusLabel(room.status)}
                        </Tag>
                        <br />
                        <Text type="secondary">
                          {room.description ||
                            room.room_type?.description ||
                            "Không có mô tả"}
                        </Text>
                        {room.amenities && room.amenities.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Tiện nghi:{" "}
                              {room.amenities
                                .slice(0, 2)
                                .map((a: any) => a.name)
                                .join(", ")}
                              {room.amenities.length > 2 &&
                                ` +${room.amenities.length - 2} khác`}
                            </Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {total > 6 && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Pagination
                current={currentPage}
                pageSize={tableProps.pagination?.pageSize || 6}
                total={total}
                showSizeChanger={false}
                onChange={(page) => setCurrent?.(page)}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} phòng`
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
