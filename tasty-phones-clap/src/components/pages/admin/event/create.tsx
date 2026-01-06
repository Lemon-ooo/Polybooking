import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";

export const EventCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "events",
  });

  return (
    <Create saveButtonProps={saveButtonProps} title="Thêm sự kiện">
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Banner (URL)" name="banner">
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Create>
  );
};
