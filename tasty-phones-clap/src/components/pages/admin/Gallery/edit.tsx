import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Upload,
  Button,
  Typography,
  message,
  Spin,
  Space,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import axios, { AxiosError } from "axios";
import { RcFile, UploadFile } from "antd/es/upload/interface";

const { Title, Text } = Typography;
const BASE_URL = "http://localhost:8000/storage/";

export default function GalleryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/galleries/${id}`);
        const gallery = res.data?.data || res.data;

        form.setFieldsValue({
          gallery_category: gallery.gallery_category || "",
          caption: gallery.caption || "",
        });

        if (gallery.image_path) {
          setFileList([
            {
              uid: "-1",
              name: gallery.image_path.split("/").pop() || "image.jpg",
              status: "done",
              url: `${BASE_URL}${gallery.image_path}`,
            },
          ]);
        }
      } catch (err: any) {
        message.error("Không thể tải dữ liệu gallery! Vui lòng kiểm tra API.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGallery();
    }
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("gallery_category", values.gallery_category || "");
    formData.append("caption", values.caption || "");

    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj as RcFile);
    }

    formData.append("_method", "PUT");

    try {
      setSubmitting(true);

      await axiosInstance.post(`/galleries/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Cập nhật ảnh thành công!");
      navigate("/admin/galleries");
    } catch (err: any) {
      let msg = "Cập nhật thất bại! Vui lòng kiểm tra log.";

      // Xử lý lỗi Axios an toàn hơn
      if (axios.isAxiosError(err) && err.response) {
        const axiosError = err as AxiosError;
        const errorData: any = axiosError.response.data;

        if (errorData?.errors) {
          // Xử lý lỗi Validation
          const errs = Object.values(errorData.errors).flat();
          msg = (errs[0] as string) || "Lỗi validation không xác định.";
          message.error(msg);
        } else {
          // Xử lý lỗi chung từ Server
          msg = errorData?.message || "Cập nhật thất bại! (Lỗi Server)";
          message.error(msg);
        }
      } else {
        // Xử lý lỗi Network/CORS
        msg = "Lỗi Mạng/CORS. Vui lòng kiểm tra Backend!";
        message.error(msg);
      }

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <div>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/galleries")} // Đã sửa navigation
              type="text"
            />

            <div>
              <Title level={3} className="m-0">
                Sửa Ảnh Gallery
              </Title>
              <Text type="secondary">ID: #{id}</Text>
            </div>
          </Space>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {error && (
              <Alert
                message="Lỗi"
                description={error}
                type="error"
                showIcon
                className="mb-6"
              />
            )}

            <Form.Item label="Nhóm ảnh" name="gallery_category">
              <Input placeholder="VD: Sản phẩm mới, Event..." size="large" />
            </Form.Item>

            <Form.Item label="Caption" name="caption">
              <Input.TextArea rows={4} placeholder="Nhập chú thích..." />
            </Form.Item>

            <Form.Item label="Ảnh">
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList: newList }) =>
                  setFileList(newList.slice(-1))
                }
                beforeUpload={() => false}
                accept="image/*"
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Chọn ảnh mới</div>
                  </div>
                )}
              </Upload>

              <Text type="secondary">
                {!fileList[0] && "Hiện tại gallery chưa có ảnh"}
                {fileList[0] &&
                  fileList[0].url &&
                  "Ảnh hiện tại hiển thị ở trên. Bạn có thể thay bằng ảnh khác."}
              </Text>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={() => navigate("/admin/galleries")}>
                  Hủy
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}
