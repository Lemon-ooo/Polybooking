// src/pages/amenities/Amenities.tsx
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
  Upload,
  UploadFile,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const BASE_URL = "http://localhost:8000/storage";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/amenities");
      setAmenities(res.data.data || []);
    } catch (err: any) {
      message.error(
        err.response?.data?.message || "Không thể tải danh sách tiện ích"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Khi mở modal sửa → load ảnh cũ vào Upload
  const openEditModal = (record: Amenity) => {
    setEditing(record);
    form.setFieldsValue({
      amenity_name: record.amenity_name,
      description: record.description,
    });

    // Tạo fileList giả để hiển thị ảnh cũ
    const file: UploadFile = {
      uid: "-1",
      name: record.amenity_image.split("/").pop() || "image.png",
      status: "done",
      url: `${BASE_URL}/${record.amenity_image}`,
    };
    setFileList([file]);
    setIsModalOpen(true);
  };

  // Khi mở modal thêm mới
  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  const handleSave = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Vui lòng chọn ảnh tiện ích!");
      return;
    }

    const formData = new FormData();
    formData.append("amenity_name", values.amenity_name.trim());
    if (values.description?.trim()) {
      formData.append("description", values.description.trim());
    }

    const file = fileList[0];
    if (file?.originFileObj) {
      formData.append("amenity_image", file.originFileObj as Blob);
    } else if (editing) {
      formData.append("amenity_image", editing.amenity_image);
    }

    try {
      let newAmenity: Amenity | null = null;

      if (editing) {
        formData.append("_method", "PUT");
        const res = await axiosInstance.post(
          `/amenities/${editing.amenity_id}`,
          formData
        );
        newAmenity = res.data.data; // Laravel trả về bản ghi đã cập nhật
        message.success("Cập nhật thành công!");
      } else {
        const res = await axiosInstance.post("/amenities", formData);
        newAmenity = res.data.data; // bản ghi vừa thêm
        message.success("Thêm mới thành công!");
      }

      // CẬP NHẬT DANH SÁCH: Nếu là thêm mới → chèn vào đầu
      if (newAmenity) {
        if (!editing) {
          setAmenities((prev) => [newAmenity, ...prev]); // CHÈN VÀO ĐẦU
        } else {
          setAmenities((prev) =>
            prev.map((item) =>
              item.amenity_id === newAmenity.amenity_id ? newAmenity : item
            )
          );
        }
      }

      setIsModalOpen(false);
      setEditing(null);
      setFileList([]);
      form.resetFields();
      // Không cần fetchData() nữa → nhanh hơn, không nhảy loading
    } catch (err: any) {
      console.error("Lỗi:", err.response?.data);
      message.error(err.response?.data?.message || "Lưu thất bại!");
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
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Quản lý Tiện ích</h1>
        <Button type="primary" size="large" onClick={openCreateModal}>
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
              src={`${BASE_URL}/${record.amenity_image}`}
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
          render={(text) => <strong>{text}</strong>}
        />
        <Table.Column
          title="Mô tả"
          dataIndex="description"
          render={(text) => text || "—"}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="created_at"
          render={(date) => new Date(date).toLocaleDateString("vi-VN")}
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
                onClick={() => openEditModal(record)}
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

      {/* Modal Thêm / Sửa */}
      <Modal
        title={editing ? "Cập nhật tiện ích" : "Thêm tiện ích mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          setFileList([]);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Tên tiện ích"
            name="amenity_name"
            rules={[{ required: true, message: "Vui lòng nhập tên tiện ích!" }]}
          >
            <Input placeholder="VD: Wifi miễn phí" />
          </Form.Item>

          <Form.Item
            label="Ảnh tiện ích"
            rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList: newFileList }) => {
                setFileList(newFileList.slice(-1)); // chỉ giữ 1 ảnh
              }}
              beforeUpload={() => false} // ngăn upload tự động
              accept="image/*"
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Mô tả (không bắt buộc)" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả về tiện ích..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;
