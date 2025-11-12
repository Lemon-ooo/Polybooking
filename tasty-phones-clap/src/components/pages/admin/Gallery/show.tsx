import React from "react";
import {
  Show,
  ImageField,
  TextField,
  DateField,
  TagField,
} from "@refinedev/antd";
import { useShow, BaseRecord } from "@refinedev/core";
import { Typography, Card, Row, Col, Alert } from "antd";


interface GalleryImage extends BaseRecord {
  id: number;
  title: string;
  url: string; // URL của ảnh để hiển thị
  description: string;
  created_at: string;
  tags?: string[]; 
}

const { Title, Text } = Typography;

export const GalleryShow: React.FC = () => {
  /
  const { queryResult } = useShow<GalleryImage>({
    resource: "images", /
  });

  const { data, isLoading, isError, error } = queryResult;
  const record = data?.data;

  if (isLoading) {
    return <Show isLoading={true} />;
  }

  if (isError || !record) {
    return (
      <Alert
        message="Lỗi tải chi tiết"
        description={
          error?.message || "Không tìm thấy dữ liệu ảnh hoặc có lỗi kết nối."
        }
        type="error"
        showIcon
      />
    );
  }

  return (
   
    <Show title={`Chi tiết Ảnh ID: ${record.id}`}>
      <Row gutter={[16, 16]}>
        {/* Cột trái: Ảnh chính */}
        <Col xs={24} lg={10}>
          <Card bordered={false} style={{ textAlign: "center" }}>
            <Title level={4}>Ảnh Gốc</Title>
            <ImageField
              value={record.url}
              width="100%"
              height="auto"
              style={{ objectFit: "contain", maxHeight: 400, borderRadius: 8 }}
            />
          </Card>
        </Col>

        {/* Cột phải: Thông tin chi tiết */}
        <Col xs={24} lg={14}>
          <Card bordered={false}>
            {/* 1. Tiêu đề */}
            <Title level={5} style={{ marginBottom: 4 }}>
              Tiêu đề
            </Title>
            <TextField value={record.title} style={{ fontSize: "1.2rem" }} />
            <hr style={{ margin: "16px 0" }} />

            {/* 2. Mô tả */}
            <Title level={5} style={{ marginBottom: 4 }}>
              Mô tả
            </Title>
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {record.description || "Không có mô tả chi tiết."}
            </Text>
            <hr style={{ margin: "16px 0" }} />

            {/* 3. Ngày tạo */}
            <Title level={5} style={{ marginBottom: 4 }}>
              Ngày tạo
            </Title>
            <DateField value={record.created_at} format="DD/MM/YYYY HH:mm" />
            <hr style={{ margin: "16px 0" }} />

            {/* Tags (Tùy chọn) */}
            {record.tags && record.tags.length > 0 && (
              <>
                <Title level={5} style={{ marginBottom: 4 }}>
                  Tags
                </Title>
                {record.tags.map((tag, index) => (
                  <TagField key={index} value={tag} color="blue" />
                ))}
                <hr style={{ margin: "16px 0" }} />
              </>
            )}

            {/*  ID */}
            <Title level={5} style={{ marginBottom: 4 }}>
              ID
            </Title>
            <Text code>{record.id}</Text>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
