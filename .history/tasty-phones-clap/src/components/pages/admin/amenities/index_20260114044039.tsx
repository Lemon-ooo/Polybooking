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
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();

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
      description: record.description || "",
    });

    // Hiển thị ảnh hiện tại
    if (record.amenity_image) {
      const file: UploadFile = {
        uid: "-1",
        name: record.amenity_image.split("/").pop() || "image.png",
        status: "done",
        url: `${BASE_URL}/${record.amenity_image}`,
      };
      setFileList([file]);
    } else {
      setFileList([]);
    }

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
    // Kiểm tra file chỉ bắt buộc với thêm mới
    if (!editing && fileList.length === 0) {
      message.error("Vui lòng chọn ảnh tiện ích!");
      return;
    }

    setSaveLoading(true);

    try {
      const formData = new FormData();

      // ⭐ SỬA QUAN TRỌNG: Thêm dữ liệu vào FormData
      formData.append("amenity_name", values.amenity_name.trim());

      if (values.description?.trim()) {
        formData.append("description", values.description.trim());
      } else {
        formData.append("description", "");
      }

      // Xử lý file ảnh
      const file = fileList[0];
      if (file?.originFileObj) {
        formData.append("amenity_image", file.originFileObj);
      }
      // Nếu đang sửa và không có file mới, KHÔNG append amenity_image
      // Backend sẽ tự động giữ ảnh cũ

      // ⭐ THÊM: Debug log để kiểm tra FormData
      console.log("FormData contents:");
      for (let [key, value] of (formData as any).entries()) {
        console.log(key, value);
      }

      if (editing) {
        // ⭐ QUAN TRỌNG: Dùng POST với _method=PUT cho Laravel
        const res = await axiosInstance.post(
          `/amenities/${editing.amenity_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
            params: {
              _method: "PUT",
            },
          }
        );

        message.success("Cập nhật thành công!");

        // Cập nhật state
        setAmenities((prev) =>
          prev.map((item) =>
            item.amenity_id === editing.amenity_id
              ? { ...item, ...res.data.data }
              : item
          )
        );
      } else {
        // ⭐ THÊM MỚI
        const res = await axiosInstance.post("/amenities", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        });

        message.success("Thêm mới thành công!");
        setAmenities((prev) => [res.data.data, ...prev]);
      }

      // Đóng modal và reset
      setIsModalOpen(false);
      setEditing(null);
      setFileList([]);
      form.resetFields();
    } catch (err: any) {
      console.error("Save error:", err);

      // Hiển thị lỗi chi tiết từ server
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach((field) => {
          message.error(errors[field][0]);
        });
      } else if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Lưu thất bại!");
      }
    } finally {
      setSaveLoading(false);
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

  // Xử lý upload file
  const handleUploadChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    // Chỉ lấy file cuối cùng
    const latestFile = newFileList.slice(-1);
    setFileList(latestFile);
  };

  // Custom upload (ngăn tự động upload)
  const beforeUpload = () => {
    return false; // Ngăn không cho upload tự động
  };

  // Xóa ảnh
  const handleRemove = (file: UploadFile) => {
    setFileList([]);
    return true;
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
        columns={[
          {
            title: "Hình ảnh",
            width: 100,
            align: "center",
            render: (_, record: Amenity) => (
              <Image
                src={`${BASE_URL}/${record.amenity_image}`}
                alt={record.amenity_name}
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 8 }}
                fallback="/no-image.png"
                preview={false}
              />
            ),
          },
          {
            title: "Tên tiện ích",
            dataIndex: "amenity_name",
            render: (text) => <strong>{text}</strong>,
          },
          {
            title: "Mô tả",
            dataIndex: "description",
            ellipsis: true,
            render: (text) => text || "-",
          },
          {
            title: "Ngày tạo",
            dataIndex: "created_at",
            render: (date) =>
              date ? new Date(date).toLocaleDateString("vi-VN") : "-",
          },
          {
            title: "Hành động",
            width: 180,
            fixed: "right",
            render: (_, record: Amenity) => (
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
            ),
          },
        ]}
      />

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
        destroyOnClose
        confirmLoading={saveLoading}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Tên tiện ích"
            name="amenity_name"
            rules={[
              { required: true, message: "Vui lòng nhập tên tiện ích!" },
              { min: 2, message: "Tên tiện ích phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="VD: Wifi miễn phí" />
          </Form.Item>

          <Form.Item
            label="Ảnh tiện ích"
            required={!editing}
            help={
              editing
                ? "Chọn ảnh mới nếu muốn thay đổi, không chọn sẽ giữ ảnh cũ"
                : "Vui lòng chọn ảnh"
            }
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={beforeUpload}
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={handleRemove}
              accept="image/*"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
                showDownloadIcon: false,
              }}
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
            <Input.TextArea
              rows={3}
              placeholder="Mô tả về tiện ích..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;
