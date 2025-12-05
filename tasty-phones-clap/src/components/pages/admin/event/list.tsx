import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import {
  Table,
  Typography,
  Tooltip,
  Button,
  Popconfirm,
  message,
  Space,
  Alert,
  Image,
} from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

import { IEvent } from "../../../../interfaces/event";

const { Text } = Typography;

// Helper function to format the image URL
const baseUrl = "http://localhost:8000/storage/";
const getImageUrl = (path: string) => `${baseUrl}${path}`;

export const EventList: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, queryResult, refetch } = useTable<IEvent>({
    resource: "events",
    queryOptions: {
      select: (response: any) => ({
        ...response,
        data: response.data,
        total: response.total,
      }),
    },
  });

  const { data, isLoading, isError, error } = queryResult || {};

  const { mutate: deleteEvent } = useDelete<IEvent>();

  const handleDelete = (id: number) => {
    deleteEvent(
      { resource: "events", id: id.toString() },
      {
        onSuccess: () => message.success("Xóa sự kiện thành công"),
        onError: () => message.error("Xóa sự kiện thất bại"),
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
    <List title="Danh sách Sự kiện">
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Button
          type="primary"
          onClick={() => navigate("/admin/events/create")}
          style={{ marginRight: 16 }}
        >
          Thêm sự kiện mới
        </Button>
        <Button onClick={() => refetch?.()} loading={isLoading}>
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>
          Tổng số: {data?.total || 0} sự kiện
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 1200 }}
      >
        {/* CỘT ID */}
        {/* <Table.Column dataIndex="id" title="ID" width={70} sorter /> */}

        {/* CỘT ẢNH BÌA */}
        <Table.Column
          title="Ảnh Bìa"
          dataIndex="image"
          width={100}
          render={(image: string | null) => {
            if (!image) {
              return (
                <Text type="secondary" style={{ fontSize: 10 }}>
                  Không ảnh
                </Text>
              );
            }
            return (
              <Image
                src={getImageUrl(image)}
                alt="Ảnh sự kiện"
                style={{
                  width: 80,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
                preview={{ mask: <EyeOutlined style={{ fontSize: 20 }} /> }}
              />
            );
          }}
        />

        {/* CỘT TÊN SỰ KIỆN */}
        <Table.Column dataIndex="name" title="Tên sự kiện" width={200} sorter />

        {/* CỘT ĐỊA ĐIỂM */}
        <Table.Column dataIndex="location" title="Địa điểm" width={150} />

        {/* CỘT NGÀY DIỄN RA */}
        <Table.Column
          dataIndex="date"
          title="Ngày diễn ra"
          width={150}
          render={(value: string) => (
            <DateField value={value} format="DD/MM/YYYY HH:mm" />
          )}
          sorter
        />

        {/* CỘT MÔ TẢ */}
        <Table.Column
          dataIndex="description"
          title="Mô tả"
          ellipsis
          width={250}
          render={(description: string) => (
            <Tooltip title={description}>
              <span>{description || "Không có mô tả"}</span>
            </Tooltip>
          )}
        />

        {/* CỘT NGÀY TẠO */}
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          width={150}
          render={(value: string) => (
            <DateField value={value} format="DD/MM/YYYY HH:mm" />
          )}
          sorter
        />

        {/* Cột Hành động */}
        <Table.Column
          title="Hành động"
          width={120}
          fixed="right"
          render={(_, record: IEvent) => (
            <Space size="small">
              <Tooltip title="Chi tiết">
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

              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc muốn xóa sự kiện này không?"
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
