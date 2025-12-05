import React, { useEffect, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  DatePicker,
  Spin,
  Alert,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import dayjs from "dayjs";

import { IEvent } from "../../../../interfaces/event";

const { TextArea } = Input;

const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const EventEdit: React.FC = () => {
  const { formProps, saveButtonProps, form } = useForm<IEvent>({
    enabled: false,
  });
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State quản lý dữ liệu tải về
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<IEvent | null>(null);

  // State quản lý file ảnh bìa
  const [mainImage, setMainImage] = useState<RcFile | null>(null); // File mới chọn
  const [mainFileList, setMainFileList] = useState<UploadFile[]>([]); // Danh sách file cho component Upload
  const [existingMainImage, setExistingMainImage] = useState<any>(null); // Đường dẫn ảnh cũ từ server

  const token = localStorage.getItem("token");

  /** Load thông tin Sự kiện và Ảnh bìa */
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/events/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const event = res.data.data;
        setEventData(event);

        // set dữ liệu vào form
        form.setFieldsValue({
          name: event.name,
          location: event.location,
          description: event.description,

          date: event.date ? dayjs(event.date) : null,
        });

        // Ảnh bìa cũ
        if (event.image) {
          setExistingMainImage({ image_url: event.image });
          setMainFileList([
            {
              uid: "server-main",
              name: event.image.split("/").pop() || "Ảnh bìa",
              status: "done",
              url: `http://localhost:8000/storage/${event.image}`,
            },
          ]);
        }
      } catch (error) {
        console.error(error);
        message.error("Không thể tải thông tin sự kiện.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, form, token]);

  /** Chọn ảnh bìa */
  const beforeUploadMain = (file: RcFile) => {
    setMainImage(file);
    // Cập nhật fileList để hiển thị ngay file mới chọn
    setMainFileList([
      { ...file, uid: file.uid, status: "done", name: file.name },
    ]);
    return false; // Chặn Ant Design tự upload
  };

  /** Xóa ảnh bìa */
  const handleRemoveMainImage = async (file: UploadFile) => {
    // Nếu là file cũ từ server
    if (existingMainImage) {
      try {
        // Gọi API để xóa ảnh bìa trên server
        await axios.delete(
          `http://localhost:8000/api/events/${id}/image`, // Giả định API endpoint để xóa ảnh
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        setExistingMainImage(null);
        message.success("Xóa ảnh bìa thành công");
      } catch (error) {
        console.error(error);
        message.error("Xóa ảnh bìa thất bại");
      }
    }

    setMainImage(null);
    setMainFileList([]);
    return false; // chặn Ant Design tự remove
  };

  /** Submit form */
  const onFinish = async (values: any) => {
    if (!id) {
      message.error("Không tìm thấy ID sự kiện để cập nhật.");
      return;
    }

    try {
      // 1. Kiểm tra validation cơ bản
      if (
        !values.name ||
        !values.location ||
        !values.description ||
        !values.date
      ) {
        message.error("Vui lòng điền đầy đủ tất cả các trường bắt buộc");
        return;
      }

      // 2. Chuẩn bị FormData cho dữ liệu văn bản và ảnh bìa
      const formDataEvent = new FormData();
      formDataEvent.append("name", values.name);
      formDataEvent.append("location", values.location);
      formDataEvent.append("description", values.description);
      // Chuyển đổi dayjs object sang chuỗi định dạng
      formDataEvent.append("date", dayjs(values.date).format(DATETIME_FORMAT));

      // Gắn file ảnh mới (nếu có)
      if (mainImage) {
        formDataEvent.append("image", mainImage);
      } else if (!existingMainImage) {
        // Nếu không có ảnh mới và không có ảnh cũ, gửi null để xóa trên server
        // Dùng giá trị 'null' hoặc 'empty' tùy theo backend của bạn
        // formDataEvent.append("image", 'null');
      }

      formDataEvent.append("_method", "PUT");

      // 3. Gọi API để cập nhật sự kiện
      await axios.post(
        `http://localhost:8000/api/events/${id}`,
        formDataEvent,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              }
            : { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Cập nhật sự kiện thành công!");
      navigate("/admin/events");
    } catch (error: any) {
      console.error(error);
      // Xử lý lỗi từ response của server
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
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

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" tip="Đang tải dữ liệu sự kiện..." />
      </div>
    );

  if (!eventData)
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description="Không tìm thấy thông tin sự kiện hoặc ID không hợp lệ."
        type="error"
        showIcon
        action={
          <Link to="/admin/events">
            <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
          </Link>
        }
      />
    );

  return (
    <Edit
      title={`Chỉnh sửa Sự kiện: ${eventData.name}`}
      saveButtonProps={saveButtonProps}
    >
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên Sự kiện"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}
        >
          <Input placeholder="Nhập tên sự kiện..." />
        </Form.Item>

        <Form.Item
          label="Địa điểm"
          name="location"
          rules={[
            { required: true, message: "Vui lòng nhập địa điểm diễn ra" },
          ]}
        >
          <Input placeholder="Nhập địa điểm..." />
        </Form.Item>

        <Form.Item
          label="Ngày diễn ra"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn ngày diễn ra" }]}
        >
          <DatePicker
            showTime
            format={DATETIME_FORMAT}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả" },
            { min: 10, message: "Mô tả phải ít nhất 10 ký tự" },
          ]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết sự kiện..." />
        </Form.Item>

        {/* TRƯỜNG ẢNH BÌA */}
        <Form.Item label="Ảnh Bìa Sự kiện">
          <Upload
            beforeUpload={beforeUploadMain}
            maxCount={1}
            fileList={mainFileList}
            onRemove={handleRemoveMainImage}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>
              {existingMainImage ? "Thay đổi Ảnh Bìa" : "Chọn Ảnh Bìa"}
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Edit>
  );
};
