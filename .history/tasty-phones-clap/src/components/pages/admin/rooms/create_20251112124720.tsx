import React from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Checkbox, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";

interface Amenity {
  amenity_id: number;
  name: string;
}

interface RoomType {
  id: number;
  name: string;
}

export const RoomCreate: React.FC = () => {
  const navigate = useNavigate();

  const { formProps, saveButtonProps } = useForm({
    resource: "rooms",
  });

  // 🏷️ Loại phòng (dropdown)
  const { selectProps: roomTypeSelectProps } = useSelect<RoomType>({
    resource: "room-types",
    optionLabel: "name",
    optionValue: "id",
  });

  // 🧩 Tiện nghi (lấy bằng useSelect nhưng hiển thị dạng Checkbox)
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

  // 🧠 Xử lý khi submit form
  const handleFormSubmit = async (values: any) => {
    console.log("Form values:", values);

    const formattedValues = {
      room_number: values.room_number,
      room_type_id: values.room_type_id,
      price: parseFloat(values.price).toFixed(2),
      status: values.status,
      description: values.description || "",
      amenities: (values.amenities || []).map((id: number) => ({
        amenity_id: id,
      })),
    };

    console.log("Sending data:", formattedValues);

    try {
      await onFinish(formattedValues);
      navigate("/rooms");
    } catch (error: any) {
      console.error("Submit error:", error.response?.data || error);
    }
  };

  return (
    <Create title="Thêm phòng mới" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        form={form}
        onFinish={handleFormSubmit}
      >
        {/* 🏠 Số phòng */}
        <Form.Item
          label="Số phòng"
          name="room_number"
          rules={[{ required: true, message: "Vui lòng nhập số phòng" }]}
        >
          <Input placeholder="VD: 101" />
        </Form.Item>

        {/* 🏷️ Loại phòng */}
        <Form.Item
          label="Loại phòng"
          name="room_type_id"
          rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
        >
          <Select {...roomTypeSelectProps} placeholder="Chọn loại phòng" />
        </Form.Item>

        {/* 💰 Giá phòng */}
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

        {/* 🏷️ Trạng thái */}
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            options={[
              { label: "Trống", value: "trống" },
              { label: "Đã đặt", value: "đã đặt" },
              { label: "Bảo trì", value: "bảo trì" },
            ]}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>

        {/* 📝 Mô tả */}
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả (nếu có)" rows={3} />
        </Form.Item>

        {/* 🧩 Tiện nghi */}
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
    </Create>
  );
};
