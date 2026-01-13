import React, { useState, useEffect, useMemo } from "react";
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

interface User {
  user_id: number;
  user_name: string;
  email: string;
  role: "admin" | "customer";
  created_at: string;
  updated_at?: string;
}

const getRoleColor = (role: string) => (role === "admin" ? "red" : "blue");

const getRoleLabel = (role: string) =>
  role === "admin" ? "Quản trị viên" : "Khách hàng";

export const UserList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  /** ✅ STATE FILTER CLIENT */
  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const [form] = Form.useForm();

  /** 🔹 GIỮ useTable – CHỈ DÙNG LẤY DATA */
  const { tableProps, tableQueryResult } = useTable<User>({
    resource: "users",
    pagination: {
      mode: "client",
      pageSize: 20,
    },
  });

  const isLoading = tableQueryResult?.isLoading ?? false;
  const isError = tableQueryResult?.isError ?? false;
  const error = tableQueryResult?.error;
  const refetch = tableQueryResult?.refetch ?? (() => {});

  const { mutate: updateUser, isLoading: isUpdating } = useUpdate<User>();

  /** ===============================
   *  CLIENT-SIDE FILTER LOGIC
   *  =============================== */
  const filteredData = useMemo(() => {
    let list = tableProps.dataSource || [];

    if (searchName) {
      list = list.filter((u: User) =>
        u.user_name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (roleFilter) {
      list = list.filter((u: User) => u.role === roleFilter);
    }

    return list;
  }, [tableProps.dataSource, searchName, roleFilter]);

  /** ===============================
   *  SEARCH & RESET
   *  =============================== */
  const handleSearch = (values: any) => {
    setSearchName(values.user_name || "");
    setRoleFilter(values.role || null);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchName("");
    setRoleFilter(null);
  };

  /** ===============================
   *  ROLE UPDATE
   *  =============================== */
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

  /** ===============================
   *  LOADING / ERROR
   *  =============================== */
  if (isLoading && !tableProps.dataSource) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <Text type="danger">{error?.message || "Không thể tải dữ liệu"}</Text>
      </div>
    );
  }

  return (
    <List>
      {/* ================= SEARCH CARD ================= */}
      <Card
        style={{ marginBottom: 16 }}
        title={
          <Space>
            <FilterOutlined /> Tìm kiếm & lọc
          </Space>
        }
        size="small"
      >
        <Form form={form} onFinish={handleSearch} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={10}>
              <Form.Item label="Tên tài khoản" name="user_name">
                <Input
                  placeholder="Nhập tên..."
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
              <Form.Item label="Quyền" name="role">
                <Select
                  allowClear
                  placeholder="Chọn quyền"
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
                  >
                    Tìm
                  </Button>
                  <Button onClick={handleReset}>Reset</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {(searchName || roleFilter) && (
          <Space>
            <Text type="secondary">Đang lọc:</Text>
            {searchName && <Tag>Ten: {searchName}</Tag>}
            {roleFilter && (
              <Tag color={getRoleColor(roleFilter)}>
                {getRoleLabel(roleFilter)}
              </Tag>
            )}
          </Space>
        )}
      </Card>

      {/* ================= TABLE ================= */}
      <Table
        {...tableProps}
        rowKey="user_id"
        loading={isLoading}
        dataSource={filteredData}
        pagination={{
          pageSize: 20,
          showTotal: (t) => `Tổng ${t} tài khoản`,
        }}
      >
        <Table.Column dataIndex="user_id" title="ID" width={80} />

        <Table.Column
          dataIndex="user_name"
          title="Tên tài khoản"
          render={(name: string) => (
            <Space>
              <UserOutlined /> {name || "Chưa đặt tên"}
            </Space>
          )}
        />

        <Table.Column dataIndex="email" title="Email" />

        <Table.Column
          dataIndex="role"
          title="Quyền"
          render={(role: string) => (
            <Tag color={getRoleColor(role)}>{getRoleLabel(role)}</Tag>
          )}
        />

        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(v: string) => <DateField value={v} format="DD/MM/YYYY" />}
        />

        <Table.Column
          title="Hành động"
          width={120}
          render={(_, record: User) => (
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => openRoleModal(record)}
            >
              Quyền
            </Button>
          )}
        />
      </Table>

      {/* ================= MODAL ================= */}
      <Modal
        title="Thay đổi quyền"
        open={isModalOpen}
        onOk={handleRoleUpdate}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isUpdating}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>{selectedUser?.email}</Text>
          <Select
            value={selectedRole}
            onChange={setSelectedRole}
            options={[
              { value: "admin", label: "Quản trị viên" },
              { value: "customer", label: "Khách hàng" },
            ]}
          />
        </Space>
      </Modal>
    </List>
  );
};
