import React from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Space,
  Typography,
} from "antd";
import { useList } from "@refinedev/core";

const { TextArea } = Input;
const { Title } = Typography;

export const RoomCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "rooms", // ✅ thêm dòng này để tránh lỗi
  });

  const { selectProps: roomTypeSelectProps } = useSelect({
    resource: "room-types",
    optionLabel: "name",
    optionValue: "id",
  });

  const { data: amenitiesData } = useList({
    resource: "amenities",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
          <Select {...roomTypeSelectProps} placeholder="Chọn loại phòng" />
        </Form.Item>

        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Trống", value: "trống" },
              { label: "Đã đặt", value: "đã đặt" },
              { label: "Bảo trì", value: "bảo trì" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Tiện nghi" name="amenities">
          <Checkbox.Group>
            <Space direction="vertical">
              {amenitiesData?.data?.map((amenity) => (
                <Checkbox key={amenity.id} value={amenity.id}>
                  {amenity.name}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Create>
  );
};
