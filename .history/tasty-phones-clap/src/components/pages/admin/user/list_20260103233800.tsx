import React, { useState } from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import { useDelete, useUpdate } from "@refinedev/core";
import {
  Table,
  Tag,
  Typography,
  Alert,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Space,
  Select,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  created_at: string;
  updated_at?: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "red";
    case "customer":
      return "blue";
    default:
      return "default";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "customer":
      return "Khách hàng";
    default:
      return role;
  }
};

export const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { tableProps, queryResult } = useTable<User>({
    resource: "users",
  });
  const { data, isLoading, isError, error } = queryResult || {};

  const { mutate: deleteUser } = useDelete<User>();
  const { mutate: updateUser, isLoading: isUpdating } = useUpdate<User>();

  const handleDelete = (id: number) => {
    deleteUser(
      { resource: "users", id: id.toString() },
      {
        onSuccess: () => {
          message.success("Xóa tài khoản thành công");
        },
        onError: () => {
          message.error("Xóa tài khoản thất bại");
        },
      }
    );
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsModalOpen(true);
  };

  const handleRoleUpdate = () => {
    if (!selectedUser) return;

    updateUser(
      {
        resource: "users",
        id: selectedUser.id.toString(),
        values: { role: selectedRole },
      },
      {
        onSuccess: () => {
          message.success("Cập nhật quyền thành công");
          setIsModalOpen(false);
          setSelectedUser(null);
          queryResult?.refetch?.();
        },
        onError: () => {
          message.error("Cập nhật quyền thất bại");
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
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Button onClick={() => queryResult?.refetch?.()} loading={isLoading}>
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>
          Tổng số: {data?.meta?.total || 0} tài khoản
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 1000 }}
      >
        <Table.Column dataIndex="id" title="ID" sorter width={80} />

        <Table.Column
          dataIndex="name"
          title="Họ tên"
          sorter
          render={(name: string) => (
            <Space>
              <UserOutlined />
              <span>{name}</span>
            </Space>
          )}
        />

        <Table.Column
          dataIndex="email"
          title="Email"
          sorter
          ellipsis
          render={(email: string) => (
            <Tooltip title={email}>
              <span>{email}</span>
            </Tooltip>
          )}
        />

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
          render={(value: string) => <DateField value={value} />}
          sorter
        />

        <Table.Column
          title="Hành động"
          fixed="right"
          width={180}
          render={(_, record: User) => (
            <Space>
              <Tooltip title="Chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/admin/users/show/${record.id}`)}
                />
              </Tooltip>

              <Tooltip title="Thay đổi quyền">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => openRoleModal(record)}
                />
              </Tooltip>

              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc muốn xóa tài khoản này không?"
                  description="Hành động này không thể hoàn tác!"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          )}
        />
      </Table>

      {/* Modal thay đổi quyền */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            {`Thay đổi quyền: ${selectedUser?.name || ""}`}
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
                  {
                    value: "admin",
                    label: "Quản trị viên",
                  },
                  {
                    value: "customer",
                    label: "Khách hàng",
                  },
                ]}
              />
            </div>
          </Space>
        </div>
      </Modal>
    </List>
  );
};
