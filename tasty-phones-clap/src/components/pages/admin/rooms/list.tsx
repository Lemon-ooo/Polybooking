import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import {
  Table,
  Tag,
  Typography,
  Alert,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  Room,
  getRoomStatusColor,
  getRoomStatusLabel,
  formatPrice,
} from "../../../../interfaces/rooms";

const { Text } = Typography;

export const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const { tableProps, queryResult } = useTable<Room>({
    resource: "rooms",
  });
  const { data, isLoading, isError, error } = queryResult || {};

  const { mutate: deleteRoom } = useDelete<Room>();

  const handleDelete = (id: number) => {
    deleteRoom(
      { resource: "rooms", id: id.toString() },
      {
        onSuccess: () => {
          message.success("Xóa phòng thành công");
        },
        onError: () => {
          message.error("Xóa phòng thất bại");
        },
      }
    );
  };

  if (isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error?.message || "Không thể kết nối đến API."}
        type="error"
        showIcon
      />
    );
  }

  return (
    <List>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Button
          type="primary"
          onClick={() => navigate("/admin/rooms/create")}
          style={{ marginRight: 16 }}
        >
          Thêm phòng mới
        </Button>
        <Button onClick={() => queryResult?.refetch?.()} loading={isLoading}>
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>
          Tổng số: {data?.total || 0} phòng
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="room_id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 1000 }}
      >
        <Table.Column dataIndex="room_number" title="Số phòng" sorter />
        <Table.Column
          dataIndex={["room_type", "name"]}
          title="Loại phòng"
          render={(value, record: Room) => (
            <Tooltip title={record.room_type.description}>
              <span>{value}</span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="price"
          title="Giá"
          render={(price: string) => formatPrice(price)}
          sorter={(a: Room, b: Room) =>
            parseFloat(a.price) - parseFloat(b.price)
          }
        />
        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(status: string) => (
            <Tag color={getRoomStatusColor(status)}>
              {getRoomStatusLabel(status)}
            </Tag>
          )}
          filters={[
            { text: "Trống", value: "trống" },
            { text: "Đang sử dụng", value: "occupied" },
            { text: "Bảo trì", value: "maintenance" },
          ]}
          onFilter={(value, record: Room) => record.status === value}
        />
        <Table.Column
          dataIndex="description"
          title="Mô tả"
          ellipsis
          render={(description: string) => (
            <Tooltip title={description}>
              <span>{description || "Không có mô tả"}</span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="amenities"
          title="Tiện nghi"
          render={(amenities: any[]) => (
            <Tooltip
              title={
                amenities?.map((a) => a.name).join(", ") || "Không có tiện nghi"
              }
            >
              <span>
                {amenities?.length > 0
                  ? `${amenities.length} tiện nghi`
                  : "Không có"}
              </span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} />}
          sorter
        />
        {/* Cột Hành động */}
        <Table.Column
          title="Hành động"
          render={(_, record: Room) => (
            <Space>
              <Button
                type="default"
                onClick={() => navigate(`/admin/rooms/edit/${record.room_id}`)}
              >
                Sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc muốn xóa phòng này không?"
                onConfirm={() => handleDelete(record.room_id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
