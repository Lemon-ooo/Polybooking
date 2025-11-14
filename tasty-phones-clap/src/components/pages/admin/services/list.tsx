import React from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import {
  Table,
  Typography,
  Alert,
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

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  created_at: string;
}

export const ServiceList: React.FC = () => {
  const navigate = useNavigate();
  const { tableProps, queryResult } = useTable<Service>({
    resource: "services",
  });
  const { data, isLoading, isError, error } = queryResult || {};

  const { mutate: deleteService } = useDelete<Service>();

  const handleDelete = (id: number) => {
    deleteService(
      { resource: "services", id: id.toString() },
      {
        onSuccess: () => {
          message.success("Xóa dịch vụ thành công");
          queryResult?.refetch?.();
        },
        onError: () => {
          message.error("Xóa dịch vụ thất bại");
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
      {/* Thanh tiêu đề với nút Thêm mới */}
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
            onClick={() => queryResult?.refetch?.()}
            loading={isLoading}
            type="default"
          >
            Làm mới dữ liệu
          </Button>
          <Text style={{ marginLeft: 16 }}>
            Tổng số: {data?.total || tableProps?.dataSource?.length || 0} dịch
            vụ
          </Text>
        </div>

        {/* ✅ Nút thêm mới */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/services/create")}
        >
          Thêm dịch vụ
        </Button>
      </div>

      {/* Bảng danh sách */}
      <Table
        {...tableProps}
        rowKey="id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 1000 }}
      >
        <Table.Column
          dataIndex="image"
          title="Hình ảnh"
          render={(image: string) => (
            <Image
              src={image || "/no-image.png"}
              alt="service"
              width={70}
              height={70}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          )}
        />
        <Table.Column dataIndex="name" title="Tên dịch vụ" sorter />
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
        <Table.Column
          dataIndex="price"
          title="Giá"
          render={(price: string) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(price))
          }
          sorter={(a: Service, b: Service) =>
            parseFloat(a.price) - parseFloat(b.price)
          }
        />
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => <DateField value={value} />}
          sorter
        />
        <Table.Column
          title="Hành động"
          render={(_, record: Service) => (
            <Space>
              {/* ✅ Nút sửa */}
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => navigate(`/admin/services/edit/${record.id}`)}
              >
                Sửa
              </Button>

              {/* Nút xóa */}
              <Popconfirm
                title="Bạn có chắc muốn xóa dịch vụ này không?"
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
