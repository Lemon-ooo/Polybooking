import React, { useState, useEffect } from "react";
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
  Input,
  Card,
  Row,
  Col,
  Form,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Search } = Input;

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
  const [searchName, setSearchName] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Xử lý search và filter
  const { tableProps, tableQueryResult, searchFormProps, filters, setFilters } =
    useTable<User>({
      resource: "users",
      pagination: {
        mode: "server",
        pageSize: 20,
      },
      onSearch: (values) => {
        return [
          {
            field: "user_name",
            operator: "contains",
            value: values.user_name,
          },
          {
            field: "role",
            operator: "eq",
            value: values.role,
          },
        ];
      },
    });

  const data = tableQueryResult?.data;
  const isLoading = tableQueryResult?.isLoading ?? false;
  const isError = tableQueryResult?.isError ?? false;
  const error = tableQueryResult?.error;
  const refetch = tableQueryResult?.refetch ?? (() => {});

  const { mutate: updateUser, isLoading: isUpdating } = useUpdate<User>();

  // Đồng bộ state với filters hiện tại
  useEffect(() => {
    if (filters) {
      const nameFilter = filters.find((f: any) => f.field === "user_name");
      const roleFilter = filters.find((f: any) => f.field === "role");

      if (nameFilter) {
        setSearchName(nameFilter.value || "");
        form.setFieldValue("user_name", nameFilter.value || "");
      }

      if (roleFilter) {
        setRoleFilter(roleFilter.value || null);
        form.setFieldValue("role", roleFilter.value || null);
      }
    }
  }, [filters]);

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

  const handleSearch = (values: any) => {
    const newFilters: any[] = [];

    if (values.user_name) {
      newFilters.push({
        field: "user_name",
        operator: "contains",
        value: values.user_name,
      });
      setSearchName(values.user_name);
    } else {
      setSearchName("");
    }

    if (values.role) {
      newFilters.push({
        field: "role",
        operator: "eq",
        value: values.role,
      });
      setRoleFilter(values.role);
    } else {
      setRoleFilter(null);
    }

    setFilters(newFilters);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchName("");
    setRoleFilter(null);
    setFilters([]);
  };

  if (isLoading && !tableProps.dataSource) {
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
        <div
          className="ant-alert ant-alert-error"
          style={{ padding: "12px 16px" }}
        >
          <div className="ant-alert-icon">
            <span
              role="img"
              aria-label="close-circle"
              className="anticon anticon-close-circle"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="close-circle"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
              </svg>
            </span>
          </div>
          <div className="ant-alert-content">
            <div className="ant-alert-message">Lỗi tải dữ liệu</div>
            <div className="ant-alert-description">
              {error?.message || "Không thể kết nối đến server."}
            </div>
          </div>
          <div className="ant-alert-action">
            <Button onClick={() => refetch()} size="small" type="primary">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <List>
      {/* Card tìm kiếm và lọc */}
      <Card
        style={{ marginBottom: 16 }}
        title={
          <Space>
            <FilterOutlined />
            <span>Tìm kiếm và lọc</span>
          </Space>
        }
        size="small"
      >
        <Form form={form} onFinish={handleSearch} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={10}>
              <Form.Item label="Tìm theo tên" name="user_name">
                <Input
                  placeholder="Nhập tên người dùng..."
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={10}>
              <Form.Item label="Lọc theo quyền" name="role">
                <Select
                  placeholder="Chọn quyền"
                  allowClear
                  options={[
                    { value: "admin", label: "Quản trị viên" },
                    { value: "customer", label: "Khách hàng" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item label=" ">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={isLoading}
                  >
                    Tìm kiếm
                  </Button>
                  <Button onClick={handleReset} disabled={isLoading}>
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* Hiển thị kết quả lọc hiện tại */}
        {(searchName || roleFilter) && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">Đang lọc: </Text>
            {searchName && (
              <Tag
                closable
                onClose={() => {
                  form.setFieldValue("user_name", "");
                  setSearchName("");
                  const newFilters =
                    filters?.filter((f: any) => f.field !== "user_name") || [];
                  setFilters(newFilters);
                }}
              >
                Tên: {searchName}
              </Tag>
            )}
            {roleFilter && (
              <Tag
                closable
                color={getRoleColor(roleFilter)}
                onClose={() => {
                  form.setFieldValue("role", null);
                  setRoleFilter(null);
                  const newFilters =
                    filters?.filter((f: any) => f.field !== "role") || [];
                  setFilters(newFilters);
                }}
              >
                Quyền: {getRoleLabel(roleFilter)}
              </Tag>
            )}
          </div>
        )}
      </Card>

      {/* Thống kê và controls */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button onClick={() => refetch()} loading={isLoading}>
            Làm mới dữ liệu
          </Button>
          <Text>
            Tổng số: {data?.total || tableProps.dataSource?.length || 0} tài
            khoản
            {searchName && ` - Tìm: "${searchName}"`}
            {roleFilter && ` - Quyền: ${getRoleLabel(roleFilter)}`}
          </Text>
        </div>
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
