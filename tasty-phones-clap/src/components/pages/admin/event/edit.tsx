import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Typography,
  message,
  Spin,
  Space,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";
import dayjs from "dayjs";
import type { UploadFile, RcFile } from "antd/es/upload/interface";

const { Title, Text } = Typography;

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/events/${id}`);
        const event = res.data?.data || res.data;

        form.setFieldsValue({
          title: event.title,
          description: event.description,
          start_date: event.start_date ? dayjs(event.start_date) : null,
          end_date: event.end_date ? dayjs(event.end_date) : null,
        });

        if (event.banner) {
          const baseUrl = import.meta.env.VITE_API_URL;
          const cleanBaseUrl = baseUrl.endsWith("/")
            ? baseUrl.slice(0, -1)
            : baseUrl;
          const imageUrl = `${cleanBaseUrl}/storage/${event.banner}`;

          setFileList([
            {
              uid: "-1",
              name: "banner_hien_tai.png",
              status: "done",
              url: imageUrl,
              thumbUrl: imageUrl,
            },
          ]);
        }
      } catch (err) {
        message.error("Không thể tải dữ liệu sự kiện!");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Sự kiện bắt buộc phải có ảnh banner!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("description", values.description || "");
    formData.append("start_date", values.start_date.format("YYYY-MM-DD"));
    formData.append("end_date", values.end_date.format("YYYY-MM-DD"));

    if (fileList[0]?.originFileObj) {
      formData.append("banner", fileList[0].originFileObj as RcFile);
    }

    formData.append("_method", "PUT");

    try {
      setSubmitting(true);
      await axiosInstance.post(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Cập nhật sự kiện thành công!");
      navigate("/admin/events");
    } catch (err: any) {
      message.error("Cập nhật thất bại, vui lòng kiểm tra lại dữ liệu!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card bordered={false} className="shadow-sm">
        <Space align="center" className="mb-8">
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate("/admin/events")}
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Chỉnh sửa Sự Kiện
            </Title>
            <Text type="secondary">Mã định danh: #{id}</Text>
          </div>
        </Space>

        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            validateTrigger="onBlur"
          >
            <Form.Item
              label="Tiêu đề sự kiện"
              name="title"
              rules={[
                { required: true, message: "Tiêu đề không được để trống!" },
                { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Mô tả chi tiết"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sự kiện!" },
                { min: 20, message: "Mô tả cần ít nhất 20 ký tự." },
              ]}
            >
              <Input.TextArea rows={6} showCount maxLength={2000} />
            </Form.Item>

            <Form.Item label="Ảnh Banner" required>
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                accept="image/*"
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="start_date"
                  validateTrigger="onChange"
                  rules={[
                    { required: true, message: "Bắt buộc chọn ngày bắt đầu!" },
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Ngày bắt đầu"
                    // KHÔNG cho chọn ngày trước hôm nay
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="end_date"
                  dependencies={["start_date"]}
                  validateTrigger="onChange"
                  rules={[
                    { required: true, message: "Bắt buộc chọn ngày kết thúc!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue("start_date");
                        if (
                          !value ||
                          !startDate ||
                          startDate.isBefore(value) ||
                          startDate.isSame(value, "day")
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Ngày kết thúc phải sau hoặc cùng ngày bắt đầu!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Ngày kết thúc"
                    // KHÔNG cho chọn ngày trước Start Date
                    disabledDate={(current) => {
                      const start = form.getFieldValue("start_date");
                      return (
                        current &&
                        (current < dayjs().startOf("day") ||
                          (start && current < start.startOf("day")))
                      );
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mt-8">
              <Space className="w-full justify-end">
                <Button size="large" onClick={() => navigate("/admin/events")}>
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                >
                  Lưu thay đổi
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}
