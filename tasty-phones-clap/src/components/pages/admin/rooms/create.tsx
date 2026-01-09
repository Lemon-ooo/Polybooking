import React, { useEffect, useState } from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const RoomCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState<
    { room_type_id: number; room_type_name: string }[]
  >([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/room-types");
        setRoomTypes(res.data.data);
      } catch (error) {
        console.error(error);
        message.error("Lấy danh sách loại phòng thất bại!");
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        room_number: String(values.room_number),
      };

      await axios.post("http://localhost:8000/api/rooms", payload);
      message.success("Thêm phòng thành công!");
      navigate("/admin/rooms");
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err: any) =>
          message.error(err as string)
        );
      } else {
        message.error("Thêm phòng thất bại!");
      }
    }
  };

  return (
     <Create
      title="Thêm phòng mới"
      saveButtonProps={{ ...saveButtonProps, children: "Thêm dịch vụ" }}
      // Đây chính là chìa khóa: override nút quay lại mặc định
      goBack={
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/rooms")}
          style={{ fontSize: 16 }}
        />
      }
    >
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Số phòng"
          name="room_number"
          rules={[{ required: true, message: "Vui lòng nhập số phòng..." }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            placeholder="Nhập số phòng..."
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onPaste={(event) => {
              const pasteData = event.clipboardData.getData("text");
              if (!/^\d+$/.test(pasteData)) {
                event.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Loại phòng"
          name="room_type_id"
          rules={[{ required: true, message: "Vui lòng chọn loại phòng..." }]}
        >
          <Select
            placeholder={
              loadingRoomTypes ? "Đang tải..." : "Chọn loại phòng..."
            }
            loading={loadingRoomTypes}
            options={roomTypes.map((type) => ({
              label: type.room_type_name,
              value: type.room_type_id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái phòng"
          name="room_status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái..." }]}
        >
          <Select placeholder="Chọn trạng thái phòng...">
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="occupied">Occupied</Select.Option>
            <Select.Option value="maintenance">Maintenance</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả..." }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả phòng..." />
        </Form.Item>
      </Form>
    </Create>
  );
};
