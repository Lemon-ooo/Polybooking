import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

export const EventEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    meta: {
      populate: true, // để refine load data vào form
    },
    // Chuyển đổi ngày khi nhận từ API
    queryOptions: {
      onSuccess(data) {
        if (data?.data) {
          formProps.form?.setFieldsValue({
            ...data.data,
            start_date: data.data.start_date
              ? dayjs(data.data.start_date)
              : null,
            end_date: data.data.end_date ? dayjs(data.data.end_date) : null,
          });
        }
      },
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Event title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Event details" />
        </Form.Item>

        <Form.Item name="start_date" label="Start Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="end_date" label="End Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
