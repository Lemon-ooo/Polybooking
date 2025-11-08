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
} from "antd";
import {
  Room,
  getRoomStatusColor,
  getRoomStatusLabel,
  formatPrice,
} from "../../../../interfaces/rooms";

const { Text } = Typography;

export const RoomList: React.FC = () => {
  const { tableProps, queryResult } = useTable<Room>({
    resource: "room-types",
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
        type="error"
        showIcon
      />
    );
  }

  return (
    <List>
      <div style={{ marginBottom: 16 }}>
        <Button
          onClick={() => queryResult?.refetch?.()}
          loading={isLoading}
          type="primary"
        >
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>
          Tổng số: {data?.total || 0} phòng
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
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
        {/* Cột Hành động - Nút Xóa */}
        <Table.Column
          title="Hành động"
          render={(_, record: Room) => (
            <Popconfirm
              title="Bạn có chắc muốn xóa phòng này không?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger size="small">
                Xóa
              </Button>
            </Popconfirm>
          )}
        />
      </Table>
    </List>
  );
};
