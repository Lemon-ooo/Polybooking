import React from "react";
import { Create, Form, Input, useNotification } from "@refinedev/antd";
import { useForm, useApiUrl, useCustomMutation } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query"; // 🚨 Cần thiết cho invalidateQueries
import { Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
} from "antd/lib/upload/interface";

const { TextArea } = Input;

// Hàm kiểm tra file trước khi upload (giới hạn kích thước và định dạng)
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("Bạn chỉ có thể upload file JPG/PNG!");
  }
  const isLt5M = file.size / 1024 / 1024 < 5; // Giới hạn 5MB
  if (!isLt5M) {
    message.error("Kích thước ảnh phải nhỏ hơn 5MB!");
  }
  return isJpgOrPng && isLt5M;
};

// Hàm xử lý khi file được thêm/xóa khỏi vùng chọn của Upload component
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  // Trả về fileList để Antd Form quản lý
  return e?.fileList;
};

export const GalleryCreate: React.FC = () => {
  const queryClient = useQueryClient(); // Khai báo QueryClient
  const apiUrl = useApiUrl();
  const { open } = useNotification();

  const { formProps, saveButtonProps } = useForm({
    resource: "images",
    action: "create",
    // Tắt tính năng tự động gửi (submit) của Refine vì chúng ta cần xử lý file thủ công
  });

  // Custom Mutation để xử lý FormData (không dùng formProps.onFinish mặc định)
  const { mutate, isLoading } = useCustomMutation();

  // 🚨 Logic xử lý khi Submit Form
  const handleFormSubmit = async (values: any) => {
    const fileList = values.file;
    if (!fileList || fileList.length === 0 || !fileList[0].originFileObj) {
      message.error("Vui lòng chọn một file ảnh để upload.");
      return;
    }
    const file = fileList[0].originFileObj;

    // 1. Tạo FormData
    const formData = new FormData();
    // 'file' là tên trường mà Backend sẽ nhận file ảnh
    formData.append("file", file);
    formData.append("title", values.title);
    formData.append("description", values.description || "");

    // 2. Gọi API bằng useCustomMutation
    mutate(
      {
        url: `${apiUrl}/images`, // Endpoint hoàn chỉnh
        method: "post",
        values: formData,
        headers: {
          // Cần thiết cho file upload
          "Content-Type": "multipart/form-data",
        },
      },
      {
        onSuccess: (data) => {
          // 🚨 BƯỚC QUAN TRỌNG: Invalidate query danh sách để FE tải lại dữ liệu
          queryClient.invalidateQueries({
            queryKey: ["default", "images", "list"],
          });

          message.success("Upload ảnh và tạo mới thành công!");
          formProps.form?.resetFields(); // Reset form sau khi thành công
        },
        onError: (error) => {
          console.error("Upload Error:", error);
          open({
            type: "error",
            message: "Lỗi tạo mới",
            description: error.message || "Không thể upload ảnh lên máy chủ.",
          });
        },
      }
    );
  };

  return (
    <Create saveButtonProps={{ ...saveButtonProps, loading: isLoading }}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleFormSubmit} // Ghi đè onFinish
      >
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            {/* 1. Trường File Upload */}
            <Form.Item
              label="File Ảnh (*)"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn file ảnh để upload!",
                },
              ]}
            >
              <Upload
                name="file"
                listType="picture"
                maxCount={1}
                beforeUpload={beforeUpload}
                // Tắt upload mặc định của Antd
                customRequest={({ onSuccess }) => {
                  onSuccess?.({} as any);
                }}
                onChange={(info: UploadChangeParam<UploadFile>) => {
                  // Bắt sự kiện thay đổi file
                  formProps.form?.setFieldsValue({ file: info.fileList });
                }}
              >
                <Button icon={<UploadOutlined />}>
                  Chọn File Ảnh (JPG/PNG)
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* 2. Tiêu đề */}
        <Form.Item
          label="Tiêu đề Ảnh"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề ảnh!" }]}
        >
          <Input placeholder="Nhập tiêu đề hoặc tên file" />
        </Form.Item>

        {/* 3. Mô tả */}
        <Form.Item label="Mô tả Chi tiết" name="description">
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết cho ảnh" />
        </Form.Item>
      </Form>
    </Create>
  );
};
