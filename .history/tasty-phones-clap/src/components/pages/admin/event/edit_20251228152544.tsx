import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Switch } from "antd";
import dayjs from "dayjs";

export const EventEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "events",
    redirect: "list",
  });

  const record = queryResult?.data?.data;

  return (
    <Edit title="Chỉnh sửa sự kiện" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...record,
          start_date: record?.start_date ? dayjs(record.start_date) : null,
          end_date: record?.end_date ? dayjs(record.end_date) : null,
          is_active: record?.is_active === 1 ? true : false,
        }}
      >
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
          <Input placeholder="events/banner.webp hoặc https://..." />
        </Form.Item>

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
        >
          <Switch checkedChildren="🟢 Bật" unCheckedChildren="⚪ Tắt" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
