import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete, useNavigation } from "@refinedev/core";
import {
  Table,
  Typography,
  Alert,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Space,
} from "antd";

const { Text } = Typography;

export const GalleryList: React.FC = () => {
  const { tableProps, queryResult } = useTable({
    resource: "galleries",
  });

  const { create, edit, show } = useNavigation();
  const { mutate: deleteGallery } = useDelete();

  const { data, isLoading, isError, error } = queryResult || {};

  const handleDelete = (id: number) => {
    deleteGallery(
      { resource: "galleries", id: id.toString() },
      {
        onSuccess: () => {
          message.success("Xóa ảnh thành công");
          queryResult?.refetch?.();
        },
        onError: () => {
          message.error("Xóa ảnh thất bại");
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
    <List title="Quản lý Thư viện ảnh">
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Button type="primary" onClick={() => create("galleries")}>
          + Thêm mới Ảnh
        </Button>

        <Button onClick={() => queryResult?.refetch?.()} loading={isLoading}>
          Làm mới
        </Button>

        <Text strong style={{ marginLeft: 8 }}>
          Tổng số: {data?.total || 0} ảnh
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="gallery_id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 1200 }}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} ảnh`,
        }}
      >
        <Table.Column dataIndex="gallery_id" title="ID" width={80} fixed="left" />

        <Table.Column
          dataIndex="gallery_category"
          title="Danh mục"
          render={(value: string) => <Text>{value || "Chưa phân loại"}</Text>}
        />

        {/* ẢNH ĐÃ SỬA – HIỆN ĐẸP 100% */}
        <Table.Column
          dataIndex="image_path"
          title="Ảnh xem trước"
          width={140}
          render={(path: string) => (
            <Tooltip title={path || "Không có đường dẫn"}>
              {path ? (
                <img
                  src={`http://localhost:8000/storage/${path.startsWith("/") ? path.slice(1) : path}`}
                  alt="gallery"
                  style={{
                    width: 110,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    border: "1px solid #eee",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/110x80/f5f5f5/999?text=No+Image";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 110,
                    height: 80,
                    background: "#f9f9f9",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                    fontSize: 13,
                    border: "1px dashed #ddd",
                  }}
                >
                  Không có ảnh
                </div>
              )}
            </Tooltip>
          )}
        />

        <Table.Column
          dataIndex="caption"
          title="Chú thích"
          ellipsis={{ showTitle: false }}
          render={(caption: string) => (
            <Tooltip title={caption}>
              <span>{caption || "—"}</span>
            </Tooltip>
          )}
        />

        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
          sorter
          width={140}
        />

        <Table.Column
          dataIndex="updated_at"
          title="Cập nhật"
          render={(value: string) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
          sorter
          width={140}
        />

        {/* CỘT HÀNH ĐỘNG – ĐÃ SỬA ĐÚNG */}
        <Table.Column
          title="Hành động"
          fixed="right"
          width={240}
          render={(_, record: any) => (
            <Space size="small">
              {/* XEM CHI TIẾT */}
              <Button
                type="link"
                size="small"
                onClick={() => show("galleries", record.gallery_id)}
              >
                Chi tiết
              </Button>

              {/* SỬA */}
              <Button
                type="default"
                size="small"
                onClick={() => edit("galleries", record.gallery_id)}
              >
                Sửa
              </Button>

              {/* XÓA */}
              <Popconfirm
                title="Xóa ảnh này?"
                description="Hành động này không thể hoàn tác"
                onConfirm={() => handleDelete(record.gallery_id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger size="small">
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};