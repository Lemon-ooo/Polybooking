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
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); // 🔥 Thêm navigate

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

  // ⭐ Mở modal sửa
  const openEditModal = (record: Amenity) => {
    setEditing(record);
    form.setFieldsValue({
      amenity_name: record.amenity_name,
      description: record.description,
    });

    const file: UploadFile = {
      uid: "-1",
      name: record.amenity_image.split("/").pop() || "image.png",
      status: "done",
      url: `${BASE_URL}/${record.amenity_image}`,
    };
    setFileList([file]);
    setIsModalOpen(true);
  };

  // ⭐ Mở modal thêm mới
  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

 const handleSave = async (values: any) => {
  if (!editing && fileList.length === 0) {
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
  }

  try {
    let newAmenity: Amenity | null = null;

    if (editing) {
      formData.append("_method", "PUT");
      const res = await axiosInstance.post(
        `/amenities/${editing.amenity_id}`,
        formData
      );
      newAmenity = res.data.data;
      message.success("Cập nhật thành công!");
    } else {
      const res = await axiosInstance.post("/amenities", formData);
      newAmenity = res.data.data;
      message.success("Thêm mới thành công!");
    }

    if (newAmenity) {
      setAmenities((prev) =>
        editing
          ? prev.map((item) =>
              item.amenity_id === newAmenity!.amenity_id
                ? newAmenity!
                : item
            )
          : [newAmenity!, ...prev]
      );
    }

    setIsModalOpen(false);
    setEditing(null);
    setFileList([]);
    form.resetFields();
  } catch (err: any) {
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

        <Table.Column title="Mô tả" dataIndex="description" />

        <Table.Column
          title="Ngày tạo"
          dataIndex="created_at"
          render={(date) => new Date(date).toLocaleDateString("vi-VN")}
        />

        {/* ⭐⭐ HÀNH ĐỘNG — gồm Chi tiết, Sửa, Xóa ⭐⭐ */}
        <Table.Column
          title="Hành động"
          width={180}
          fixed="right"
          render={(_, record: Amenity) => (
            <Space>
              <Tooltip title="Chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() =>
                    navigate(`/admin/amenities/show/${record.amenity_id}`)
                  }
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
                  title="Bạn có chắc muốn xóa tiện ích này không?"
                  onConfirm={() => handleDelete(record.amenity_id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          )}
        />
      </Table>

      {/* Modal thêm / sửa */}
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
  required={!editing}
>

            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: newFiles }) =>
                setFileList(newFiles.slice(-1))
              }
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

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả về tiện ích..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;
