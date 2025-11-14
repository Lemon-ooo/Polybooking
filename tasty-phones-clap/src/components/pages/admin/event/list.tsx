import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete, useNavigation } from "@refinedev/core";

import {
  Table,
  Typography,
  Alert,
  Button,
  Popconfirm,
  message,
  Image,
} from "antd";
import { IEvent } from "../../../../interfaces/rooms";

const { Text } = Typography;

export const EventList: React.FC = () => {
  const { tableProps, queryResult } = useTable<IEvent>({
    resource: "events",
  });

  const { create, edit, show } = useNavigation();
  const { data, isLoading, isError, error } = queryResult || {};
  const { mutate: deleteEvent } = useDelete();

  // Hàm xử lý xóa sự kiện
  const handleDelete = (id: number) => {
    deleteEvent(
      { resource: "events", id: id.toString() },
      {
        onSuccess: () => {
          message.success("Xóa sự kiện thành công");
          queryResult?.refetch?.(); // Tải lại bảng sau khi xóa
        },
        onError: (err) => {
          console.error("Lỗi xóa sự kiện:", err);
          message.error("Xóa sự kiện thất bại: " + err.message);
        },
      }
    );
  };

  if (isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error?.message || "Không thể kết nối đến API sự kiện."}
        type="error"
        showIcon
      />
    );
  }
  const getImageUrl = (path: string): string => {
    return `/storage/${path}`;
  };

  return (
    <List title="Danh sách Sự kiện">
      <div style={{ marginBottom: 16 }}>
        {/*  NÚT THÊM MỚI (CREATE) */}
        <Button
          type="default"
          onClick={() => create("events")} // Chuyển hướng đến /events/create
          style={{ marginRight: 16 }}
        >
          + Thêm mới Sự kiện
        </Button>

        <Button
          onClick={() => queryResult?.refetch?.()}
          loading={isLoading}
          type="primary"
        >
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
        {/* ... Các cột dữ liệu ... */}
        <Table.Column dataIndex="id" title="ID" width={70} />
        <Table.Column
          dataIndex="name"
          title="Tên sự kiện"
          width={200}
          render={(value: string) => <Text strong>{value}</Text>}
        />
        <Table.Column dataIndex="location" title="Địa điểm" width={200} />
        <Table.Column
          dataIndex="date"
          title="Ngày diễn ra"
          width={120}
          render={(value: string) => (
            <DateField value={value} format="DD/MM/YYYY" />
          )}
          sorter
        />
        <Table.Column
          dataIndex="description"
          title="Mô tả"
          width={300}
          render={(value: string) => (
            <Text ellipsis={{ tooltip: value }}>{value}</Text>
          )}
        />
        {/* 🆕 CỘT HÌNH ẢNH */}
        <Table.Column
          dataIndex="image"
          title="Ảnh Bìa"
          width={100}
          render={(value: string | null) =>
            value ? (
              <Image
                // Lúc này, getImageUrl đã được định nghĩa và có thể sử dụng
                src={getImageUrl(value)}
                alt="Ảnh sự kiện"
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
            ) : (
              // Nếu bạn đang sử dụng Ant Design, hãy import Text từ 'antd'
              <Text type="secondary">No Image</Text>
            )
          }
        />
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          width={150}
          render={(value: string) => (
            <DateField value={value} format="HH:mm DD/MM/YYYY" />
          )}
          sorter
        />

        {/*  CỘT HÀNH ĐỘNG (SHOW, SỬA & XÓA) */}
        <Table.Column
          title="Hành động"
          width={220}
          fixed="right"
          render={(_, record: IEvent) => (
            <>
              {/*  NÚT XEM CHI TIẾT (SHOW) */}
              <Button
                type="link"
                size="small"
                onClick={() => show("events", record.id)}
                style={{ marginRight: 4, paddingLeft: 0 }}
              >
                Chi tiết
              </Button>

              {/* NÚT SỬA (EDIT) */}
              <Button
                type="dashed"
                size="small"
                onClick={() => edit("events", record.id)}
                style={{ marginRight: 8 }}
              >
                Sửa
              </Button>

              {/* NÚT XÓA (DELETE) */}
              <Popconfirm
                title="Bạn có chắc muốn xóa sự kiện này không?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger size="small">
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        />
      </Table>
    </List>
  );
};
