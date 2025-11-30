// src/pages/rooms/list.tsx
import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import {
  Table,
  Tag,
  Typography,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Space,
  Alert,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export const RoomList: React.FC = () => {
  const navigate = useNavigate();

  // DÙNG CÙNG CÁCH VỚI SERVICES → CHẮC CHẮN HIỂN THỊ
  const { tableProps, tableQueryResult } = useTable({
    resource: "rooms",
    pagination: { mode: "off" },
  });

  const { mutate: deleteRoom } = useDelete();

  // DÙNG tableProps.dataSource NHƯ SERVICES → CÓ DATA NGAY
  const dataSource = tableProps.dataSource || [];

  const handleDelete = (id: number) => {
    deleteRoom(
      { resource: "rooms", id: id.toString() },
      {
        onSuccess: () => {
          message.success("Xóa phòng thành công");
          tableQueryResult?.refetch?.();
        },
        onError: () => message.error("Xóa thất bại"),
      }
    );
  };

  if (tableQueryResult?.isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={tableQueryResult.error?.message || "Không thể kết nối API"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <List title="Danh sách phòng">
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button
            onClick={() => tableQueryResult?.refetch?.()}
            loading={tableQueryResult?.isLoading}
          >
            Làm mới
          </Button>
          <Text style={{ marginLeft: 16 }}>
            Tổng: {dataSource.length} phòng
          </Text>
        </div>
        <Button type="primary" onClick={() => navigate("/admin/rooms/create")}>
          Thêm phòng mới
        </Button>
        <Button onClick={() => queryResult?.refetch?.()} loading={isLoading}>
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>
          Tổng số: {data?.meta?.total || 0} phòng
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="room_id"
        loading={tableQueryResult?.isLoading}
        dataSource={dataSource}
        scroll={{ x: 1200 }}
      >
        <Table.Column dataIndex="room_number" title="Số phòng" />

        <Table.Column
          dataIndex={["room_type", "room_type_name"]}
          title="Loại phòng"
          render={(value, record: Room) => (
            <Tooltip title={record.room_type?.description}>
              <span>{value}</span>
            </Tooltip>
          )}
        />

        <Table.Column
          dataIndex="room_status"
          title="Trạng thái"
          render={(status: string) => (
            <Tag color={getRoomStatusColor(status)}>
              {getRoomStatusLabel(status)}
            </Tag>
          )}
          filters={[
            { text: "Trống", value: "available" },
            { text: "Đang sử dụng", value: "occupied" },
            { text: "Bảo trì", value: "maintenance" },
          ]}
          onFilter={(value, record: Room) => record.room_status === value}
        />

        <Table.Column
          dataIndex="description"
          title="Mô tả"
          ellipsis
          render={(text: string) => text || "Không có mô tả"}
        />
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => (
            <DateField value={value} format="DD/MM/YYYY" />
          )}
        />

        <Table.Column
          title="Hành động"
          fixed="right"
          render={(_, record: any) => (
            <Space>
              <Button
                size="small"
                onClick={() => navigate(`/admin/rooms/edit/${record.room_id}`)}
              >
                Sửa
              </Button>
              <Popconfirm
                title="Xóa phòng này?"
                onConfirm={() => handleDelete(record.room_id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger size="small">
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default RoomList;
