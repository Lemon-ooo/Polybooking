import React from "react";
import { Edit, Form, Input, ImageField } from "@refinedev/antd";
import { useForm, useShow, BaseRecord } from "@refinedev/core";
import { Card, Typography, Row, Col, Alert, Space } from "antd";

// Định nghĩa Interface tạm thời cho Ảnh Gallery
interface GalleryImage extends BaseRecord {
  id: number;
  title: string;
  url: string; // URL của ảnh để hiển thị
  description: string;
}

const { Title, Text } = Typography;
const { TextArea } = Input;

export const GalleryEdit: React.FC = () => {
  // 1. Sử dụng useForm để xử lý việc fetch dữ liệu ban đầu và gửi dữ liệu update
  const { formProps, saveButtonProps, queryResult } = useForm<GalleryImage>({
    resource: "images", // Đảm bảo resource name khớp với Refine config
    action: "edit",
  });

  const record = queryResult?.data?.data;
  const isLoading = queryResult?.isLoading;
  const isError = queryResult?.isError;
  const error = queryResult?.error;

  if (isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu ảnh"
        description={
          error?.message || "Không thể tải chi tiết ảnh để chỉnh sửa."
        }
        type="error"
        showIcon
      />
    );
  }

  return (
    // Edit component của Refine cung cấp Header, tiêu đề và nút Save
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Row gutter={[16, 16]}>
        {/* Cột trái: Ảnh xem trước */}
        <Col xs={24} lg={8}>
          <Card bordered={false} title="Ảnh Hiện Tại">
            {/* Hiển thị ảnh đang được chỉnh sửa */}
            {record?.url ? (
              <ImageField
                value={record.url}
                width="100%"
                height="auto"
                style={{
                  objectFit: "contain",
                  maxHeight: 300,
                  borderRadius: 8,
                }}
              />
            ) : (
              <Text type="secondary">Đang tải ảnh...</Text>
            )}
            <Text type="secondary" style={{ marginTop: 10, display: "block" }}>
              (Chức năng thay đổi file ảnh cần được xử lý riêng)
            </Text>
          </Card>
        </Col>

        {/* Cột phải: Form chỉnh sửa metadata */}
        <Col xs={24} lg={16}>
          <Form
            {...formProps}
            layout="vertical"
            // Thiết lập các giá trị ban đầu (đã được useForm xử lý)
          >
            {/* Trường ID (Ẩn) */}
            <Form.Item hidden data-test-id="id-field" name="id">
              <Input />
            </Form.Item>

            {/* 1. Tiêu đề */}
            <Form.Item
              label="Tiêu đề Ảnh"
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề ảnh!" },
              ]}
            >
              <Input placeholder="Nhập tiêu đề hoặc tên file" />
            </Form.Item>

            {/* 2. Mô tả */}
            <Form.Item label="Mô tả Chi tiết" name="description">
              <TextArea rows={4} placeholder="Nhập mô tả chi tiết cho ảnh" />
            </Form.Item>

            {/* 3. Ngày tạo (Chỉ hiển thị, không chỉnh sửa) */}
            {record?.created_at && (
              <Space direction="vertical">
                <Title level={5} style={{ marginBottom: 0 }}>
                  Ngày tạo
                </Title>
                <Text>{new Date(record.created_at).toLocaleDateString()}</Text>
              </Space>
            )}

            {/* Lưu ý: Thêm trường tags, category... nếu cần */}
          </Form>
        </Col>
      </Row>
    </Edit>
  );
};
