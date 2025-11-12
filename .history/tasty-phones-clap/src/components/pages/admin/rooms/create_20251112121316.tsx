import React from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Button, Card } from "antd";
import { Room, RoomStatus } from "../../../../interfaces/rooms";
import { formatPrice } from "../../../../interfaces/rooms";

const { TextArea } = Input;

export const RoomCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<Room>({
    resource: "rooms",
  });

  const { selectProps: roomTypeSelectProps } = useSelect({
    resource: "room-types",
    optionLabel: "name",
    optionValue: "id",
  });

  const statusOptions = Object.values(RoomStatus).map((status) => ({
    label:
      status === "trống"
        ? "Trống"
        : status === "đang sử dụng"
        ? "Đang sử dụng"
        : status === "maintenance"
        ? "Bảo trì"
        : "Đã đặt",
    value: status,
  }));

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Card title="Tạo phòng mới" style={{ maxWidth: 600, margin: "auto" }}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Số phòng"
            name="room_number"
            rules={[
              { required: true, message: "Vui lòng nhập số phòng" },
              {
                pattern: /^[A-Z0-9-]+$/,
                message: "Chỉ cho phép chữ hoa, số và dấu gạch ngang",
              },
            ]}
          >
            <Input placeholder="Ví dụ: 101, A-201" />
          </Form.Item>

          <Form.Item
            label="Loại phòng"
            name={["room_type", "id"]}
            rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
          >
            <Select {...roomTypeSelectProps} placeholder="Chọn loại phòng" />
          </Form.Item>

          <Form.Item
            label="Giá (VND)"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá phòng" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => formatPrice(value?.toString() || "0")}
              parser={(value) => value!.replace(/\D/g, "")}
              placeholder="Ví dụ: 500000"
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue={RoomStatus.AVAILABLE}
          >
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} placeholder="Mô tả chi tiết về phòng..." />
          </Form.Item>

          {/* Nếu bạn có amenities, có thể thêm sau */}
        </Form>
      </Card>
    </Create>
  );
};
