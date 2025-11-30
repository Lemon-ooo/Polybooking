import React, { useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, Button, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const RoomTypeCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState<RcFile | null>(null);
  const [subImages, setSubImages] = useState<RcFile[]>([]);
  const [subFileList, setSubFileList] = useState<UploadFile[]>([]);

  const token = localStorage.getItem("token");

  /** Chọn ảnh đại diện */
  const beforeUploadMain = (file: RcFile) => {
    setMainImage(file);
    return false;
  };

  /** Chọn ảnh phụ */
  const beforeUploadSub = (file: RcFile) => {
    setSubImages((prev) => [...prev, file]);
    setSubFileList((prev) => [
      ...prev,
      { uid: file.uid, name: file.name, status: "done" },
    ]);
    return false;
  };

  /** Xóa ảnh phụ khỏi danh sách */
  const handleRemoveSubImage = (file: UploadFile) => {
    setSubImages((prev) => prev.filter((f) => f.uid !== file.uid));
    setSubFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  /** Submit form chính */
  const onFinish = async (values: any) => {
    try {
      // 1️⃣ Tạo room type + ảnh đại diện
      const formDataRoomType = new FormData();
      formDataRoomType.append("room_type_name", values.room_type_name);
      formDataRoomType.append("base_price", values.base_price);
      formDataRoomType.append("max_guests", values.max_guests);
      formDataRoomType.append("description", values.description);
      if (mainImage) formDataRoomType.append("room_type_image", mainImage);

      formDataRoomType.append("image_type", "main");

      const roomRes = await axios.post(
        "http://localhost:8000/api/room-types",
        formDataRoomType,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              }
            : { "Content-Type": "multipart/form-data" },
        }
      );

      const roomTypeId = roomRes.data.data.room_type_id;

      // 2️⃣ Upload tất cả ảnh phụ 1 lần
      if (subImages.length > 0) {
        const subFormData = new FormData();
        subImages.forEach((file) => subFormData.append("images[]", file));
        subFormData.append("image_type", "secondary");

        await axios.post(
          `http://localhost:8000/api/room-types/${roomTypeId}/images`,
          subFormData,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                }
              : { "Content-Type": "multipart/form-data" },
          }
        );
      }

      message.success("Thêm loại phòng thành công!");
      navigate("/admin/room-types");
    } catch (error: any) {
      console.error(error);
      message.error(
        error.response
          ? `Thêm loại phòng thất bại: ${error.response.status} - ${error.response.statusText}`
          : "Thêm loại phòng thất bại! Kiểm tra kết nối server."
      );
    }
  };

  return (
    <Create title="Thêm loại phòng" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên loại phòng"
          name="room_type_name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại phòng" }]}
        >
          <Input placeholder="Nhập tên loại phòng..." />
        </Form.Item>

        <Form.Item
          label="Giá cơ bản"
          name="base_price"
          rules={[{ required: true, message: "Vui lòng nhập giá cơ bản" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập giá cơ bản"
            formatter={(value) =>
              value
                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
                : ""
            }
            parser={(value) => value?.replace(/\₫|\s|,/g, "") || ""}
          />
        </Form.Item>

        <Form.Item
          label="Số khách tối đa"
          name="max_guests"
          rules={[{ required: true, message: "Vui lòng nhập số khách tối đa" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            placeholder="Nhập số khách tối đa..."
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả" },
            { min: 10, message: "Mô tả phải ít nhất 10 ký tự" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả loại phòng..." />
        </Form.Item>

        <Form.Item label="Ảnh đại diện" required>
          <Upload beforeUpload={beforeUploadMain} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
          </Upload>
          { mainImage && (
            <p style={{ color: "green" }}></p>
          )}
        </Form.Item>

        <Form.Item label="Ảnh phụ">
          <Upload
            multiple
            beforeUpload={beforeUploadSub}
            fileList={subFileList}
            onRemove={handleRemoveSubImage}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh phụ</Button>
          </Upload>
          {subImages.length > 0 && (
            <Space direction="vertical" style={{ color: "green" }}>
              {subImages.map((img) => (
                <span key={img.uid}></span>
              ))}
            </Space>
          )}
        </Form.Item>
      </Form>
    </Create>
  );
};
