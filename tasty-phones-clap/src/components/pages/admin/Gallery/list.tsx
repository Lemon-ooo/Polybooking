import React from "react";
import { List, useTable, DateField, Show } from "@refinedev/antd";
import { useDelete, useNavigation } from "@refinedev/core";
import {
  Table,
  Typography,
  Alert,
  Button,
  Tooltip,
  Popconfirm,
  message,
} from "antd";

const { Text } = Typography;

export const GalleryList: React.FC = () => {
  const { tableProps, queryResult } = useTable({
    resource: "galleries",
  });

  // 👈 KHAI BÁO useNavigation
  const { create, edit, show } = useNavigation();

  const { data, isLoading, isError, error } = queryResult || {};
  const { mutate: deleteGallery } = useDelete();

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
    <List>
      <div style={{ marginBottom: 16 }}>
        {/*  NÚT THÊM MỚI (CREATE) */}
        <Button
          type="default"
          onClick={() => create("galleries")} // Chuyển hướng đến /gallery/create
          style={{ marginRight: 16 }}
        >
          + Thêm mới Ảnh
        </Button>

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
        rowKey="gallery_id" // Dùng gallery_id như đã sửa ở trên
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 1000 }} // Tăng scroll x để đảm bảo vừa
      >
        <Table.Column dataIndex="gallery_id" title="ID" width={70} />
        <Table.Column
          dataIndex="gallery_category"
          title="Danh mục"
          render={(value: string) => <Text>{value || "Không có"}</Text>}
        />
        <Table.Column
          dataIndex="image_path"
          title="Ảnh"
          render={(path: string) => (
            <Tooltip title={path}>
              {path ? (
                <img
                  src={`http://127.0.0.1:8001/storage/${path}`}
                  alt="gallery"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <Text>Không có ảnh</Text>
              )}
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="caption"
          title="Chú thích"
          render={(caption: string) => (
            <Tooltip title={caption}>
              <span>{caption || "Không có chú thích"}</span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} />}
          sorter
        />
        <Table.Column
          dataIndex="updated_at"
          title="Ngày cập nhật"
          render={(value: string) => <DateField value={value} />}
          sorter
        />

        {/* CỘT HÀNH ĐỘNG (SỬA & XÓA) */}
        <Table.Column
          title="Hành động"
          width={220}
          fixed="right"
          render={(_, record: any) => (
            <>
              {/* 🆕 NÚT XEM CHI TIẾT (SHOW) */}
              <Button
                type="link"
                size="small"
                // ✅ Sử dụng hàm show
                onClick={() => show("events", record.id)}
                style={{ marginRight: 4, paddingLeft: 0 }}
              >
                Chi tiết
              </Button>

              {/* NÚT SỬA (EDIT) */}
              <Button
                type="dashed"
                size="small"
                onClick={() => edit("galleries", record.gallery_id)} // Chuyển hướng đến /gallery/edit/:id
                style={{ marginRight: 8 }}
              >
                Sửa
              </Button>

              {/* NÚT XÓA (DELETE) */}
              <Popconfirm
                title="Bạn có chắc muốn xóa ảnh này không?"
                onConfirm={() => handleDelete(record.gallery_id)}
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
