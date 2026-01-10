import React, { useEffect, useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Space,
  Checkbox,
  Spin,
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const RoomTypeCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState<RcFile | null>(null);
  const [subImages, setSubImages] = useState<RcFile[]>([]);
  const [subFileList, setSubFileList] = useState<UploadFile[]>([]);

  // ✅ Amenities
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= IMAGE HANDLERS ================= */
  const beforeUploadMain = (file: RcFile) => {
    setMainImage(file);
    return false;
  };

  const beforeUploadSub = (file: RcFile) => {
    setSubImages((prev) => [...prev, file]);
    setSubFileList((prev) => [
      ...prev,
      { uid: file.uid, name: file.name, status: "done" },
    ]);
    return false;
  };

  const handleRemoveSubImage = (file: UploadFile) => {
    setSubImages((prev) => prev.filter((f) => f.uid !== file.uid));
    setSubFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  /* ================= FETCH AMENITIES ================= */
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoadingAmenities(true);
        const res = await axios.get("http://localhost:8000/api/amenities", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setAmenities(res.data.data);
      } catch {
        message.error("Không tải được danh sách tiện ích");
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, []);

  /* ================= SUBMIT ================= */
  const onFinish = async (values: any) => {
    try {
      const formDataRoomType = new FormData();

      formDataRoomType.append("room_type_name", values.room_type_name);
      formDataRoomType.append("base_price", values.base_price);
      formDataRoomType.append("max_guests", values.max_guests);
      formDataRoomType.append("description", values.description || "");

      if (mainImage) {
        formDataRoomType.append("room_type_image", mainImage);
      }

      // ✅ amenities
      if (values.amenity_ids?.length) {
        values.amenity_ids.forEach((id: number) => {
          formDataRoomType.append("amenity_ids[]", id);
        });
      }

      const roomRes = await axios.post(
        "http://localhost:8000/api/room-types",
        formDataRoomType,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              }
            : { "Content-Type": "multipart/form-data" },
        }
      );

      const roomTypeId = roomRes.data.data.room_type_id;

      // ✅ upload ảnh phụ
      if (subImages.length > 0) {
        const subFormData = new FormData();
        subImages.forEach((file) => subFormData.append("images[]", file));
        subFormData.append("image_type", "secondary");

        await axios.post(
          `http://localhost:8000/api/room-types/${roomTypeId}/images`,
          subFormData,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                }
              : { "Content-Type": "multipart/form-data" },
          }
        );
      }

      message.success("Thêm loại phòng thành công!");
      navigate("/admin/room-types");
    } catch (error: any) {
      console.error(error);
      message.error("Thêm loại phòng thất bại!");
    }
  };

  return (
    <Create
      title="Thêm loại phòng mới"
      saveButtonProps={{ ...saveButtonProps, children: "Thêm dịch vụ" }}
      // Đây chính là chìa khóa: override nút quay lại mặc định
      goBack={
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/room-types")}
          style={{ fontSize: 16 }}
        />
      }
    >
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên loại phòng"
          name="room_type_name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại phòng" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá cơ bản (VNĐ/đêm)"
          name="base_price"
          rules={[
            { required: true, message: "Vui lòng nhập giá cơ bản!" },
            {
              type: "number",
              min: 100000,
              message: "Giá tối thiểu hợp lý là 100.000 VNĐ",
            }, // Ví dụ min 100k
            {
              type: "number",
              max: 15000000,
              message: "Giá tối đa hợp lý là 15.000.000 VNĐ",
            }, // Ví dụ max 15tr
            {
              type: "integer",
              message: "Giá phải là số nguyên (không thập phân)",
            },
          ]}
          tooltip="Giá phòng cơ bản cho 1 đêm (chưa bao gồm thuế/phí dịch vụ). Nên nhập theo mức giá phổ biến của khách sạn."
        >
          <InputNumber
            style={{ width: "100%" }}
            min={100000}
            max={15000000}
            placeholder="Ví dụ: 1500000"
          />
        </Form.Item>

        <Form.Item
          label="Số khách tối đa (người lớn + trẻ em)"
          name="max_guests"
          rules={[
            { required: true, message: "Vui lòng nhập số khách tối đa!" },
            { type: "number", min: 1, message: "Số khách tối thiểu là 1" },
            { type: "integer", message: "Số khách phải là số nguyên" },
            {
              type: "number",
              max: 5,
              message: "Số khách tối đa hợp lý là 5 (cho loại phòng lớn)",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={5}
            step={1}
            placeholder="Ví dụ: 2, 4, 6..."
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description" rules={[{ min: 10 }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* ✅ AMENITIES */}
        <Form.Item label="Tiện ích" name="amenity_ids">
          {loadingAmenities ? (
            <Spin />
          ) : (
            <Checkbox.Group>
              <Space direction="vertical">
                {amenities.map((item) => (
                  <Checkbox key={item.amenity_id} value={item.amenity_id}>
                    {item.amenity_name}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          )}
        </Form.Item>

        <Form.Item label="Ảnh đại diện" required>
          <Upload beforeUpload={beforeUploadMain} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Ảnh phụ">
          <Upload
            multiple
            beforeUpload={beforeUploadSub}
            fileList={subFileList}
            onRemove={handleRemoveSubImage}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh phụ</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Create>
  );
};
