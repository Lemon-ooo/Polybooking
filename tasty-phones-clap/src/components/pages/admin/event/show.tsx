import React from "react";
import { Show, ImageField, TextField, DateField } from "@refinedev/antd";
import { useShow, BaseRecord } from "@refinedev/core";
import { Typography, Card, Row, Col, Alert, Space } from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons"; // Thêm icon

// ✅ 1. SỬ DỤNG INTERFACE CỦA EVENT
interface IEvent extends BaseRecord {
  id: number;
  name: string;
  description: string;
  date: string; // Ngày diễn ra sự kiện
  location: string;
  image: string | null; // Đường dẫn ảnh bìa
  created_at: string;
  updated_at: string;
}

const { Title, Text } = Typography;

export const EventShow: React.FC = () => {
  // ✅ 2. Đổi resource thành 'events' và dùng interface IEvent
  const { queryResult } = useShow<IEvent>({
    resource: "events",
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
          error?.message ||
          "Không tìm thấy dữ liệu sự kiện hoặc có lỗi kết nối."
        }
        type="error"
        showIcon
      />
    );
  }

  // ✅ Hàm Helper: Xây dựng URL ảnh từ 'image' (Nếu ảnh được lưu ở Laravel storage)
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    // Giả định đường dẫn Laravel Storage là http://127.0.0.1:8001/storage/
    return `http://127.0.0.1:8001/storage/${path}`;
  };

  // Xử lý giá trị ngày API trả về (có thể có timestamp T00:00:00.000000Z)
  const eventDate = record.date ? record.date.split("T")[0] : "N/A";

  return (
    <Show title={`Chi tiết Sự kiện: ${record.name}`}>
      <Row gutter={[16, 16]}>
        {/* Cột trái: Ảnh Bìa Sự kiện */}
        <Col xs={24} lg={10}>
          <Card bordered={false} style={{ textAlign: "center" }}>
            <Title level={4}>Ảnh Bìa</Title>
            <ImageField
              // ✅ Sử dụng trường 'image' và hàm helper
              value={getImageUrl(record.image)}
              width="100%"
              height="auto"
              style={{
                objectFit: "contain",
                maxHeight: 400,
                borderRadius: 8,
                // Hiển thị placeholder nếu không có ảnh
                backgroundColor: record.image ? "transparent" : "#f0f0f0",
              }}
              preview={!!record.image}
              alt={`Ảnh bìa của sự kiện ${record.name}`}
            />
            {!record.image && (
              <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
                (Không có ảnh bìa)
              </Text>
            )}
          </Card>
        </Col>

        {/* Cột phải: Thông tin chi tiết Sự kiện */}
        <Col xs={24} lg={14}>
          <Card bordered={false}>
            {/* 1. Tên Sự kiện */}
            <Title level={3} style={{ marginTop: 0 }}>
              <TextField value={record.name} />
            </Title>
            <hr style={{ margin: "16px 0" }} />

            {/* 2. Ngày và Địa điểm */}
            <Title level={5} style={{ marginBottom: 4 }}>
              <CalendarOutlined /> Ngày Diễn ra
            </Title>
            {/* ✅ Sử dụng DateField hoặc TextField để hiển thị ngày */}
            <Text style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {/* Định dạng ngày YYYY-MM-DD sang DD/MM/YYYY */}
              <DateField value={eventDate} format="DD/MM/YYYY" />
            </Text>
            <br />
            <Title level={5} style={{ marginBottom: 4, marginTop: 12 }}>
              <EnvironmentOutlined /> Địa điểm
            </Title>
            <TextField value={record.location} />
            <hr style={{ margin: "16px 0" }} />

            {/* 3. Mô tả Chi tiết */}
            <Title level={5} style={{ marginBottom: 4 }}>
              Mô tả Chi tiết
            </Title>
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {record.description || "Chưa có mô tả chi tiết."}
            </Text>
            <hr style={{ margin: "16px 0" }} />

            {/* 4. Ngày tạo và ID */}
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5} style={{ marginBottom: 4 }}>
                  Ngày tạo
                </Title>
                <DateField
                  value={record.created_at}
                  format="DD/MM/YYYY HH:mm"
                />
              </Col>
              <Col span={12}>
                <Title level={5} style={{ marginBottom: 4 }}>
                  ID
                </Title>
                <Text code>{record.id}</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
