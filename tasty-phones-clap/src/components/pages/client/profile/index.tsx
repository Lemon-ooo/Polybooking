import React, { useEffect, useState } from "react";
import {
  Card, Form, Input, Button, message, Spin, Modal, Avatar, Row, Col, Tag, Descriptions, Upload, Typography,
} from "antd";
import {
  UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined,
  EditOutlined, SaveOutlined, CameraOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { axiosInstance } from "../../../../providers/data/axiosConfig";

const { Title } = Typography;

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

  // TỰ FETCH USER MỚI NHẤT TỪ SERVER – CHẠY NGON 100%
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
      message.error("Không thể tải thông tin người dùng");
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // GỌI LẠI MỖI KHI TRANG LOAD HOẶC F5
  useEffect(() => {
    fetchUser();
  }, []);

  // UPLOAD AVATAR
  const handleUploadAvatar = async (file: any) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axiosInstance.post("/client/profile/avatar", formData);
      if (res.data.success && res.data.avatar_url) {
        setAvatarUrl(res.data.avatar_url + "?t=" + Date.now());
        message.success("Đổi ảnh đại diện thành công!");
        fetchUser(); // Lấy lại thông tin mới nhất
      }
      return Upload.LIST_IGNORE;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Upload ảnh thất bại");
      return Upload.LIST_IGNORE;
    }
  };

  // CẬP NHẬT PROFILE
  const handleUpdateProfile = async (values: any) => {
    try {
      setSaving(true);
      const res = await axiosInstance.put("/client/profile", values);
      if (res.data.success) {
        message.success("Cập nhật thông tin thành công!");
        setEditMode(false);
        fetchUser(); // Quan trọng: lấy lại dữ liệu mới nhất
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  // ĐỔI MẬT KHẨU – GIỮ NGUYÊN 100%
  const handleChangePassword = async (values: any) => {
    try {
      setChangingPassword(true);
      await axiosInstance.put("/client/profile/password", {
        current_password: values.current_password,
        password: values.new_password,
        password_confirmation: values.new_password_confirmation,
      });
      message.success("Đổi mật khẩu thành công!");
      setOpenPasswordModal(false);
      passwordForm.resetFields();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được upload file ảnh!");
        return Upload.LIST_IGNORE;
      }
      if (file.size > 5 * 1024 * 1024) {
        message.error("Ảnh không được quá 5MB!");
        return Upload.LIST_IGNORE;
      }
      return handleUploadAvatar(file);
    },
    showUploadList: false,
  };

  const getRoleColor = (role: string) => (role === "admin" ? "red" : "blue");
  const getRoleText = (role: string) => (role === "admin" ? "Quản trị viên" : "Khách hàng");

  if (loading) return <Spin size="large" style={{ display: "block", marginTop: 100 }} />;
  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f9f7f5", padding: "40px 20px" }}>
      {/* Banner đẹp lung linh */}
      <div style={{
        height: 300,
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1520250497591-7f0d98f1caf0?w=1600') center/cover`,
        borderRadius: 20,
        marginBottom: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center"
      }}>
        <div>
          <h1 style={{ fontSize: 48, margin: 0 }}>Hồ Sơ Cá Nhân</h1>
          <p style={{ fontSize: 20 }}>Quản lý thông tin tài khoản</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Upload {...uploadProps}>
            <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
              <Avatar size={160} src={avatarUrl} icon={<UserOutlined />} />
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                background: "#a8765a", width: 44, height: 44,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <CameraOutlined style={{ color: "white", fontSize: 20 }} />
              </div>
            </div>
          </Upload>
        </div>

        <Row gutter={32}>
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 16, textAlign: "center" }}>
              <Title level={3}>{user.user_name}</Title>
              <Tag color={getRoleColor(user.role)} style={{ fontSize: 16, padding: "6px 20px" }}>
                {getRoleText(user.role)}
              </Tag>
              <Descriptions column={1} style={{ marginTop: 20 }}>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                {user.phone_number && <Descriptions.Item label="Điện thoại">{user.phone_number}</Descriptions.Item>}
              </Descriptions>
              <Button
                danger
                size="large"
                icon={<LockOutlined />}
                onClick={() => setOpenPasswordModal(true)}
                block
                style={{ marginTop: 20 }}
              >
                Đổi mật khẩu
              </Button>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card
              title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>Thông Tin Cá Nhân</span>
                {!editMode ? (
                  <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Button onClick={() => { setEditMode(false); profileForm.resetFields(); }}>
                    Hủy
                  </Button>
                )}
              </div>}
              style={{ borderRadius: 16 }}
            >
              <Form form={profileForm} layout="vertical" onFinish={handleUpdateProfile} disabled={!editMode}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="Họ và tên" name="user_name" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
                      <Input size="large" prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Email" name="email">
                      <Input size="large" prefix={<MailOutlined />} disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Số điện thoại" name="phone_number">
                      <Input size="large" prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Địa chỉ" name="address">
                      <Input size="large" prefix={<HomeOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                {editMode && (
                  <Button type="primary" htmlType="submit" loading={saving} size="large" block icon={<SaveOutlined />}>
                    Lưu thông tin
                  </Button>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal đổi mật khẩu – giữ nguyên đẹp lung linh */}
      <Modal
        title="Đổi mật khẩu"
        open={openPasswordModal}
        onCancel={() => { setOpenPasswordModal(false); passwordForm.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item label="Mật khẩu hiện tại" name="current_password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="new_password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="new_password_confirmation"
            dependencies={["new_password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) return Promise.resolve();
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={changingPassword} block size="large">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileClient;