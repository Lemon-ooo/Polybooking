import React, { useEffect, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, message } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const RoomEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [roomTypes, setRoomTypes] = useState<
    { room_type_id: number; room_type_name: string }[]
  >([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [loadingRoom, setLoadingRoom] = useState(true);

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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/rooms/${id}`);
        const roomData = res.data.data;

        formProps.form.setFieldsValue({
          room_number: roomData.room_number,
          room_type_id: roomData.room_type_id,
          room_status: roomData.room_status,
          description: roomData.description,
        });
      } catch (error) {
        console.error(error);
        message.error("Lấy dữ liệu phòng thất bại!");
      } finally {
        setLoadingRoom(false);
      }
    };
    if (id) fetchRoom();
  }, [id, formProps.form]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        room_number: String(values.room_number),
      };
      await axios.put(`http://localhost:8000/api/rooms/${id}`, payload);
      message.success("Cập nhật phòng thành công!");
      navigate("/admin/rooms");
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err: any) =>
          message.error(err as string)
        );
      } else {
        message.error("Cập nhật phòng thất bại!");
      }
    }
  };

  if (loadingRoom || loadingRoomTypes) return <p>Đang tải dữ liệu...</p>;

  return (
    <Edit title="Chỉnh sửa phòng" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={onFinish}
        form={formProps.form}
      >
        <Form.Item
          label="Số phòng"
          name="room_number"
          rules={[{ required: true, message: "Vui lòng nhập số phòng..." }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
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
    </Edit>
  );
};
