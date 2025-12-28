import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

export const EventEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  // Lấy data từ server
  const eventData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...eventData,
          start_date: eventData?.start_date
            ? dayjs(eventData.start_date)
            : null,
          end_date: eventData?.end_date ? dayjs(eventData.end_date) : null,
        }}
      >
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
