import React, { useState } from "react";
import { Create } from "@refinedev/antd";
import { Form, Input, DatePicker, Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import axiosInstance from "../../../../providers/data/axiosConfig";
import { useNavigate } from "react-router-dom";

export const EventCreate = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();

  const handleFinish = async (values: any) => {
    if (!fileList[0]?.originFileObj) {
      message.error("Vui lòng chọn banner!");
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
        message.error("Thêm sự kiện thất bại!");
      }
    }
  };

  return (
    <Create title="Thêm sự kiện" footerButtons={() => null}>
      <Form layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Banner" required>
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
            beforeUpload={() => false}
            accept="image/*"
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Ngày bắt đầu" name="start_date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Ngày kết thúc" name="end_date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

       <Form.Item style={{ textAlign: "right" }}>
  <Button type="primary" htmlType="submit">
    Thêm sự kiện
  </Button>
</Form.Item>

      </Form>
    </Create>
  );
};


