import React, { useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, Button, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload";

export const RoomTypeCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "room-types",
    redirect: "list",
    transformValues: (values) => {
      const formData = new FormData();
      formData.append("room_type_name", values.room_type_name);
      formData.append("base_price", values.base_price);
      formData.append("max_guests", values.max_guests);
      formData.append("description", values.description);

      // Ảnh đại diện
      if (values.mainImage && values.mainImage.length > 0) {
        formData.append("room_type_image", values.mainImage[0].originFileObj);
        formData.append("image_type", "main");
      }

      // Ảnh phụ
      if (values.subImages && values.subImages.length > 0) {
        values.subImages.forEach((file: UploadFile) => {
          formData.append("images[]", file.originFileObj as RcFile);
        });
        formData.append("image_type", "secondary");
      }

      return formData;
    },
  });

  const [mainFileList, setMainFileList] = useState<UploadFile[]>([]);
  const [subFileList, setSubFileList] = useState<UploadFile[]>([]);

  /** Xử lý chọn ảnh đại diện */
  const handleMainBeforeUpload = (file: RcFile) => {
    setMainFileList([file as unknown as UploadFile]);
    return false; // prevent auto upload
  };

  /** Xử lý chọn ảnh phụ */
  const handleSubBeforeUpload = (file: RcFile) => {
    setSubFileList((prev) => [...prev, file as unknown as UploadFile]);
    return false;
  };

  /** Xóa ảnh phụ */
  const handleRemoveSub = (file: UploadFile) => {
    setSubFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  return (
    <Create title="Thêm loại phòng" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả" },
            { min: 10, message: "Mô tả phải ít nhất 10 ký tự" },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* Ảnh đại diện */}
        <Form.Item
          label="Ảnh đại diện"
          name="mainImage"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            beforeUpload={handleMainBeforeUpload}
            maxCount={1}
            fileList={mainFileList}
            onRemove={() => setMainFileList([])}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
          </Upload>
        </Form.Item>

        {/* Ảnh phụ */}
        <Form.Item
          label="Ảnh phụ"
          name="subImages"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            multiple
            beforeUpload={handleSubBeforeUpload}
            fileList={subFileList}
            onRemove={handleRemoveSub}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh phụ</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Create>
  );
};
