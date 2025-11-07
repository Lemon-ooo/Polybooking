// components/pages/admin/rooms/list.tsx
import React from "react";
import {
  List,
  useTable,
  DateField,
  ShowButton,
  EditButton,
  DeleteButton,
  GetListResponse,
  BaseRecord,
  HttpError,
} from "@refinedev/antd";
import { Table, Space, Tag, Alert, Button, Typography } from "antd";

const { Text } = Typography;

export const RoomList: React.FC = () => {
  const { tableProps, tableQueryResult } = useTable();

  // ✅ Sửa lỗi TypeScript - truy cập data đúng cách
  const { data, isLoading, isError, error } = tableQueryResult;

  console.log("API response:", data);
  console.log("Table props:", tableProps);

  if (isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={
          error?.message ||
          "Không thể kết nối đến API. Vui lòng kiểm tra kết nối."
        }
        type="error"
        showIcon
      />
    );
  }

  return (
    <List>
      {/* Debug info */}
      <div style={{ marginBottom: 16 }}>
        <Button
          onClick={() => tableQueryResult.refetch()}
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
      >
        <Table.Column dataIndex="id" title="ID" width={80} />
        <Table.Column dataIndex="name" title="Tên phòng" />
        <Table.Column
          dataIndex="type"
          title="Loại phòng"
          render={(value) => value || "Chưa có"}
        />
        <Table.Column
          dataIndex="price"
          title="Giá"
          render={(value) =>
            value ? `${value?.toLocaleString()} VND` : "0 VND"
          }
        />
        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(value) => {
            if (!value) return <Tag>Không xác định</Tag>;

            const statusConfig = {
              available: { color: "green", text: "Có sẵn" },
              occupied: { color: "red", text: "Đã đặt" },
              maintenance: { color: "orange", text: "Bảo trì" },
            };

            const config = statusConfig[value as keyof typeof statusConfig] || {
              color: "default",
              text: value,
            };
            return <Tag color={config.color}>{config.text}</Tag>;
          }}
        />
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value) => (value ? <DateField value={value} /> : "N/A")}
        />
        <Table.Column
          title="Hành động"
          dataIndex="actions"
          fixed="right"
          width={150}
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                onSuccess={() => {
                  // Refresh data after delete
                  tableQueryResult.refetch();
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
