import React, { useEffect, useState } from "react";
import { Edit } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Spin,
  Alert,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import {
  UpdateRoomRequest,
  RoomType,
  Amenity,
} from "../../../../interfaces/rooms";

export const RoomEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<any>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [errorAmenities, setErrorAmenities] = useState(false);
  const [form] = Form.useForm();

  // 🟩 Lấy dữ liệu phòng từ API
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/rooms/${id}`);
        const data = res.data?.data;
        setRoomData(data);
        form.setFieldsValue({
          room_number: data.room_number,
          room_type_id: data.room_type_id,
          price: Number(data.price),
          status: data.status,
          description: data.description,
          amenities: data.amenities?.map((a: any) => a.amenity_id),
        });
      } catch (err) {
        message.error("Không thể tải dữ liệu phòng");
        console.error("❌ Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id, form]);

  // 🟦 Lấy loại phòng
  useEffect(() => {
    axiosInstance
      .get("/room-types")
      .then((res) => setRoomTypes(res.data?.data || []))
      .catch(() => message.error("Không thể tải loại phòng"));
  }, []);

  // 🟨 Lấy tiện nghi
  useEffect(() => {
    setLoadingAmenities(true);
    axiosInstance
      .get("/amenities")
      .then((res) => {
        setAmenities(res.data?.data || []);
        setErrorAmenities(false);
      })
      .catch(() => {
        setErrorAmenities(true);
        message.error("Không thể tải danh sách tiện nghi");
      })
      .finally(() => setLoadingAmenities(false));
  }, []);

  // 🧩 Submit form
  const handleFormSubmit = async (values: any) => {
    if (!id) {
      message.error("Thiếu ID phòng để cập nhật!");
      return;
    }

    const payload: UpdateRoomRequest = {
      room_number: values.room_number,
      room_type_id: Number(values.room_type_id),
      price: Number(values.price),
      status: values.status,
      description: values.description || "",
      amenities: values.amenities || [],
    };

    console.log("🟢 Payload gửi lên:", payload);

    try {
      const response = await axiosInstance.put(`/rooms/${id}`, payload);
      if (response.data?.success) {
        message.success("Cập nhật phòng thành công!");
        navigate("/admin/rooms");
      } else {
        message.error(response.data?.message || "Cập nhật thất bại!");
      }
    } catch (error: any) {
      console.error("❌ Submit error:", error.response?.data || error);

      // 🟨 Ghi log chi tiết Validation error từ Laravel
      if (error.response?.data?.errors) {
        console.warn("⚠️ Chi tiết lỗi validation từ backend:");
        console.table(error.response.data.errors);
      }

      message.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  if (loading) return <Spin tip="Đang tải dữ liệu phòng..." />;
  if (!roomData)
    return (
      <Alert
        message="Không tìm thấy dữ liệu phòng"
        type="error"
        showIcon
        style={{ marginTop: 20 }}
      />
    );

  return (
    <Edit
      title={`Chỉnh sửa phòng #${roomData.room_number}`}
      saveButtonProps={{ onClick: () => form.submit() }}
    >
      <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
        <Form.Item
          label="Số phòng"
          name="room_number"
          rules={[{ required: true, message: "Vui lòng nhập số phòng" }]}
        >
          <Input placeholder="VD: 101" />
        </Form.Item>

        <Form.Item
          label="Loại phòng"
          name="room_type_id"
          rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
        >
          <Select placeholder="Chọn loại phòng">
            {roomTypes.map((type) => (
              <Select.Option key={type.id} value={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá phòng (VNĐ)"
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

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả (nếu có)" rows={3} />
        </Form.Item>

        <Form.Item label="Tiện nghi" name="amenities">
          {loadingAmenities ? (
            <Spin />
          ) : errorAmenities ? (
            <Alert
              message="Lỗi tải danh sách tiện nghi"
              type="error"
              showIcon
            />
          ) : (
            <Checkbox.Group
              options={amenities.map((a) => ({
                label: a.name,
                value: a.amenity_id,
              }))}
            />
          )}
        </Form.Item>
      </Form>
    </Edit>
  );
};
