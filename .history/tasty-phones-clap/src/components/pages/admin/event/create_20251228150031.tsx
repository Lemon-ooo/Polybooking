import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Switch } from "antd";
import dayjs from "dayjs";

export const EventCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "events",
    redirect: "list",
    onMutationSuccess: () => {
      console.log("🎉 Created successfully!");
    },
    transformValues: (values) => ({
      ...values,
      start_date: values.start_date
        ? dayjs(values.start_date).format("YYYY-MM-DD")
        : null,
      end_date: values.end_date
        ? dayjs(values.end_date).format("YYYY-MM-DD")
        : null,
    }),
  });

  return (
    <Create title="Tạo sự kiện mới" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Không được bỏ trống" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Banner" name="banner">
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true }]}
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
      </Form>
    </Create>
  );
};
