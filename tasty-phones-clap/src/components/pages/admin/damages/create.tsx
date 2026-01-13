import React from "react";
import { Card, Form, Input, Button, message } from "antd";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { useNavigate } from "react-router-dom";

const DamageCreate: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      await axiosInstance.post("/damage-types", values);
      message.success("Thêm thiệt hại thành công!");
      navigate("/admin/damages");   
    } catch (err: any) {
      message.error(err.response?.data?.message || "Thêm thất bại!");
    }
  };

  return (
    <Card title="Thêm Thiệt Hại" style={{ padding: 24 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Tên thiệt hại"
          rules={[{ required: true, message: "Không được bỏ trống" }]}
        >
          <Input placeholder="VD: Vỡ kính, Cháy ga..." />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá phạt (VNĐ)"
          rules={[{ required: true, message: "Không được bỏ trống" }]}
        >
          <Input type="number" placeholder="150000" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Thêm mới
        </Button>

        <Button
          style={{ marginLeft: 10 }}
          onClick={() => navigate("/admin/damages")}
        >
          Hủy
        </Button>
      </Form>
    </Card>
  );
};

export default DamageCreate;
