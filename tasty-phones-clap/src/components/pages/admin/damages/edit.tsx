import React, { useEffect, useState } from "react";
import { Card, Button, Form, Input, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const DamageEdit: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchItem = async () => {
    try {
      const res = await axiosInstance.get(`/damage-types/${id}`);
      form.setFieldsValue(res.data.data.type);
    } catch (err) {
      message.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      await axiosInstance.put(`/damage-types/${id}`, values);
      message.success("Cập nhật thành công!");
      navigate(-1);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>

      <Card title="Sửa Thiệt Hại">
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item label="Tên thiệt hại" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Giá phạt (VNĐ)" name="price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
        </Form>
      </Card>
    </div>
  );
};

export default DamageEdit;
