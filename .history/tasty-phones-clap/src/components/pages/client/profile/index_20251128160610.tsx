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
} from "antd";
import "./ProfileClient.css";

const { Title } = Typography;

export const ProfileClient: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const API_BASE = "http://localhost:8000/api";

  const token = localStorage.getItem("auth-token");

  // ================================
  // 🔥 Fetch profile (/auth/me)
  // ================================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      if (json.success) {
        form.setFieldsValue(json.data);
      } else {
        message.error("Không thể tải thông tin người dùng");
      }
    } catch (err) {
      message.error("Lỗi kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================================
  // 🔥 Update Profile
  // ================================
  const handleUpdateProfile = async (values: any) => {
    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const json = await res.json();

      if (json.success) {
        message.success("Cập nhật thông tin thành công!");
        fetchProfile();
      } else {
        message.error(json.message || "Cập nhật thất bại");
      }
    } catch (error) {
      message.error("Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // 🔥 Change password
  // ================================
  const handleChangePassword = async (values: any) => {
    try {
      const res = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const json = await res.json();

      if (!json.success) {
        return message.error(json.message || "Đổi mật khẩu thất bại");
      }

      message.success("Đổi mật khẩu thành công!");
      setOpenPasswordModal(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error("Lỗi server");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="profile-client-container">
      <Card className="profile-card">
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Thông Tin Cá Nhân
        </Title>

        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item
            label="Họ và tên"
            name="user_name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone_number">
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Ảnh đại diện (URL)" name="avatar">
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving} block>
            Lưu thay đổi
          </Button>
        </Form>

        <Button
          danger
          style={{ marginTop: 20 }}
          onClick={() => setOpenPasswordModal(true)}
          block
        >
          Đổi mật khẩu
        </Button>
      </Card>

      {/* ================= Password Modal ================= */}
      <Modal
        title="Đổi mật khẩu"
        open={openPasswordModal}
        okText="Đổi mật khẩu"
        onCancel={() => setOpenPasswordModal(false)}
        onOk={() => passwordForm.submit()}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="current_password"
            rules={[{ required: true, message: "Nhập mật khẩu hiện tại" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="new_password_confirmation"
            dependencies={["new_password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value)
                    return Promise.resolve();
                  return Promise.reject("Mật khẩu không trùng khớp");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
