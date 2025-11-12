import React from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Card, Spin } from "antd";
import { Room, RoomStatus } from "../../../../interfaces/rooms";
import { formatPrice } from "../../../../interfaces/rooms";

const { TextArea } = Input;

export const RoomEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<Room>({
    resource: "rooms",
  });

  const { selectProps: roomTypeSelectProps } = useSelect({
    resource: "room-types",
    optionLabel: "name",
    optionValue: "id",
  });

  const { data, isLoading } = queryResult || {};

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

  if (isLoading) return <Spin tip="Đang tải..." />;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Card
        title={`Chỉnh sửa phòng: ${data?.data?.room_number}`}
        style={{ maxWidth: 600, margin: "auto" }}
      >
        <Form {...formProps} layout="vertical" initialValues={data?.data}>
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
            <Input />
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
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Card>
    </Edit>
  );
};
