import React, { useEffect } from "react";
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
import { useGetIdentity } from "@refinedev/core";

const { Title } = Typography;

export const ProfileClient: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [saving, setSaving] = React.useState(false);
  const [openPasswordModal, setOpenPasswordModal] = React.useState(false);

  const API_BASE = "http://localhost:8000/api";

  // ============================================
  // ⭐ LẤY USER TỪ authProvider.getIdentity()
  // ============================================
  const { data: user, isLoading } = useGetIdentity();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        avatar: user.avatar,
      });
    }
  }, [user]);

  // ============================================
  // ⭐ CẬP NHẬT PROFILE
  // ============================================
  const handleUpdateProfile = async (values: any) => {
    try {
      setSaving(true);

      const auth = JSON.parse(localStorage.getItem("auth") || "{}");

      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        body: JSON.stringify(values),
      });

      const json = await res.json();

      if (!res.ok) {
        return message.error(json.message || "Cập nhật thất bại!");
      }

      message.success("Cập nhật thành công!");

      // cập nhật lại identity trong localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...auth,
          ...json.data, // BE trả về user mới
        })
      );

      // load lại form
      form.setFieldsValue(json.data);
    } catch (err) {
      message.error("Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // ⭐ ĐỔI MẬT KHẨU
  // ============================================
  const handleChangePassword = async (values: any) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");

      const res = await fetch(`${API_BASE}/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        body: JSON.stringify(values),
      });

      const json = await res.json();

      if (!res.ok) return message.error(json.message);

      message.success("Đổi mật khẩu thành công!");
      setOpenPasswordModal(false);
      passwordForm.resetFields();
    } catch {
      message.error("Lỗi server");
    }
  };

  if (isLoading) {
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
            <Input placeholder="Tên của bạn" />
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
            rules={[{ required: true }]}
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
                  return Promise.reject("Mật khẩu không trùng");
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
