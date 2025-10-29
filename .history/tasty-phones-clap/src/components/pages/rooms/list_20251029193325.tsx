import {
  List,
  useTable,
  ShowButton,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";

// ✅ Export đúng tên
export const RoomList = () => {
  const { tableProps } = useTable();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="room_number" title="Số phòng" />
        <Table.Column dataIndex={["room_type", "name"]} title="Loại phòng" />
        <Table.Column
          dataIndex="price"
          title="Giá"
          render={(price) =>
            price ? `₫${price.toLocaleString()}` : "Chưa có giá"
          }
        />
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
