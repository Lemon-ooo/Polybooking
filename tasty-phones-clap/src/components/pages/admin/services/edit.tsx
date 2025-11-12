// src/components/pages/admin/services/Edit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch } from "antd";

export const ServicesEdit = () => {
  const { formProps, saveButtonProps } = useForm({
      resource: "services",

  });
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tên dịch vụ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `₫${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\₫\s?|(,*)/g, "") as any}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

      
      </Form>
    </Edit>
  );
};