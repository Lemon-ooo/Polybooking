import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Switch } from "antd";
import dayjs from "dayjs";

export const EventCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "events",
    redirect: "list",
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

        <Form.Item label="Banner (URL hoặc path)" name="banner">
          <Input placeholder="Ví dụ: events/banner.webp hoặc https://..." />
        </Form.Item>

        {/* 🔥 start_date */}
        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
          getValueFromEvent={(value) =>
            value ? dayjs(value).format("YYYY-MM-DD") : null
          }
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        {/* 🔥 end_date */}
        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
          getValueFromEvent={(value) =>
            value ? dayjs(value).format("YYYY-MM-DD") : null
          }
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
