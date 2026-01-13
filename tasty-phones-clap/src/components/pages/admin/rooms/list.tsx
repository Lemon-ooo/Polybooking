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
} from "../../../../interfaces/rooms";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

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
          Tổng số: {data?.meta?.total || 0} phòng
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
            { text: "Đã đặt", value: "booked" },
            { text: "Đang sử dụng", value: "in_use" },
            { text: "Bảo trì", value: "maintenance" },
          ]}
          onFilter={(value, record: Room) => record.room_status === value}
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
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} />}
          sorter
        />

        <Table.Column
          title="Hành động"
          render={(_, record: Room) => (
            <Space>
              <Tooltip title="Chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() =>
                    navigate(`/admin/rooms/show/${record.room_id}`)
                  }
                />
              </Tooltip>

              <Tooltip title="Sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    navigate(`/admin/rooms/edit/${record.room_id}`)
                  }
                />
              </Tooltip>

              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc muốn xóa phòng này không?"
                  onConfirm={() => handleDelete(record.room_id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
