import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Modal,
  Avatar,
  Row,
  Col,
  Tag,
  Descriptions,
  Upload,
  Typography,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { axiosInstance } from "../../../../providers/data/axiosConfig";

const { Title, Text } = Typography;

interface UserProfile {
  id: number;
  user_name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  avatar?: string | null;
  avatar_url?: string;
  role: string;
  created_at?: string;
}

export const ProfileClient: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/client/profile");
      if (res.data.success && res.data.data) {
        const u = res.data.data;
        setUser(u);
        profileForm.setFieldsValue({
          user_name: u.user_name,
          email: u.email,
          phone_number: u.phone_number || "",
          address: u.address || "",
        });
        setAvatarUrl(u.avatar_url || "");
      }
    } catch (err: any) {
      message.error("Unable to load user information");
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUploadAvatar = async (file: any) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axiosInstance.post("/client/profile/avatar", formData);
      if (res.data.success && res.data.avatar_url) {
        const newAvatarUrl = res.data.avatar_url + "?t=" + Date.now();
        setAvatarUrl(newAvatarUrl);
        message.success("Avatar changed successfully!");
        fetchUser();
        window.dispatchEvent(new Event("avatarUpdated"));
      }
      return Upload.LIST_IGNORE;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Upload avatar failed");
      return Upload.LIST_IGNORE;
    }
  };

  const handleUpdateProfile = async (values: any) => {
    try {
      setSaving(true);
      const res = await axiosInstance.put("/client/profile", values);
      if (res.data.success) {
        message.success("Information updated successfully!");
        setEditMode(false);
        fetchUser();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      setChangingPassword(true);
      await axiosInstance.put("/client/profile/password", {
        current_password: values.current_password,
        password: values.new_password,
        password_confirmation: values.new_password_confirmation,
      });
      message.success("Password changed successfully!");
      setOpenPasswordModal(false);
      passwordForm.resetFields();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Password change failed.");
    } finally {
      setChangingPassword(false);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Please upload an image!");
        return Upload.LIST_IGNORE;
      }
      if (file.size > 5 * 1024 * 1024) {
        message.error("Image must not exceed 5MB!");
        return Upload.LIST_IGNORE;
      }
      return handleUploadAvatar(file);
    },
    showUploadList: false,
  };

  const getRoleColor = (role: string) => (role === "admin" ? "red" : "blue");
  const getRoleText = (role: string) =>
    role === "admin" ? "Admin" : "Customer";

  if (loading)
    return <Spin size="large" style={{ display: "block", marginTop: 100 }} />;
  if (!user) return <div>User not found</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9f7f5",
        padding: "40px 20px",
      }}
    >
      {/* Banner */}
      <div
        style={{
          height: 300,
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://ruedelamourhotel.com/wp-content/uploads/2025/02/2.jpg') center/cover`,
          borderRadius: 20,
          marginBottom: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 48, margin: 0 }}>Personal Profile</h1>
          <p style={{ fontSize: 20 }}>Account Information Management</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[40, 40]}>
          {/* CỘT TRÁI: Avatar + Thông tin cơ bản */}
          <Col xs={24} lg={9}>
            <Card
              style={{
                borderRadius: 20,
                textAlign: "center",
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
              bodyStyle={{ padding: "40px 24px" }}
            >
              {/* Avatar lớn */}
              <Upload {...uploadProps}>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    cursor: "pointer",
                    marginBottom: 24,
                  }}
                >
                  <Avatar
                    size={180}
                    src={avatarUrl}
                    icon={<UserOutlined />}
                    style={{ border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "#a8765a",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid white",
                    }}
                  >
                    <CameraOutlined style={{ color: "white", fontSize: 22 }} />
                  </div>
                </div>
              </Upload>

              <Title level={2} style={{ margin: "16px 0 8px" }}>
                {user.user_name}
              </Title>

              <Tag
                color={getRoleColor(user.role)}
                style={{ fontSize: 16, padding: "8px 24px", borderRadius: 20 }}
              >
                {getRoleText(user.role)}
              </Tag>

              <div style={{ marginTop: 32, textAlign: "left" }}>
                <Descriptions column={1} colon={false}>
                  <Descriptions.Item
                    label={<Text strong style={{ color: "#666" }}>Email</Text>}
                  >
                    <Text>{user.email}</Text>
                  </Descriptions.Item>
                  {user.phone_number && (
                    <Descriptions.Item
                      label={<Text strong style={{ color: "#666" }}>Phone</Text>}
                    >
                      <Text>{user.phone_number}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>

              <Button
                danger
                size="large"
                icon={<LockOutlined />}
                onClick={() => setOpenPasswordModal(true)}
                block
                style={{ marginTop: 32, height: 48, fontSize: 16 }}
              >
                Change Password
              </Button>
            </Card>
          </Col>

          {/* CỘT PHẢI: Form chỉnh sửa thông tin (to hơn, đẹp hơn) */}
          <Col xs={24} lg={15}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={3} style={{ margin: 0 }}>
                    Personal Information
                  </Title>
                  <div>
                    {!editMode ? (
                      <Button
                        type="primary"
                        size="large"
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                        style={{
                          backgroundColor: "#a8765a",
                          borderColor: "#a8765a",
                        }}
                      >
                        Edit Information
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setEditMode(false);
                          profileForm.setFieldsValue({
                            user_name: user?.user_name || "",
                            email: user?.email || "",
                            phone_number: user?.phone_number || "",
                            address: user?.address || "",
                          });
                        }}
                        style={{ marginRight: 8 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              }
              style={{
                borderRadius: 20,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                height: "100%",
              }}
              bodyStyle={{ padding: "32px 40px" }}
            >
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleUpdateProfile}
                disabled={!editMode}
                size="large"
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      label="Full Name"
                      name="user_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your full name!",
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Email" name="email">
                      <Input prefix={<MailOutlined />} disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Phone Number" name="phone_number">
                      <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Address" name="address">
                      <Input prefix={<HomeOutlined />} placeholder="Enter address" />
                    </Form.Item>
                  </Col>
                </Row>

                {editMode && (
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={saving}
                      size="large"
                      block
                      icon={<SaveOutlined />}
                      style={{
                        height: 52,
                        fontSize: 17,
                        backgroundColor: "#a8765a",
                        borderColor: "#a8765a",
                      }}
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal đổi mật khẩu */}
      <Modal
        title={<Title level={4}>Change Password</Title>}
        open={openPasswordModal}
        onCancel={() => {
          setOpenPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          size="large"
        >
          <Form.Item
            label="Current Password"
            name="current_password"
            rules={[{ required: true, message: "Please enter current password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="new_password"
            rules={[
              { required: true },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="new_password_confirmation"
            dependencies={["new_password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={changingPassword}
              block
              size="large"
              style={{ height: 48 }}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileClient;