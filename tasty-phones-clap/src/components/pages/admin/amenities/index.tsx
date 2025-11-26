// src/pages/amenities/Amenities.tsx (hoặc đường dẫn của bạn)
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Image,
  Space,
  Popconfirm,
} from "antd";
import axiosInstance from "../../../../providers/data/axiosConfig";

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  amenity_image: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const Amenities: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState<Amenity | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/amenities");
      setAmenities(res.data.data || []);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Không thể tải danh sách tiện ích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (values: any) => {
    try {
      // Map lại tên field cho đúng với backend
      const payload = {
        amenity_name: values.amenity_name,
        amenity_image: values.amenity_image,
        description: values.description,
      };

      if (editing) {
        await axiosInstance.put(`/amenities/${editing.amenity_id}`, payload);
        message.success("Cập nhật thành công");
      } else {
        await axiosInstance.post("/amenities", payload);
        message.success("Thêm mới thành công");
      }

      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lưu thất bại");
    }
  };

  const handleDelete = async (amenity_id: number) => {
    try {
      await axiosInstance.delete(`/amenities/${amenity_id}`);
      message.success("Đã xóa tiện ích");
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Quản lý Tiện ích</h1>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          + Thêm Tiện ích
        </Button>
      </div>

      <Table
        rowKey="amenity_id"
        loading={loading}
        dataSource={amenities}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      >
        <Table.Column
          title="Hình ảnh"
          width={100}
          align="center"
          render={(_, record: Amenity) => (
            <Image
              src={`http://localhost:8000/storage/${record.amenity_image}`}
              alt={record.amenity_name}
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 8 }}
              fallback="/no-image.png"
            />
          )}
        />

        <Table.Column
          title="Tên tiện ích"
          dataIndex="amenity_name"
          render={(text: string) => <strong>{text}</strong>}
        />

        <Table.Column
          title="Mô tả"
          dataIndex="description"
          ellipsis={{ showTitle: true }}
          render={(text: string) => text || "Không có mô tả"}
        />

        <Table.Column
          title="Ngày tạo"
          dataIndex="created_at"
          render={(date: string) =>
            new Date(date).toLocaleDateString("vi-VN")
          }
        />

        <Table.Column
          title="Hành động"
          width={180}
          fixed="right"
          render={(_, record: Amenity) => (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setEditing(record);
                  form.setFieldsValue({
                    amenity_name: record.amenity_name,
                    amenity_image: record.amenity_image,
                    description: record.description,
                  });
                  setIsModalOpen(true);
                }}
              >
                Sửa
              </Button>

              <Popconfirm
                title="Xóa tiện ích này?"
                onConfirm={() => handleDelete(record.amenity_id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger size="small">
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      {/* Modal thêm/sửa */}
      <Modal
        title={editing ? "Cập nhật tiện ích" : "Thêm tiện ích mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Tên tiện ích"
            name="amenity_name"
            rules={[{ required: true, message: "Vui lòng nhập tên tiện ích!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Link ảnh (amenity_image)"
            name="amenity_image"
            rules={[{ required: true, message: "Vui lòng nhập link ảnh!" }]}
          >
            <Input placeholder="amenities/ten-file-cua-ban.jpg" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả về tiện ích này..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;