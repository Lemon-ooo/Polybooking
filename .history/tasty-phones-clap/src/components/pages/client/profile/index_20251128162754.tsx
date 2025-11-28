import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Upload, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  /// Lấy profile từ BE qua authProvider.getIdentity()
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = localStorage.getItem("auth");
        if (!auth) return;

        const { token } = JSON.parse(auth);

        const res = await fetch("/api/profile", {
          headers: { Authorization: token },
        });

        const data = await res.json();
        const userData = data.data || data.user || data;

        setUser(userData);
        form.setFieldsValue(userData);
      } catch (err) {
        message.error("Không thể tải profile!");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const auth = localStorage.getItem("auth");
      const { token } = JSON.parse(auth!);

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      message.success("Cập nhật thành công!");

      // update lại localStorage
      const authState = JSON.parse(auth!);
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...authState, ...data.data })
      );
    } catch (err: any) {
      message.error(err.message);
    }

    setLoading(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Card title="Thông tin cá nhân" style={{ maxWidth: 600, margin: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar
          size={80}
          src={user.avatar ? user.avatar : undefined}
          style={{ backgroundColor: "#87d068" }}
        >
          {!user.avatar && user.user_name?.charAt(0)}
        </Avatar>
      </div>

      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item label="Họ tên" name="user_name">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone_number">
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* Avatar nếu muốn upload */}
        <Form.Item label="Avatar">
          <Upload beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu thay đổi
        </Button>
      </Form>
    </Card>
  );
};
