import React from "react";
import { List, useTable, DateField, ImageField } from "@refinedev/antd";
import { useDelete, BaseRecord } from "@refinedev/core"; // Thêm BaseRecord
import {
  Table,
  Typography,
  Alert,
  Button,
  Tooltip,
  Popconfirm,
  message,
} from "antd";

// Định nghĩa Interface tạm thời cho Ảnh Gallery (giả định)
interface GalleryImage extends BaseRecord {
  id: number;
  title: string;
  url: string; // URL của ảnh
  description: string;
  created_at: string;
}

const { Text } = Typography;

export const GalleryList: React.FC = () => {
  // 1. Thay đổi resource thành "images" (hoặc tên resource Gallery của bạn)
  const { tableProps, queryResult } = useTable<GalleryImage>({
    resource: "images",
    // Giả định resource là 'images'
  });
  const { data, isLoading, isError, error } = queryResult || {};

  // 2. Thay đổi useDelete để dùng cho GalleryImage
  const { mutate: deleteImage } = useDelete<GalleryImage>();

  // 3. Thay đổi logic xóa
  const handleDelete = (id: number) => {
    deleteImage(
      { resource: "images", id: id.toString() },
      {
        onSuccess: () => {
          message.success("Xóa ảnh thành công");
        },
        onError: (error) => {
          message.error(error?.message || "Xóa ảnh thất bại");
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
      <div style={{ marginBottom: 16 }}>
        <Button
          onClick={() => queryResult?.refetch?.()}
          loading={isLoading}
          type="primary"
        >
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>Tổng số: {data?.total || 0} ảnh</Text>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 800 }} // Điều chỉnh scroll
      >
        {/* CỘT ẢNH XEM TRƯỚC */}
        <Table.Column
          dataIndex="url"
          title="Ảnh"
          render={(value) => (
            // Sử dụng ImageField của Ant Design hoặc chỉ định thẻ img
            <ImageField
              value={value}
              width={80}
              height={60}
              style={{ objectFit: "cover" }}
            />
          )}
        />

        {/* CỘT TIÊU ĐỀ/TÊN FILE */}
        <Table.Column
          dataIndex="title"
          title="Tiêu đề/Tên file"
          sorter
          ellipsis
        />

        {/* CỘT MÔ TẢ */}
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

        {/* CỘT NGÀY TẠO */}
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} />}
          sorter
        />

        {/* Cột Hành động - Nút Xóa */}
        <Table.Column
          title="Hành động"
          dataIndex="actions"
          render={(_, record: GalleryImage) => (
            <Popconfirm
              title="Bạn có chắc muốn xóa ảnh này không?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger size="small">
                Xóa
              </Button>
            </Popconfirm>
          )}
        />
      </Table>
    </List>
  );
};
