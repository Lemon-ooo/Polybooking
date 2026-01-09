import React, { useState } from "react";
import { Create } from "@refinedev/antd";
import {
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Button,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const EventCreate = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = async (values: any) => {
    // Kiểm tra ảnh trước khi gửi
    if (!fileList[0]?.originFileObj) {
      message.error("Vui lòng tải lên ảnh banner cho sự kiện!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("description", values.description || "");
    formData.append("start_date", values.start_date.format("YYYY-MM-DD"));
    formData.append("end_date", values.end_date.format("YYYY-MM-DD"));
    formData.append("banner", fileList[0].originFileObj as RcFile);

    try {
      await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Thêm sự kiện thành công!");
      navigate("/admin/events");
    } catch (error: any) {
      const errs = error.response?.data?.errors;
      if (errs) {
        Object.values(errs).forEach((msg: any) =>
          message.error(Array.isArray(msg) ? msg[0] : msg)
        );
      } else {
        message.error("Có lỗi xảy ra khi kết nối đến máy chủ!");
      }
    }
  };

  return (
    <Create
      title="Thêm sự kiện mới"
      footerButtons={() => null}
      // SỬA LỖI MŨI TÊN BACK: Ép điều hướng về trang danh sách
      headerProps={{
        onBack: () => navigate("/admin/events"),
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        // Chỉ hiện lỗi khi thoát khỏi ô nhập liệu (onBlur)
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
          <Input placeholder="Ví dụ: Hội thảo công nghệ 2024" />
        </Form.Item>

        <Form.Item
          label="Mô tả chi tiết"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả sự kiện!" },
            {
              min: 20,
              message: "Mô tả cần ít nhất 20 ký tự để đầy đủ thông tin.",
            },
            {
              validator: (_, value) => {
                // Chặn trường hợp chỉ nhập toàn dấu cách
                if (
                  value &&
                  value.trim().length > 0 &&
                  value.trim().length < 20
                ) {
                  return Promise.reject(
                    new Error("Nội dung thực tế phải đạt tối thiểu 20 ký tự!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.TextArea
            rows={6}
            placeholder="Nội dung sự kiện, địa điểm, thành phần tham dự..."
            showCount
            maxLength={2000}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh Banner"
          required
          tooltip="Yêu cầu định dạng ảnh (JPG, PNG, WebP) dưới 2MB"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Bạn chỉ có thể tải lên tệp ảnh!");
                return Upload.LIST_IGNORE;
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error("Kích thước ảnh không được vượt quá 2MB!");
                return Upload.LIST_IGNORE;
              }
              return false; // Ngăn tự động upload để xử lý qua handleFinish
            }}
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
              // DatePicker nên validate khi chọn (onChange)
              validateTrigger="onChange"
              rules={[
                { required: true, message: "Bắt buộc chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày bắt đầu"
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
                    if (!value || getFieldValue("start_date") <= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Ngày kết thúc phải cùng ngày hoặc sau ngày bắt đầu!"
                      )
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày kết thúc"
                disabledDate={(current) => {
                  const start = form.getFieldValue("start_date");
                  return current && current < (start || dayjs().startOf("day"));
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "right", marginTop: 30 }}>
          <Button
            type="default"
            onClick={() => navigate("/admin/events")}
            style={{ marginRight: 12, borderRadius: "6px" }}
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ borderRadius: "6px" }}
          >
            Lưu sự kiện
          </Button>
        </Form.Item>
      </Form>
    </Create>
  );
};
