import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
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
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";

const { Title, Text } = Typography;

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null; // THÊM price
  created_at: string;
  updated_at: string;
}

export default function ServicesEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(`/services/${id}`);
        const data = res.data.data || res.data;

        form.setFieldsValue({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "", // ĐẶT GIÁ TRỊ price
        });
      } catch (err: any) {
        const msg =
          err.response?.data?.message || "Không thể tải thông tin dịch vụ";
        setError(msg);
        message.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, form]);

  const handleSubmit = async (values: {
    name: string;
    description?: string;
    price: string;
  }) => {
    if (!id) return;

    try {
      setSubmitting(true);
      setError(null);

      // Gửi price dưới dạng số (nếu cần)
      const payload = {
        ...values,
        price: values.price ? parseFloat(values.price) : null,
      };

      await axiosInstance.patch(`/services/${id}`, payload);

      message.success("Cập nhật dịch vụ thành công!");
      navigate("/admin/services");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMsg = Object.values(errors).flat().join(", ");
        setError(errorMsg);
        message.error(errorMsg);
      } else {
        const msg = err.response?.data?.message || "Cập nhật thất bại";
        setError(msg);
        message.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/services");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <div className="mb-6">
          <Space align="center" className="w-full">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
            />
            <div>
              <Title level={3} className="m-0">
                Sửa Dịch vụ
              </Title>
              <Text type="secondary">Cập nhật thông tin dịch vụ ID: #{id}</Text>
            </div>
          </Space>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
            />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={submitting}
          >
            {error && (
              <Alert
                message="Lỗi"
                description={error}
                type="error"
                showIcon
                className="mb-4"
              />
            )}

            <Form.Item
              name="name"
              label="Tên dịch vụ"
              rules={[
                { required: true, message: "Vui lòng nhập tên dịch vụ!" },
                { max: 255, message: "Tên không được quá 255 ký tự" },
              ]}
            >
              <Input
                placeholder="Ví dụ: Dịch vụ đưa đón sân bay"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                { max: 1000, message: "Mô tả không được quá 1000 ký tự" },
              ]}
            >
              <Input.TextArea
                rows={5}
                placeholder="Mô tả chi tiết về dịch vụ..."
                size="large"
              />
            </Form.Item>

            {/* THÊM TRƯỜNG GIÁ */}
            <Form.Item
              name="price"
              label="Giá (VND)"
              rules={[
                { required: true, message: "Vui lòng nhập giá dịch vụ!" },
                {
                  pattern: /^\d+(\.\d{1,2})?$/,
                  message: "Giá phải là số hợp lệ (VD: 150000 hoặc 99.99)",
                },
              ]}
            >
              <Input
                placeholder="Ví dụ: 250000"
                size="large"
                addonAfter="VND"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button onClick={handleBack} disabled={submitting}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={submitting ? <LoadingOutlined /> : <SaveOutlined />}
                  loading={submitting}
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
