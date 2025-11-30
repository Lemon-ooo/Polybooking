// src/pages/services/list.tsx (hoặc đường dẫn hiện tại của bạn)
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
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export const ServiceList: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, tableQueryResult } = useTable({
    resource: "services",
    pagination: { mode: "off" },
  });

  const { mutate: deleteService } = useDelete();

  // Transform + sort data theo cấu trúc mới từ backend
  const sortedDataSource = React.useMemo(() => {
    const rawData = tableProps.dataSource || [];

    const transformed = rawData.map((item: any) => ({
      id: item.service_id,
      name: item.service_name,
      description: item.description || "",
      price: item.service_price,
     image_url: item.service_image
  ? `http://localhost:8000/storage/${item.service_image}`
  : null,
      created_at: item.created_at,
    }));

    return transformed.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [tableProps.dataSource]);

  const handleDelete = (id: number) => {
    deleteService(
      { resource: "services", id: id.toString() },
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
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Button onClick={() => tableQueryResult?.refetch?.()} loading={tableQueryResult?.isLoading}>
            Làm mới
          </Button>
          <Text style={{ marginLeft: 16 }}>
            Tổng: {sortedDataSource.length} dịch vụ
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/services/create")}>
          Thêm dịch vụ
        </Button>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        loading={tableQueryResult?.isLoading}
        dataSource={sortedDataSource}
        scroll={{ x: 1000 }}
      >
        <Table.Column
          dataIndex="image_url"
          title="Hình ảnh"
          render={(url: string) => (
            <Image
              src={url || "/no-image.png"}
              alt="service"
              width={70}
              height={70}
              style={{ objectFit: "cover", borderRadius: 8 }}
              fallback="/no-image.png"
            />
          )}
        />
        <Table.Column dataIndex="name" title="Tên dịch vụ" />
        <Table.Column
          dataIndex="description"
          title="Mô tả"
          ellipsis={{ showTitle: false }}
          render={(desc: string) => (
            <Tooltip title={desc}>
              <span>{desc || "Không có mô tả"}</span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="price"
          title="Giá"
          render={(price: string) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(price))
          }
        />
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
        />
        <Table.Column
          title="Hành động"
          fixed="right"
          render={(_: any, record: any) => (
            <Space>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => navigate(`/admin/services/edit/${record.id}`)}
              >
                Sửa
              </Button>
              <Popconfirm
                title="Bạn chắc chắn muốn xóa dịch vụ này?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
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

export default ServiceList;