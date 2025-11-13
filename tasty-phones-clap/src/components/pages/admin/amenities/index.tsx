import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axiosInstance from "../../../../providers/data/axiosConfig";

const Amenities: React.FC = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/amenities");
      setAmenities(res.data.data);
    } catch (err) {
      message.error("Không thể tải danh sách tiện ích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (values: any) => {
    try {
      if (editing) {
        await axiosInstance.put(`/amenities/${editing.amenity_id}`, values);
        message.success("Cập nhật thành công");
      } else {
        await axiosInstance.post("/amenities", values);
        message.success("Thêm mới thành công");
      }
      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch {
      message.error("Lưu thất bại");
    }
  };

  const handleDelete = async (amenity_id: number) => {
    if (!window.confirm("Xóa tiện ích này?")) return;
    try {
      await axiosInstance.delete(`/amenities/${amenity_id}`);
      message.success("Đã xóa");
      fetchData();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Quản lý Tiện ích</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
            form.resetFields();
            setEditing(null);
          }}
        >
          + Thêm Tiện ích
        </Button>
      </div>

      <Table
        rowKey="amenity_id"
        loading={loading}
        dataSource={amenities}
        columns={[
          { title: "Tên", dataIndex: "name" },
          { title: "Danh mục", dataIndex: "category" },
          {
            title: "Hình ảnh",
            dataIndex: "icon_url",
            render: (url: string) =>
              url ? (
                <img
                  src={url}
                  alt="icon"
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <span>Không có</span>
              ),
          },
          { title: "Mô tả", dataIndex: "description" },
          {
            title: "Hành động",
            render: (record) => (
              <>
                <Button
                  onClick={() => {
                    setEditing(record);
                    form.setFieldsValue(record);
                    setIsModalOpen(true);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  danger
                  className="ml-2"
                  onClick={() => handleDelete(record.amenity_id)}
                >
                  Xóa
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        title={editing ? "Cập nhật tiện ích" : "Thêm tiện ích"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Tên tiện ích"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên tiện ích" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Danh mục" name="category">
            <Input />
          </Form.Item>
          <Form.Item label="Icon URL" name="icon_url">
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;
