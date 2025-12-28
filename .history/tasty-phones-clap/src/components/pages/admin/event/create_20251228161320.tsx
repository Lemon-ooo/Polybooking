import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Switch, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const EventCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "events",
    redirect: "list",

    transformValues: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append(
        "start_date",
        dayjs(values.start_date).format("YYYY-MM-DD")
      );
      formData.append("end_date", dayjs(values.end_date).format("YYYY-MM-DD"));
      formData.append("is_active", values.is_active ? "1" : "0");

      // 🎯 Append file đúng cách
      if (values.banner instanceof Array && values.banner.length > 0) {
        const file = values.banner[0].originFileObj;
        if (file instanceof File) {
          formData.append("banner", file);
        }
      }

      return formData;
    },
  });

  return (
    <Create title="Tạo sự kiện mới" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Không được bỏ trống" }]}
        >
          <Input placeholder="Nhập tên sự kiện" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Mô tả sự kiện" />
        </Form.Item>

        <Form.Item
          label="Banner"
          name="banner"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Kích hoạt sự kiện"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>
      </Form>
    </Create>
  );
};
