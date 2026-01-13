import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { useNavigate } from "react-router-dom";

interface Damage {
  id: number;
  name: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

const Damages: React.FC = () => {
  const [damages, setDamages] = useState<Damage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Damage | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/damage-types");
      const list = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : [];

      setDamages(list);
    } catch (err) {
      message.error("Không thể tải danh sách thiệt hại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Damage) => {
    setEditing(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (editing) {
        await axiosInstance.put(`/damage-types/${editing.id}`, values);
        message.success("Cập nhật thành công!");
      } else {
        await axiosInstance.post(`/damage-types`, values);
        message.success("Thêm mới thành công!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lưu thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/damage-types/${id}`);
      message.success("Đã xóa thành công");
      fetchData();
    } catch (err: any) {
      message.error("Xóa thất bại!");
    }
  };

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Quản lý Thiệt Hại</h1>
        <Button type="primary" size="large" onClick={openCreateModal}>
          + Thêm Thiệt Hại
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={damages}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 700 }}
      >
        <Table.Column title="Tên thiệt hại" dataIndex="name" />
        <Table.Column
          title="Giá phạt"
          dataIndex="price"
          render={(p: number) =>
            p.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
          }
        />

        <Table.Column
          title="Ngày tạo"
          dataIndex="created_at"
          render={(date) =>
            date ? new Date(date).toLocaleDateString("vi-VN") : "-"
          }
        />

        <Table.Column
          title="Hành động"
          width={180}
          render={(_, record: Damage) => (
            <Space>
              <Tooltip title="Chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/admin/damages/show/${record.id}`)}
                />
              </Tooltip>

              <Tooltip title="Sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(record)}
                />
              </Tooltip>

              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc muốn xóa mục này không?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editing ? "Cập nhật Thiệt hại" : "Thêm Thiệt hại mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Tên thiệt hại"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên thiệt hại" }]}
          >
            <Input placeholder="VD: Vỡ ly, Cháy ga..." />
          </Form.Item>

          <Form.Item
            label="Giá phạt (VNĐ)"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá phạt" }]}
          >
            <Input type="number" placeholder="VD: 150000" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Damages;
