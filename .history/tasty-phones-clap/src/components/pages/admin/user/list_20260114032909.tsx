import React, { useState, useMemo } from "react";
import { List, useTable, DateField } from "@refinedev/antd";
import {
  Table,
  Tag,
  Typography,
  Button,
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
}

const getRoleColor = (role: string) => (role === "admin" ? "red" : "blue");

const getRoleLabel = (role: string) =>
  role === "admin" ? "Quản trị viên" : "Khách hàng";

export const UserList: React.FC = () => {
  const [form] = Form.useForm();
  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  /** ✅ CHỈ LẤY DATA – KHÔNG FILTER */
  const { tableProps, tableQueryResult } = useTable<User>({
    resource: "users",
    pagination: {
      pageSize: 20,
      mode: "client",
    },
  });

  const isLoading = tableQueryResult?.isLoading;

  /** ✅ FILTER CLIENT-SIDE */
  const filteredData = useMemo(() => {
    let data = tableProps.dataSource || [];

    if (searchName) {
      data = data.filter((u) =>
        u.user_name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (roleFilter) {
      data = data.filter((u) => u.role === roleFilter);
    }

    return data;
  }, [tableProps.dataSource, searchName, roleFilter]);

  /** ✅ SUBMIT SEARCH */
  const handleSearch = (values: any) => {
    setSearchName(values.user_name || "");
    setRoleFilter(values.role || null);
  };

  /** ✅ RESET */
  const handleReset = () => {
    form.resetFields();
    setSearchName("");
    setRoleFilter(null);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <List>
      {/* SEARCH CARD */}
      <Card
        title={
          <Space>
            <FilterOutlined /> Tìm kiếm & lọc
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Form form={form} onFinish={handleSearch} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={10}>
              <Form.Item name="user_name" label="Tên tài khoản">
                <Input
                  placeholder="Nhập tên..."
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
              <Form.Item name="role" label="Quyền">
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
          <Space style={{ marginTop: 8 }}>
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

      {/* TABLE */}
      <Table
        rowKey="user_id"
        dataSource={filteredData}
        pagination={{ pageSize: 20 }}
      >
        <Table.Column dataIndex="user_id" title="ID" />

        <Table.Column
          dataIndex="user_name"
          title="Tên tài khoản"
          render={(name: string) => (
            <Space>
              <UserOutlined />
              {name}
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
          render={() => (
            <Button size="small" icon={<EditOutlined />}>
              Quyền
            </Button>
          )}
        />
      </Table>

      <Text style={{ marginTop: 8, display: "block" }}>
        Tổng: {filteredData.length} tài khoản
      </Text>
    </List>
  );
};
