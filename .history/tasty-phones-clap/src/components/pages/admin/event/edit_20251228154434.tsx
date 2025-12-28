import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Spin } from "antd";
import dayjs from "dayjs";

export const EventEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  const eventData = queryResult?.data?.data;
  const loading = queryResult?.isLoading;

  // ⏳ Loading → Hiện spinner
  if (loading) return <Spin size="large" />;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        // 🧠 Sau khi có data thì set giá trị cho form
        initialValues={{
          ...eventData,
          start_date: eventData?.start_date
            ? dayjs(eventData.start_date)
            : null,
          end_date: eventData?.end_date ? dayjs(eventData.end_date) : null,
        }}
        key={eventData?.id} // 🔑 giúp component re-render đúng
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
