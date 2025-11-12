import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Checkbox,
  Spin,
  Skeleton,
  Alert,
} from "antd";
import { useForm, useList } from "@refinedev/core";

interface Amenity {
  amenity_id: number;
  name: string;
}

interface Room {
  room_id: number;
  room_number: string;
  description?: string;
  price: number;
  amenities?: number[];
}

export const RoomEdit: React.FC = () => {
  // useForm từ Refine
  const {
    formProps,
    saveButtonProps,
    queryResult,
    isLoading: isFormLoading,
  } = useForm<Room>();

  // load amenities list
  const {
    data: amenitiesData,
    isLoading: isLoadingAmenities,
    isError: isErrorAmenities,
  } = useList<Amenity>({
    resource: "amenities",
  });

  // map thành options cho Checkbox.Group
  const amenitiesOptions =
    amenitiesData?.data.map((item: any) => ({
      label: item.name,
      value: item.amenity_id,
    })) || [];

  if (isFormLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Room Number"
        name="room_number"
        rules={[{ required: true, message: "Vui lòng nhập số phòng" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Vui lòng nhập giá" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          formatter={(value) =>
            value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
          }
        />
      </Form.Item>

      <Form.Item label="Amenities" name="amenities">
        {isLoadingAmenities ? (
          <Spin />
        ) : isErrorAmenities ? (
          <Alert message="Lỗi tải danh sách tiện nghi" type="error" showIcon />
        ) : (
          <Checkbox.Group options={amenitiesOptions} />
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" {...saveButtonProps}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};
