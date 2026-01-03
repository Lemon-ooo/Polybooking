import React, { useEffect, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
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
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const RoomTypeEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const token = localStorage.getItem("token");

  /* ================= STATE ================= */
  const [mainImage, setMainImage] = useState<RcFile | null>(null);
  const [mainFileList, setMainFileList] = useState<UploadFile[]>([]);

  const [subImages, setSubImages] = useState<RcFile[]>([]);
  const [subFileList, setSubFileList] = useState<UploadFile[]>([]);
  const [existingSubImages, setExistingSubImages] = useState<any[]>([]);
  const [roomTypeImagesFromServer, setRoomTypeImagesFromServer] = useState<
    any[]
  >([]);

  // amenities
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingAmenities(true);

        const [roomRes, amenitiesRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/room-types/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          axios.get(`http://localhost:8000/api/amenities`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        const roomType = roomRes.data.data;

        // set form values
        formProps.form?.setFieldsValue({
          room_type_name: roomType.room_type_name,
          base_price: roomType.base_price,
          max_guests: roomType.max_guests,
          description: roomType.description,
          amenity_ids: roomType.amenities?.map((a: any) => a.amenity_id),
        });

        setAmenities(amenitiesRes.data.data);

        /* ===== MAIN IMAGE ===== */
        if (roomType.room_type_image) {
          setMainFileList([
            {
              uid: "server-main",
              name: roomType.room_type_image.split("/").pop() || "Ảnh đại diện",
              status: "done",
              url: `http://localhost:8000/storage/${roomType.room_type_image}`,
            },
          ]);
        }

        /* ===== SUB IMAGES ===== */
        const subImagesFromServer = roomType.images || [];
        setExistingSubImages(subImagesFromServer);
        setRoomTypeImagesFromServer(subImagesFromServer);
        setSubFileList(
          subImagesFromServer.map((img: any) => ({
            uid: `server-${img.image_id}`,
            name: img.image_url.split("/").pop() || "Ảnh phụ",
            status: "done",
            url: `http://localhost:8000/storage/${img.image_url}`,
          }))
        );
      } catch (error) {
        console.error(error);
        message.error("Không thể tải dữ liệu loại phòng");
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= IMAGE HANDLERS ================= */
  const beforeUploadMain = (file: RcFile) => {
    setMainImage(file);
    setMainFileList([{ uid: file.uid, name: file.name, status: "done" }]);
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
    if (subImages.find((f) => f.uid === file.uid)) {
      setSubImages((prev) => prev.filter((f) => f.uid !== file.uid));
    } else {
      setExistingSubImages((prev) =>
        prev.filter((img) => `server-${img.image_id}` !== file.uid)
      );
    }
    setSubFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  /* ================= SUBMIT ================= */
  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();

      formData.append("room_type_name", values.room_type_name);
      formData.append("base_price", values.base_price.toString());
      formData.append("max_guests", values.max_guests.toString());
      formData.append("description", values.description || "");

      // ✅ amenities
      if (values.amenity_ids?.length) {
        values.amenity_ids.forEach((id: number) => {
          formData.append("amenity_ids[]", id);
        });
      }

      if (mainImage) {
        formData.append("room_type_image", mainImage);
      }

      formData.append("_method", "PUT");

      await axios.post(`http://localhost:8000/api/room-types/${id}`, formData, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            }
          : { "Content-Type": "multipart/form-data" },
      });

      // upload new sub images
      if (subImages.length > 0) {
        const subFormData = new FormData();
        subImages.forEach((file) => subFormData.append("images[]", file));
        subFormData.append("image_type", "secondary");

        await axios.post(
          `http://localhost:8000/api/room-types/${id}/images`,
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

      // delete removed sub images
      const removedImages = roomTypeImagesFromServer.filter(
        (img) => !existingSubImages.find((e) => e.image_id === img.image_id)
      );

      for (const img of removedImages) {
        await axios.delete(
          `http://localhost:8000/api/room-types/${id}/images/${img.image_id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
      }

      message.success("Cập nhật loại phòng thành công!");
      navigate("/admin/room-types");
    } catch (error) {
      console.error(error);
      message.error("Cập nhật loại phòng thất bại!");
    }
  };

  /* ================= UI ================= */
  return (
    <Edit title="Chỉnh sửa loại phòng" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên loại phòng"
          name="room_type_name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá cơ bản"
          name="base_price"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Số khách tối đa"
          name="max_guests"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
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

        <Form.Item label="Ảnh đại diện">
          <Upload
            beforeUpload={beforeUploadMain}
            maxCount={1}
            fileList={mainFileList}
          >
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
    </Edit>
  );
};
