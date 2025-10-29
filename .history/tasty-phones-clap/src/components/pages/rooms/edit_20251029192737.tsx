import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber } from "antd";

export const RoomEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Số phòng"
          name="room_number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Loại phòng"
          name="room_type_id"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Phòng đơn", value: 1 },
              { label: "Phòng đôi", value: 2 },
              { label: "Suite", value: 3 },
            ]}
          />
        </Form.Item>
        <Form.Item label="Giá" name="price">
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `₫${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Có sẵn", value: "available" },
              { label: "Đã thuê", value: "occupied" },
              { label: "Bảo trì", value: "maintenance" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
