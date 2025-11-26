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
import {
  getRoomStatusColor,
  getRoomStatusLabel,
  formatPrice,
} from "../../../../interfaces/rooms";

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
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Button onClick={() => tableQueryResult?.refetch?.()} loading={tableQueryResult?.isLoading}>
            Làm mới
          </Button>
          <Text style={{ marginLeft: 16 }}>
            Tổng: {dataSource.length} phòng
          </Text>
        </div>
        <Button type="primary" onClick={() => navigate("/admin/rooms/create")}>
          Thêm phòng mới
        </Button>
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
          title="Loại phòng"
          render={(_, record: any) => (
            <Tooltip title={record.room_type?.description || ""}>
              <span>{record.room_type?.name || "Chưa chọn"}</span>
            </Tooltip>
          )}
        />

        <Table.Column
          dataIndex="price"
          title="Giá"
          render={(price: string) => formatPrice(price || "0")}
        />

        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(status: string) => (
            <Tag color={getRoomStatusColor(status)}>
              {getRoomStatusLabel(status)}
            </Tag>
          )}
        />

        <Table.Column
          dataIndex="description"
          title="Mô tả"
          ellipsis
          render={(text: string) => text || "Không có mô tả"}
        />

        <Table.Column
          title="Tiện nghi"
          render={(_, record: any) => {
            const amenities = record.amenities || [];
            return (
              <Tooltip title={amenities.map((a: any) => a.name).join(", ") || "Không có"}>
                <span>{amenities.length ? `${amenities.length} tiện nghi` : "Không có"}</span>
              </Tooltip>
            );
          }}
        />

        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} format="DD/MM/YYYY" />}
        />

        <Table.Column
          title="Hành động"
          fixed="right"
          render={(_, record: any) => (
            <Space>
              <Button size="small" onClick={() => navigate(`/admin/rooms/edit/${record.room_id}`)}>
                Sửa
              </Button>
              <Popconfirm
                title="Xóa phòng này?"
                onConfirm={() => handleDelete(record.room_id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger size="small">Xóa</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default RoomList;