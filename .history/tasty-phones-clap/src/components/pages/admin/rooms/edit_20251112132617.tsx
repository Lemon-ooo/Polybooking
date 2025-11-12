import React, { useEffect } from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Checkbox, Spin, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  UpdateRoomRequest,
  RoomType,
  Amenity,
} from "../../../../interfaces/rooms";

export const RoomEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { form, onFinish, formProps, saveButtonProps, queryResult } =
    useForm<UpdateRoomRequest>({
      resource: "rooms",
      id: id,
      redirect: false, // Tắt redirect mặc định của Refine
    });

  // Room type dropdown
  const { selectProps: roomTypeSelectProps } = useSelect<RoomType>({
    resource: "room-types",
    optionLabel: "name",
    optionValue: "id",
  });

  // Amenities checkbox
  const { selectProps: amenitiesSelectProps, queryResult: amenitiesQuery } =
    useSelect<Amenity>({
      resource: "amenities",
      optionLabel: "name",
      optionValue: "amenity_id",
    });

  const amenitiesOptions =
    amenitiesSelectProps?.options?.map((opt) => ({
      label: opt.label,
      value: opt.value,
    })) || [];

  const isLoadingAmenities = amenitiesQuery?.isLoading || false;
  const isErrorAmenities = amenitiesQuery?.isError || false;

  // Load dữ liệu cũ vào checkbox
  useEffect(() => {
    if (queryResult?.data?.data) {
      const roomData = queryResult.data.data;
      console.log("Loaded room data:", roomData);

      form.setFieldsValue({
        room_number: roomData.room_number,
        room_type_id: roomData.room_type_id,
        price: roomData.price,
        status: roomData.status,
        description: roomData.description,
        amenities: roomData.amenities?.map((a: any) => Number(a.amenity_id)),
      });
    }
  }, [queryResult?.data, form]);

  const handleFormSubmit = async (values: any) => {
    const formattedValues: UpdateRoomRequest = {
      room_number: values.room_number,
      room_type_id: values.room_type_id,
      price: Number(values.price),
      status: values.status,
      description: values.description || "",
      amenities: (values.amenities || []).map((id: number) => ({
        amenity_id: id,
      })),
    };

    try {
      await onFinish(formattedValues);
      navigate("/admin/rooms"); // redirect về list admin
    } catch (error: any) {
      console.error("Submit error:", error.response?.data || error);
    }
  };

  return (
    <Edit title="Chỉnh sửa phòng" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        form={form}
        onFinish={handleFormSubmit}
      >
        {/* Room number */}
        <Form.Item
          label="Số phòng"
          name="room_number"
          rules={[{ required: true, message: "Vui lòng nhập số phòng" }]}
        >
          <Input placeholder="VD: 101" />
        </Form.Item>

        {/* Room type */}
        <Form.Item
          label="Loại phòng"
          name="room_type_id"
          rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
        >
          <Select {...roomTypeSelectProps} placeholder="Chọn loại phòng" />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Giá phòng"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber
            min={0}
            className="w-full"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/,/g, "") || ""}
            placeholder="Nhập giá (VNĐ)"
          />
        </Form.Item>

        {/* Status */}
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            options={[
              { label: "Trống", value: "available" },
              { label: "Đang sử dụng", value: "occupied" },
              { label: "Bảo trì", value: "maintenance" },
            ]}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả (nếu có)" rows={3} />
        </Form.Item>

        {/* Amenities */}
        <Form.Item label="Tiện nghi" name="amenities">
          {isLoadingAmenities ? (
            <Spin />
          ) : isErrorAmenities ? (
            <Alert
              message="Lỗi tải danh sách tiện nghi"
              type="error"
              showIcon
            />
          ) : (
            <Checkbox.Group options={amenitiesOptions} />
          )}
        </Form.Item>
      </Form>
    </Edit>
  );
};
