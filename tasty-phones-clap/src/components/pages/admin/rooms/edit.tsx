import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber } from "antd";

export const RoomEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Loại phòng"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
        >
          <Select>
            <Select.Option value="standard">Standard</Select.Option>
            <Select.Option value="deluxe">Deluxe</Select.Option>
            <Select.Option value="suite">Suite</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
          />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Select.Option value="available">Có sẵn</Select.Option>
            <Select.Option value="occupied">Đã đặt</Select.Option>
            <Select.Option value="maintenance">Bảo trì</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
