import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
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
import { RcFile, UploadFile } from "antd/es/upload/interface";

const { Title, Text } = Typography;

export default function ServicesEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/services/${id}`);

        // API trả về dạng object
        const service = res.data?.data || res.data;

        form.setFieldsValue({
          service_name: service.service_name || "",
          service_price: Number(service.service_price) || 0,
          description: service.description || "",
        });

        // load ảnh
        if (service.service_image) {
          setFileList([
            {
              uid: "-1",
              name: service.service_image.split("/").pop(),
              status: "done",
              url:
                service.image_url ||
                `${import.meta.env.VITE_API_URL}/storage/${
                  service.service_image
                }`,
            },
          ]);
        }
      } catch (err: any) {
        message.error("Không thể tải dữ liệu dịch vụ!");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    formData.append("service_name", values.service_name);
    formData.append("service_price", values.service_price);
    formData.append("description", values.description || "");

    // Nếu có ảnh mới
    // submit
    if (fileList[0]?.originFileObj) {
      formData.append("service_image", fileList[0].originFileObj as RcFile);
    }

    formData.append("_method", "PUT");

    try {
      setSubmitting(true);

      await axiosInstance.post(`/services/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Cập nhật dịch vụ thành công!");
      navigate("/admin/services");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại!";
      setError(msg);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <div className="mb-6">
          <Space align="center">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/services")}
              type="text"
            />
            <div>
              <Title level={3} className="m-0">
                Sửa Dịch Vụ
              </Title>
              <Text type="secondary">Mã: #{id}</Text>
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

            <Form.Item
              label="Tên dịch vụ"
              name="service_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên dịch vụ!" },
              ]}
            >
              <Input size="large" placeholder="VD: Massage thư giãn" />
            </Form.Item>

            <Form.Item
              label="Giá (VNĐ)"
              name="service_price"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber
                size="large"
                min={0}
                style={{ width: "100%" }}
                formatter={(val) => val?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(val) => val.replace(/,/g, "")}
              />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={5} placeholder="Nhập mô tả..." />
            </Form.Item>

            <Form.Item label="Ảnh dịch vụ">
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList: newList }) =>
                  setFileList(newList.slice(-1))
                }
                beforeUpload={() => false} // tránh tự động upload
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
                {!fileList[0] && "Hiện tại dịch vụ chưa có ảnh"}
                {fileList[0] &&
                  fileList[0].url &&
                  "Ảnh hiện tại hiển thị ở trên. Bạn có thể thay bằng ảnh khác."}
              </Text>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button onClick={() => navigate("/admin/services")}>Hủy</Button>
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
