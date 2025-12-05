import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { IResourceComponentsProps, useNavigation } from "@refinedev/core";

const EVENT_RESOURCE = "events";

interface EventPayload {
  name: string;
  description?: string;
  location: string;
  date: string;
  image?: any;
}

export const EventCreate: React.FC<IResourceComponentsProps> = () => {
  const { goBack, list } = useNavigation();

  const { formProps, saveButtonProps } = useForm<EventPayload>({
    resource: EVENT_RESOURCE,
  });

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList?.slice(-1);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const formattedDate = values.date
        ? dayjs(values.date).format("YYYY-MM-DD")
        : undefined;

      const imageFile =
        values.image && values.image[0]
          ? values.image[0].originFileObj
          : undefined;

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("location", values.location);
      formData.append("date", formattedDate || "");
      formData.append("description", values.description || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // refine expects: onFinish(values)
      await formProps.onFinish?.(formData);

      message.success("Thêm sự kiện thành công!");
      list(EVENT_RESOURCE);
    } catch (error: any) {
      console.error("Lỗi khi thêm sự kiện:", error);
      message.error(error.message || "Thêm sự kiện thất bại!");
    }
  };

  return (
    <Create
      title="Thêm Sự kiện Mới"
      onBack={goBack}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: () => formProps.form?.submit(),
      }}
    >
      <Form
        {...formProps}
        form={formProps.form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Tên Sự kiện"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sự kiện." }]}
        >
          <Input placeholder="Nhập tên sự kiện..." />
        </Form.Item>

        <Form.Item
          label="Địa điểm"
          name="location"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm." }]}
        >
          <Input placeholder="Nhập địa điểm tổ chức sự kiện..." />
        </Form.Item>

        <Form.Item
          label="Ngày Diễn ra"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn ngày." }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày diễn ra"
          />
        </Form.Item>

        <Form.Item
          label="Ảnh Sự kiện"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên (Max 5MB)</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea
            rows={4}
            placeholder="Nhập mô tả sự kiện (Không bắt buộc)..."
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
