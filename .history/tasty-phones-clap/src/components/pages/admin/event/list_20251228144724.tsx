import React from "react";
import { List, useTable } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import {
  Table,
  Button,
  Space,
  Tooltip,
  message,
  Popconfirm,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface EventType {
  id: number;
  title: string;
  description: string;
  banner: string | null;
  start_date: string;
  end_date: string;
  is_active: number;
}

const { Text } = Typography;

export const EventList: React.FC = () => {
  const navigate = useNavigate();

  // 📌 Lấy dữ liệu bằng useTable
  const { tableProps, refetch, isFetching } = useTable<EventType>({
    resource: "events",
  });

  // ❌ Xoá bằng useDelete
  const { mutate: deleteEvent } = useDelete<EventType>();

  const handleDelete = (id: number) => {
    deleteEvent(
      { resource: "events", id },
      {
        onSuccess: () => {
          message.success("Xoá thành công");
          refetch(); // reload table
        },
        onError: () => message.error("Xoá thất bại!"),
      }
    );
  };

  const baseUrl = "http://localhost:8000/storage/";

  return (
    <List title="Danh sách sự kiện">
      {/* 🔼 Thanh điều khiển phía trên */}
      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <Button type="primary" onClick={() => navigate("/admin/events/create")}>
          ➕ Thêm sự kiện
        </Button>
        <Button onClick={() => refetch()} loading={isFetching}>
          🔄 Làm mới
        </Button>
      </div>

      {/* 📌 Bảng dữ liệu */}
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="Banner"
          render={(_, record: EventType) =>
            record.banner ? (
              <img
                src={`${baseUrl}${record.banner}`}
                alt="banner"
                style={{
                  width: 100,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ) : (
              <Text>—</Text>
            )
          }
        />

        <Table.Column dataIndex="title" title="Tên sự kiện" />

        <Table.Column
          title="Mô tả"
          dataIndex="description"
          ellipsis
          render={(value: string) => (
            <Tooltip title={value}>
              <span>{value || "—"}</span>
            </Tooltip>
          )}
        />

        <Table.Column title="Bắt đầu" dataIndex="start_date" />
        <Table.Column title="Kết thúc" dataIndex="end_date" />

        <Table.Column
          title="Trạng thái"
          render={(_, record: EventType) => (
            <Text type={record.is_active ? "success" : "secondary"}>
              {record.is_active ? "Đang diễn ra" : "Tắt"}
            </Text>
          )}
        />

        <Table.Column
          title="Hành động"
          render={(_, record: EventType) => (
            <Space>
              <Tooltip title="Xem chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/admin/events/show/${record.id}`)}
                />
              </Tooltip>

              <Tooltip title="Sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/admin/events/edit/${record.id}`)}
                />
              </Tooltip>

              <Popconfirm
                title="Bạn chắc chắn muốn xoá?"
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
