import React, { useState } from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useUpdate } from "@refinedev/core";
import {
  Table,
  Tag,
  Typography,
  Button,
  message,
  Space,
  Select,
  Modal,
  Spin,
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface User {
  user_id: number;
  user_name: string;
  email: string;
  role: "admin" | "customer";
  created_at: string;
  updated_at?: string;
}

const getRoleColor = (role: string) => {
  return role === "admin" ? "red" : role === "customer" ? "blue" : "default";
};

const getRoleLabel = (role: string) => {
  return role === "admin"
    ? "Quản trị viên"
    : role === "customer"
    ? "Khách hàng"
    : role;
};

export const UserList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { tableProps, tableQueryResult } = useTable<User>({
    resource: "users",
    pagination: {
      mode: "server",
      pageSize: 20,
    },
  });

  const data = tableQueryResult?.data;
  const isLoading = tableQueryResult?.isLoading ?? false;
  const isError = tableQueryResult?.isError ?? false;
  const error = tableQueryResult?.error;
  const refetch = tableQueryResult?.refetch ?? (() => {});

  const { mutate: updateUser, isLoading: isUpdating } = useUpdate<User>();

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsModalOpen(true);
  };

  const handleRoleUpdate = () => {
    if (!selectedUser || !selectedRole) return;

    updateUser(
      {
        resource: "users",
        id: String(selectedUser.user_id),
        values: { role: selectedRole },
      },
      {
        onSuccess: () => {
          message.success("Cập nhật quyền thành công");
          setIsModalOpen(false);
          setSelectedUser(null);
          refetch();
        },
        onError: () => {
          message.error("Cập nhật quyền thất bại");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải danh sách tài khoản...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối đến server."}
          type="error"
          showIcon
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      </div>
    );
  }

  return (
    <List>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Button onClick={() => refetch()} loading={isLoading}>
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>
          Tổng số: {data?.total || tableProps.dataSource?.length || 0} tài khoản
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="user_id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: "max-content" }}
        pagination={
          tableProps.pagination === false
            ? false
            : {
                ...tableProps.pagination,
                total: data?.total,
              }
        }
      >
        <Table.Column dataIndex="user_id" title="ID" sorter width={80} />

        <Table.Column
          dataIndex="user_name"
          title="Họ tên"
          sorter
          render={(user_name: string) => (
            <Space>
              <UserOutlined />
              <span>{user_name || "Chưa đặt tên"}</span>
            </Space>
          )}
        />

        <Table.Column dataIndex="email" title="Email" sorter ellipsis />

        <Table.Column
          dataIndex="role"
          title="Quyền"
          render={(role: string) => (
            <Tag color={getRoleColor(role)}>{getRoleLabel(role)}</Tag>
          )}
          filters={[
            { text: "Quản trị viên", value: "admin" },
            { text: "Khách hàng", value: "customer" },
          ]}
          onFilter={(value, record: User) => record.role === value}
        />

        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => (
            <DateField value={value} format="DD/MM/YYYY" />
          )}
          sorter
        />

        {/* Chỉ giữ lại nút Thay đổi quyền */}
        <Table.Column
          title="Hành động"
          fixed="right"
          width={100}
          render={(_, record: User) => (
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => openRoleModal(record)}
                size="small"
              >
                Quyền
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* Modal thay đổi quyền */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            {`Thay đổi quyền: ${
              selectedUser?.user_name || selectedUser?.email || ""
            }`}
          </Space>
        }
        open={isModalOpen}
        onOk={handleRoleUpdate}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={isUpdating}
        width={500}
      >
        <div style={{ padding: "16px 0" }}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Text type="secondary">Email:</Text>
              <div style={{ marginTop: 4 }}>
                <Text strong>{selectedUser?.email}</Text>
              </div>
            </div>

            <div>
              <Text type="secondary">Quyền hiện tại:</Text>
              <div style={{ marginTop: 8 }}>
                <Tag
                  color={getRoleColor(selectedUser?.role || "")}
                  style={{ fontSize: 14, padding: "4px 12px" }}
                >
                  {getRoleLabel(selectedUser?.role || "")}
                </Tag>
              </div>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Chọn quyền mới:
              </Text>
              <Select
                value={selectedRole}
                style={{ width: "100%" }}
                onChange={(value) => setSelectedRole(value)}
                size="large"
                options={[
                  { value: "admin", label: "Quản trị viên" },
                  { value: "customer", label: "Khách hàng" },
                ]}
              />
            </div>
          </Space>
        </div>
      </Modal>
    </List>
  );
};
