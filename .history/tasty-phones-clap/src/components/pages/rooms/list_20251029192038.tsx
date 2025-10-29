// src/pages/rooms/list.tsx
import {
  List,
  useTable,
  ShowButton,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";

export const RoomList = () => {
  const { tableProps } = useTable();

  return (
    <List>
      <Table {...tableProps} rowKey="room_id">
        <Table.Column dataIndex="room_number" title="Số phòng" />
        <Table.Column
          dataIndex="room_type"
          title="Loại phòng"
          render={(_, record) => record.room_type?.name}
        />
        <Table.Column dataIndex="price" title="Giá" />
        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(status) => (
            <Tag color={status === "available" ? "green" : "red"}>
              {status === "available" ? "Có sẵn" : "Đã thuê"}
            </Tag>
          )}
        />
        <Table.Column
          title="Thao tác"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.room_id} />
              <EditButton hideText size="small" recordItemId={record.room_id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.room_id}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
