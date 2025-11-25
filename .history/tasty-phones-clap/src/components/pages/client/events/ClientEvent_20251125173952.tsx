import React from "react";
import { useTable } from "@refinedev/antd";
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Alert,
  Pagination,
  Button,
} from "antd";

import "./ClientEvent.css";
import "../../../../../src/assets/fonts/fonts.css";

const { Title, Text, Paragraph } = Typography;

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export const ClientEvent: React.FC = () => {
  const { tableProps, tableQueryResult, setCurrent } = useTable<Event>({
    resource: "events", // Tên resource API
    pagination: { pageSize: 6, mode: "server" },
    sorters: { initial: [{ field: "date", order: "desc" }] },
  });

  const events = tableProps?.dataSource || [];
  const total = tableProps?.pagination?.total || 0;
  const currentPage = tableProps?.pagination?.current || 1;
  const pageSize = tableProps?.pagination?.pageSize || 6;

  const isLoading = tableQueryResult?.isLoading;
  const isError = tableQueryResult?.isError;
  const error = tableQueryResult?.error;

  const handlePageChange = (page: number) => setCurrent?.(page);

  // Định dạng ngày tháng
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // --- RENDERING LỖI ---
  if (isError) {
    return (
      <div style={{ padding: "80px 20px" }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error?.message || "Không thể kết nối đến server."}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => tableQueryResult?.refetch()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="client-event-container">
      {/* HERO BANNER*/}
      <div className="event-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">SỰ KIỆN & ƯU ĐÃI</h1>
        </div>
      </div>

      {/* GALLERY CONTENT */}
      <div className="event-content-section container">
        <Title level={2} className="client-event-title">
          🌟 Các Sự Kiện Sắp Diễn Ra 🌟
        </Title>

        {isLoading ? (
          <div className="loading-container event-loading">
            <Spin size="large" />
            <Text style={{ marginTop: 16, display: "block" }}>
              Đang tải sự kiện...
            </Text>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state event-empty">
            <Text type="secondary" style={{ fontSize: 16 }}>
              Hiện chưa có sự kiện nào.
            </Text>
          </div>
        ) : (
          <>
            <Row gutter={[32, 32]}>
              {events.map((event) => (
                <Col xs={24} md={12} lg={8} key={event.id}>
                  <Card
                    hoverable
                    className="event-card"
                    cover={
                      <div className="event-image-container">
                        <img
                          src={
                            event.image ||
                            "https://via.placeholder.com/600x400?text=No+Image"
                          }
                          alt={event.name}
                          className="event-image"
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={event.name}
                      description={
                        <>
                          <Text strong className="event-date">
                            Ngày: {formatDate(event.date)}
                          </Text>
                          <br />
                          <Text type="secondary" className="event-location">
                            Địa điểm: {event.location}
                          </Text>
                          <Paragraph className="event-description">
                            {event.description?.substring(0, 100)}...
                          </Paragraph>
                        </>
                      }
                    />
                    <Button type="primary" className="event-detail-btn">
                      Xem Chi Tiết
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>

            {/*  PAGINATION */}
            {total > pageSize && (
              <div className="pagination-container event-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total, range) =>
                    `Hiển thị ${range[0]}-${range[1]} của ${total} sự kiện`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
