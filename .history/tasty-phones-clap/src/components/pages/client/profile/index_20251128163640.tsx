import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Modal,
  Typography,
  Avatar,
  Upload,
  Divider,
  Row,
  Col,
  Tag,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useGetIdentity } from "@refinedev/core";
import type { UploadProps } from "antd";

const { Title, Text } = Typography;

interface UserProfile {
  id: number;
  user_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  role: string;
  created_at?: string;
}

export const ProfileClient: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  // Lấy thông tin user
  const { data: user, isLoading, refetch } = useGetIdentity<UserProfile>();

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number || "",
        address: user.address || "",
        avatar: user.avatar || "",
      });
      setAvatarUrl(user.avatar || "");
    }
  }, [user, profileForm]);

  // Cập nhật profile
  const handleUpdateProfile = async (values: any) => {
    try {
      setSaving(true);

      const auth = JSON.parse(localStorage.getItem("auth") || "{}");

      const response = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cập nhật thất bại!");
      }

      message.success("Cập nhật thông tin thành công!");

      // Cập nhật localStorage
      const updatedAuth = {
        ...auth,
        ...data.data,
      };
      localStorage.setItem("auth", JSON.stringify(updatedAuth));

      // Refresh identity data
      await refetch?.();

      setEditMode(false);
    } catch (error: any) {
      message.error(error.message || "Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (values: any) => {
    try {
      setChangingPassword(true);

      const auth = JSON.parse(localStorage.getItem("auth") || "{}");

      const response = await fetch(`${API_BASE}/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đổi mật khẩu thất bại!");
      }

      message.success("Đổi mật khẩu thành công!");
      setOpenPasswordModal(false);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.message || "Lỗi server");
    } finally {
      setChangingPassword(false);
    }
  };

  // Upload avatar
  const handleAvatarUpload: UploadProps["onChange"] = (info) => {
    if (info.file.status === "done") {
      // Giả sử BE trả về URL của ảnh
      const newAvatarUrl = info.file.response?.data?.url;
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);
        profileForm.setFieldValue("avatar", newAvatarUrl);
        message.success("Cập nhật ảnh đại diện thành công!");
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "customer":
        return "blue";
      default:
        return "green";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "customer":
        return "Khách hàng";
      default:
        return "Người dùng";
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải thông tin...</Text>
        </div>
      </div>
    );
  }

  return (
    <div
      className="profile-client-container"
      style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}
    >
      <Row gutter={[24, 24]}>
        {/* Sidebar - Thông tin cơ bản */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                size={100}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{ marginBottom: 16, border: "3px solid #f0f0f0" }}
              />
              <Title level={4} style={{ margin: 0 }}>
                {user?.user_name}
              </Title>
              <Tag
                color={getRoleColor(user?.role || "")}
                style={{ marginTop: 8 }}
              >
                {getRoleText(user?.role || "")}
              </Tag>

              <Upload
                showUploadList={false}
                action={`${API_BASE}/upload-avatar`}
                headers={{
                  Authorization: JSON.parse(
                    localStorage.getItem("auth") || "{}"
                  ).token,
                }}
                onChange={handleAvatarUpload}
              >
                <Button
                  type="link"
                  icon={<CameraOutlined />}
                  style={{ marginTop: 8 }}
                >
                  Đổi ảnh đại diện
                </Button>
              </Upload>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={
                  <>
                    <MailOutlined /> Email
                  </>
                }
              >
                {user?.email}
              </Descriptions.Item>
              {user?.phone_number && (
                <Descriptions.Item
                  label={
                    <>
                      <PhoneOutlined /> Điện thoại
                    </>
                  }
                >
                  {user.phone_number}
                </Descriptions.Item>
              )}
              {user?.created_at && (
                <Descriptions.Item label="Tham gia">
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Button
              type="primary"
              danger
              icon={<LockOutlined />}
              onClick={() => setOpenPasswordModal(true)}
              block
            >
              Đổi mật khẩu
            </Button>
          </Card>
        </Col>

        {/* Main content - Form chỉnh sửa */}
        <Col xs={24} md={16}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Thông Tin Cá Nhân</span>
                {!editMode ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(true)}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditMode(false);
                      profileForm.resetFields();
                    }}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            }
          >
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
              disabled={!editMode}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="user_name"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nhập họ và tên"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Số điện thoại" name="phone_number">
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input
                      prefix={<HomeOutlined />}
                      placeholder="Nhập địa chỉ"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Ảnh đại diện (URL)"
                name="avatar"
                extra="Nhập URL ảnh đại diện hoặc sử dụng nút upload bên cạnh"
              >
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </Form.Item>

              {editMode && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={saving}
                    icon={<SaveOutlined />}
                    block
                    size="large"
                  >
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal đổi mật khẩu */}
      <Modal
        title={
          <div>
            <LockOutlined style={{ marginRight: 8 }} />
            Đổi mật khẩu
          </div>
        }
        open={openPasswordModal}
        onCancel={() => {
          setOpenPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="current_password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="new_password_confirmation"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={changingPassword}
              block
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
