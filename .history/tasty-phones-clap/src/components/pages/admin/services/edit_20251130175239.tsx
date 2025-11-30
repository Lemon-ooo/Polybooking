// src/components/pages/admin/services/Edit.tsx
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
      if (!id) return;

      try {
        setLoading(true);
        const res = await axiosInstance.get(`/services/${id}`);
        const data = res.data.data || res.data;

        form.setFieldsValue({
          service_name: data.name,
          service_price: parseFloat(data.price.replace(/,/g, "")),
          description: data.description || "",
        });

        if (data.image_url) {
          setFileList([
            {
              uid: "-1",
              name: data.image.split("/").pop(),
              status: "done",
              url: data.image_url,
            },
          ]);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    if (!id) return;

    const formData = new FormData();
    formData.append("service_name", values.service_name.trim());
    formData.append(
      "service_price",
      parseFloat(values.service_price).toFixed(2)
    );
    if (values.description?.trim()) {
      formData.append("description", values.description.trim());
    }

    const file = fileList[0];
    if (file?.originFileObj) {
      formData.append("image", file.originFileObj as RcFile);
    }

    formData.append("_method", "PUT");

    try {
      setSubmitting(true);
      setError(null);

      await axiosInstance.post(`/services/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Cập nhật dịch vụ thành công!");
      navigate("/admin/services");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const msg = Object.values(errors).flat().join(", ");
        setError(msg);
        message.error(msg);
      } else {
        const msg = err.response?.data?.message || "Cập nhật thất bại";
        setError(msg);
        message.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <div className="mb-6">
          <Space align="center" className="w-full">
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
              <Input size="large" placeholder="VD: Buffet sáng" />
            </Form.Item>

            <Form.Item
              label="Giá (VNĐ)"
              name="service_price"
              rules={[
                { required: true, message: "Vui lòng nhập giá!" },
                { type: "number", min: 0, message: "Giá phải ≥ 0" },
              ]}
            >
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={0}
                step={1000}
                formatter={(value) =>
                  value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/,/g, "")}
              />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={5} placeholder="Mô tả dịch vụ..." />
            </Form.Item>

            <Form.Item label="Ảnh dịch vụ">
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
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button
                  onClick={() => navigate("/admin/services")}
                  disabled={submitting}
                >
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
