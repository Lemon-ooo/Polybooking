import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Switch, Button } from "antd";
import dayjs from "dayjs";

export const EventCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "events",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps} title="Tạo sự kiện mới">
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
          <Input placeholder="Ví dụ: events/banner.webp" />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
          })}
          normalize={(value) => dayjs(value).format("YYYY-MM-DD")}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
          })}
          normalize={(value) => dayjs(value).format("YYYY-MM-DD")}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Kích hoạt"
          initialValue={true}
          valuePropName="checked"
        >
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>

        <Button type="primary" {...saveButtonProps}>
          Lưu sự kiện
        </Button>
      </Form>
    </Create>
  );
};
