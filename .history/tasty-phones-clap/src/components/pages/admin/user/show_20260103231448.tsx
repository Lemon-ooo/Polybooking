import React from "react";
import { Show, DateField } from "@refinedev/antd";
import { useShow, useUpdate } from "@refinedev/core";
import {
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Alert,
  Descriptions,
  Space,
  Button,
  Select,
  message,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  SafetyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

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

export const UserShow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { queryResult } = useShow<User>({
    resource: "users",
    id,
  });

  const { data, isLoading, isError, error } = queryResult;
  const user = data?.data;

  const { mutate: updateUser, isLoading: isUpdating } = useUpdate<User>();

  const handleRoleChange = (role: string) => {
    if (!user) return;

    updateUser(
      {
        resource: "users",
        id: user.id.toString(),
        values: { role },
      },
      {
        onSuccess: () => {
          message.success("Cập nhật quyền thành công");
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
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button onClick={() => navigate("/admin/users")}>
            Quay lại danh sách
          </Button>
        </>
      )}
    >
      {user && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Thông tin cơ bản */}
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={4} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#1890ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <UserOutlined style={{ fontSize: 40, color: "#fff" }} />
                </div>
              </Col>
              <Col xs={24} sm={20}>
                <Space direction="vertical" size="small">
                  <Title level={3} style={{ margin: 0 }}>
                    {user.name}
                  </Title>
                  <Space>
                    <MailOutlined />
                    <Text type="secondary">{user.email}</Text>
                  </Space>
                  <Space>
                    <SafetyOutlined />
                    <Tag color={getRoleColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Tag>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Chi tiết tài khoản */}
          <Card title="Chi tiết tài khoản" bordered={false}>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="ID">
                <Text strong>#{user.id}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Họ tên">
                <Space>
                  <UserOutlined />
                  {user.name}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Email" span={2}>
                <Space>
                  <MailOutlined />
                  {user.email}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Quyền hiện tại">
                <Tag color={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Thay đổi quyền">
                <Space>
                  <Select
                    value={user.role}
                    style={{ width: 180 }}
                    onChange={handleRoleChange}
                    loading={isUpdating}
                    options={[
                      {
                        value: "admin",
                        label: (
                          <Space>
                            <SafetyOutlined />
                            Quản trị viên
                          </Space>
                        ),
                      },
                      {
                        value: "customer",
                        label: (
                          <Space>
                            <UserOutlined />
                            Khách hàng
                          </Space>
                        ),
                      },
                    ]}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <EditOutlined /> Chọn để cập nhật
                  </Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                <Space>
                  <CalendarOutlined />
                  <DateField
                    value={user.created_at}
                    format="DD/MM/YYYY HH:mm"
                  />
                </Space>
              </Descriptions.Item>

              {user.updated_at && (
                <Descriptions.Item label="Cập nhật lần cuối">
                  <Space>
                    <CalendarOutlined />
                    <DateField
                      value={user.updated_at}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Thông tin phân quyền */}
          <Card title="Thông tin phân quyền" bordered={false}>
            <Alert
              message={
                user.role === "admin"
                  ? "Tài khoản Quản trị viên"
                  : "Tài khoản Khách hàng"
              }
              description={
                user.role === "admin"
                  ? "Tài khoản này có toàn quyền truy cập vào hệ thống quản trị. Có thể quản lý phòng, đặt phòng, dịch vụ, và tài khoản người dùng."
                  : "Tài khoản này chỉ có quyền truy cập vào các chức năng đặt phòng và quản lý thông tin cá nhân."
              }
              type={user.role === "admin" ? "warning" : "info"}
              showIcon
            />

            <Divider />

            <Descriptions column={1}>
              <Descriptions.Item label="Quyền truy cập">
                <Space direction="vertical">
                  {user.role === "admin" ? (
                    <>
                      <Text>✓ Quản lý phòng và loại phòng</Text>
                      <Text>✓ Quản lý đặt phòng</Text>
                      <Text>✓ Quản lý dịch vụ</Text>
                      <Text>✓ Quản lý tài khoản</Text>
                      <Text>✓ Xem báo cáo thống kê</Text>
                    </>
                  ) : (
                    <>
                      <Text>✓ Đặt phòng</Text>
                      <Text>✓ Xem lịch sử đặt phòng</Text>
                      <Text>✓ Quản lý thông tin cá nhân</Text>
                      <Text type="secondary">✗ Không có quyền quản trị</Text>
                    </>
                  )}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Space>
      )}
    </Show>
  );
};
