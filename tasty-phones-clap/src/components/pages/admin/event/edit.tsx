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

        // ✅ Đổ dữ liệu cũ vào form
        form.setFieldsValue({
          title: event.title,
          description: event.description,
          start_date: event.start_date
            ? dayjs(event.start_date)
            : null,
          end_date: event.end_date
            ? dayjs(event.end_date)
            : null,
        });

        // ✅ Load banner cũ
        if (event.banner) {
          setFileList([
            {
              uid: "-1",
              name: event.banner.split("/").pop() || "banner.jpg",
              status: "done",
              url: `${import.meta.env.VITE_API_URL}/storage/${event.banner}`,
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
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append(
      "start_date",
      values.start_date.format("YYYY-MM-DD")
    );
    formData.append(
      "end_date",
      values.end_date.format("YYYY-MM-DD")
    );

    // ✅ Nếu chọn ảnh mới thì gửi
    if (fileList[0]?.originFileObj) {
      formData.append(
        "banner",
        fileList[0].originFileObj as RcFile
      );
    }

    // Laravel PUT
    formData.append("_method", "PUT");

    try {
      setSubmitting(true);

      await axiosInstance.post(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Cập nhật sự kiện thành công!");
      navigate("/admin/events");
    } catch (err: any) {
      message.error(
        err.response?.data?.message || "Cập nhật thất bại!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <Space align="center" className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate("/admin/events")}
          />
          <div>
            <Title level={3} className="m-0">
              Sửa Sự Kiện
            </Title>
            <Text type="secondary">Mã: #{id}</Text>
          </div>
        </Space>

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[
                { required: true, message: "Nhập tiêu đề!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Banner">
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList }) =>
                  setFileList(fileList.slice(-1))
                }
                beforeUpload={() => false}
                accept="image/*"
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>
                      Chọn ảnh
                    </div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label="Ngày bắt đầu"
              name="start_date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Ngày kết thúc"
              name="end_date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button onClick={() => navigate("/admin/events")}>
                  Hủy
                </Button>
                <Button
                  type="primary"
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
