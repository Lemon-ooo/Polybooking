import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete, useCustomMutation, useInvalidate  } from "@refinedev/core";

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
  Switch,
} from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const EventList: React.FC = () => {
  const navigate = useNavigate();
  const invalidate = useInvalidate();

  const { tableProps, queryResult } = useTable({
    resource: "events", // ✅ API: /events
  });

  const { data, isLoading, isError, error } = queryResult || {};

  const { mutate: deleteEvent } = useDelete();
  const { mutate: toggleEvent } = useCustomMutation();

  // 🗑️ Xóa event
  const handleDelete = (id: number) => {
    deleteEvent(
      { resource: "events", id },
      {
        onSuccess: () => {
          message.success("Xóa sự kiện thành công");
          queryResult?.refetch?.();
        },
        onError: () => {
          message.error("Xóa sự kiện thất bại");
        },
      }
    );
  };

  /// 🔁 Toggle active/inactive
const handleToggle = (id: number) => {
  toggleEvent(
    {
      url: `events/${id}/toggle`,
      method: "patch",
      values: {},
    },
    {
      onSuccess: () => {
        message.success("Cập nhật trạng thái thành công");

        // ✅ CẬP NHẬT LẠI TABLE NGAY
        invalidate({
          resource: "events",
          invalidates: ["list"],
        });
      },
      onError: (error) => {
        console.error(error);
        message.error("Cập nhật trạng thái thất bại");
      },
    }
  );
};

  if (isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error?.message || "Không thể kết nối API"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <List>
      {/* Header actions */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Button
          type="primary"
          onClick={() => navigate("/admin/events/create")}
          style={{ marginRight: 16 }}
        >
          Thêm sự kiện
        </Button>

        <Button onClick={() => queryResult?.refetch?.()} loading={isLoading}>
          Làm mới
        </Button>

      <Text style={{ marginLeft: 16 }}>
  Tổng số: {tableProps.pagination?.total || 0} sự kiện
</Text>

      </div>

      <Table
        {...tableProps}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 1000 }}
      >
        <Table.Column dataIndex="title" title="Tên sự kiện" sorter />

        <Table.Column
          dataIndex="start_date"
          title="Ngày bắt đầu"
          render={(value: string) => <DateField value={value} />}
          sorter
        />

        <Table.Column
          dataIndex="end_date"
          title="Ngày kết thúc"
          render={(value: string) => <DateField value={value} />}
          sorter
        />

        <Table.Column
          dataIndex="is_active"
          title="Trạng thái"
          render={(active: boolean, record: any) => (
            <Space>
              <Tag color={active ? "green" : "red"}>
                {active ? "Đang hoạt động" : "Tắt"}
              </Tag>
              <Switch
                checked={active}
                onChange={() => handleToggle(record.id)}
              />
            </Space>
          )}
          filters={[
            { text: "Đang hoạt động", value: 1 },
            { text: "Tắt", value: 0 },
          ]}
          onFilter={(value, record: any) =>
            Number(record.is_active) === Number(value)
          }
        />

        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} />}
          sorter
        />

        {/* Actions */}
        <Table.Column
          title="Hành động"
          render={(_, record: any) => (
            <Space>
              <Tooltip title="Chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() =>
                    navigate(`/admin/events/show/${record.id}`)
                  }
                />
              </Tooltip>

              <Tooltip title="Sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    navigate(`/admin/events/edit/${record.id}`)
                  }
                />
              </Tooltip>

              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc muốn xóa sự kiện này?"
                  onConfirm={() => handleDelete(record.id)}
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
