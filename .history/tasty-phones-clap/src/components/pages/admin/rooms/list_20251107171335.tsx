import React from "react";
import {
  List,
  useTable,
  DateField,
  ShowButton,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";

export const RoomList: React.FC = () => {
  const { tableProps } = useTable();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="name" title="Tên phòng" />
        <Table.Column dataIndex="type" title="Loại phòng" />
        <Table.Column
          dataIndex="price"
          title="Giá"
          render={(value) => `${value?.toLocaleString()} VND`}
        />
        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(value) => (
            <Tag
              color={
                value === "available"
                  ? "green"
                  : value === "occupied"
                  ? "red"
                  : "orange"
              }
            >
              {value === "available"
                ? "Có sẵn"
                : value === "occupied"
                ? "Đã đặt"
                : "Bảo trì"}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          render={(value) => <DateField value={value} />}
        />
        <Table.Column
          title="Hành động"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
