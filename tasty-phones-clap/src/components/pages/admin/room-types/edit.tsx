import React, { useEffect, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, Button, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const RoomTypeEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [mainImage, setMainImage] = useState<RcFile | null>(null);
  const [mainFileList, setMainFileList] = useState<UploadFile[]>([]);
  const [existingMainImage, setExistingMainImage] = useState<any>(null);

  const [subImages, setSubImages] = useState<RcFile[]>([]);
  const [subFileList, setSubFileList] = useState<UploadFile[]>([]);
  const [existingSubImages, setExistingSubImages] = useState<any[]>([]);
  const [roomTypeImagesFromServer, setRoomTypeImagesFromServer] = useState<any[]>([]);

  const token = localStorage.getItem("token");

  /** Load thông tin phòng và ảnh phụ */
  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/room-types/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const roomType = res.data.data;

        // set dữ liệu vào form
        formProps.form?.setFieldsValue({
          room_type_name: roomType.room_type_name,
          base_price: roomType.base_price,
          max_guests: roomType.max_guests,
          description: roomType.description,
        });

        // Ảnh đại diện cũ
        if (roomType.room_type_image) {
          setExistingMainImage({
            image_url: roomType.room_type_image,
          });
          setMainFileList([
            {
              uid: "server-main",
              name: roomType.room_type_image.split("/").pop() || "Ảnh đại diện",
              status: "done",
              url: `http://localhost:8000/storage/${roomType.room_type_image}`,
            },
          ]);
        }

        // Ảnh phụ cũ
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
        message.error("Không thể tải thông tin loại phòng.");
      }
    };

    fetchRoomType();
  }, [id]);

  /** Chọn ảnh đại diện */
  const beforeUploadMain = (file: RcFile) => {
    setMainImage(file);
    setMainFileList([{ ...file, uid: file.uid, status: "done", name: file.name }]);
    return false;
  };

  /** Chọn ảnh phụ mới */
  const beforeUploadSub = (file: RcFile) => {
    setSubImages((prev) => [...prev, file]);
    setSubFileList((prev) => [...prev, { uid: file.uid, name: file.name, status: "done" }]);
    return false;
  };

  /** Xóa ảnh đại diện */
  const handleRemoveMainImage = async (file: UploadFile) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/room-types/${id}/main-image`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setExistingMainImage(null);
      setMainImage(null);
      setMainFileList([]);
      message.success("Xóa ảnh đại diện thành công");
    } catch (error) {
      console.error(error);
      message.error("Xóa ảnh đại diện thất bại");
    }
    return false; // chặn Ant Design tự remove, mình tự quản lý fileList
  };

  /** Xóa ảnh phụ */
  const handleRemoveSubImage = (file: UploadFile) => {
    if (subImages.find((f) => f.uid === file.uid)) {
      setSubImages((prev) => prev.filter((f) => f.uid !== file.uid));
    } else {
      setExistingSubImages((prev) => prev.filter((img) => `server-${img.image_id}` !== file.uid));
    }
    setSubFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  /** Submit form */
  const onFinish = async (values: any) => {
    try {
      if (!values.room_type_name || !values.base_price || !values.max_guests || !values.description) {
        message.error("Vui lòng điền đầy đủ tất cả các trường bắt buộc");
        return;
      }
      if (values.description.length < 10) {
        message.error("Mô tả phải ít nhất 10 ký tự");
        return;
      }

      const formDataRoomType = new FormData();
      formDataRoomType.append("room_type_name", values.room_type_name);
      formDataRoomType.append("base_price", values.base_price.toString());
      formDataRoomType.append("max_guests", values.max_guests.toString());
      formDataRoomType.append("description", values.description);

      if (mainImage) {
        formDataRoomType.append("room_type_image", mainImage);
        formDataRoomType.append("image_type", "main");
      }

      formDataRoomType.append("_method", "PUT");
      await axios.post(`http://localhost:8000/api/room-types/${id}`, formDataRoomType, {
        headers: token
          ? { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
          : { "Content-Type": "multipart/form-data" },
      });

      // Upload ảnh phụ mới
      if (subImages.length > 0) {
        const subFormData = new FormData();
        subImages.forEach((file) => subFormData.append("images[]", file));
        subFormData.append("image_type", "secondary");

        await axios.post(`http://localhost:8000/api/room-types/${id}/images`, subFormData, {
          headers: token
            ? { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            : { "Content-Type": "multipart/form-data" },
        });
      }

      // Xóa ảnh phụ đã bị xóa
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
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join(", ");
        message.error(`Cập nhật thất bại: ${messages}`);
      } else {
        message.error(
          error.response
            ? `Cập nhật thất bại: ${error.response.status} - ${error.response.statusText}`
            : "Cập nhật thất bại! Kiểm tra kết nối server."
        );
      }
    }
  };

  return (
    <Edit title="Chỉnh sửa loại phòng" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên loại phòng"
          name="room_type_name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại phòng" }]}
        >
          <Input placeholder="Nhập tên loại phòng..." />
        </Form.Item>

        <Form.Item
          label="Giá cơ bản"
          name="base_price"
          rules={[{ required: true, message: "Vui lòng nhập giá cơ bản" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập giá cơ bản"
            formatter={(value) =>
              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫" : ""
            }
            parser={(value) => value?.replace(/\₫|\s|,/g, "") || ""}
          />
        </Form.Item>

        <Form.Item
          label="Số khách tối đa"
          name="max_guests"
          rules={[{ required: true, message: "Vui lòng nhập số khách tối đa" }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} placeholder="Nhập số khách tối đa..." />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả" },
            { min: 10, message: "Mô tả phải ít nhất 10 ký tự" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả loại phòng..." />
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Upload
            beforeUpload={beforeUploadMain}
            maxCount={1}
            fileList={mainFileList}
            onRemove={handleRemoveMainImage}
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
          {subFileList.length > 0 && (
            <Space direction="vertical">
              {subFileList.map((img) => (
                <span key={img.uid}></span>
              ))}
            </Space>
          )}
        </Form.Item>
      </Form>
    </Edit>
  );
};
