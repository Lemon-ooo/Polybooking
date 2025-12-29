import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import {
  Table,
  Typography,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Image,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const BASE_URL = "http://localhost:8000/storage/";

export const GalleryList: React.FC = () => {
  const navigate = useNavigate();
  const { tableProps, tableQueryResult } = useTable({
    // ĐÃ SỬA: Thay resource "gallery" bằng "galleries"
    resource: "galleries",
    pagination: { mode: "off" },
  });
  const { mutate: deleteGallery } = useDelete();

  const sortedDataSource = React.useMemo(() => {
    const rawData = tableProps.dataSource || [];
    const transformed = rawData.map((item: any) => ({
      // Đảm bảo key id là duy nhất và đúng với cấu trúc server (ví dụ: gallery_id)
      // Nếu server trả về 'id' thì dùng id, nếu trả về 'gallery_id' thì dùng gallery_id
      id: item.gallery_id || item.id, // Dùng gallery_id nếu tồn tại
      category: item.gallery_category || "Không có nhóm",
      caption: item.caption || "Không có chú thích",
      image_url: item.image_path ? `${BASE_URL}${item.image_path}` : null,
      created_at: item.created_at,
    })); // Sắp xếp theo ngày tạo mới nhất (giảm dần)
    return transformed.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [tableProps.dataSource]);

  const handleDelete = (id: number) => {
    deleteGallery(
      {
        // ĐÃ SỬA: Thay resource "gallery" bằng "galleries"
        resource: "galleries",
        id: id.toString(),
      },
      {
        onSuccess: () => {
          message.success("Xóa thành công");
          tableQueryResult?.refetch?.();
        },
        onError: () => message.error("Xóa thất bại"),
      }
    );
  };

  if (tableQueryResult?.isError) {
    return (
      <div style={{ padding: 16 }}>
        <Text type="danger">
          Lỗi: {tableQueryResult.error?.message || "Không thể kết nối API"}
        </Text>
      </div>
    );
  }

  return (
    <List>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button
            onClick={() => tableQueryResult?.refetch?.()}
            loading={tableQueryResult?.isLoading}
          >
            Làm mới
          </Button>

          <Text style={{ marginLeft: 16 }}>
            Tổng: {sortedDataSource.length} ảnh
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/galleries/create")}
        >
          Thêm ảnh
        </Button>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        loading={tableQueryResult?.isLoading}
        dataSource={sortedDataSource}
        scroll={{ x: 900 }}
      >
        <Table.Column
          title="Hình ảnh"
          dataIndex="image_url"
          render={(url: string) => (
            <Image
              src={url || "/no-image.png"}
              width={90}
              height={90}
              style={{ objectFit: "cover", borderRadius: 8 }}
              fallback="/no-image.png"
            />
          )}
        />
        <Table.Column title="Nhóm ảnh" dataIndex="category" />
        <Table.Column title="Caption" dataIndex="caption" />
        <Table.Column
          title="Ngày tạo"
          dataIndex="created_at"
          render={(value: string) => (
            <DateField value={value} format="DD/MM/YYYY HH:mm" />
          )}
        />

        <Table.Column
          title="Hành động"
          render={(_, record: any) => (
            <Space>
              <Tooltip title="Chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/admin/galleries/show/${record.id}`)}
                />
              </Tooltip>

              <Tooltip title="Sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/admin/galleries/edit/${record.id}`)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Popconfirm
                  title="Xóa ảnh này?"
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

export default GalleryList;
