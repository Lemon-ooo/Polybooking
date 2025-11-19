import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { IEvent } from "../../../../interfaces/rooms";

import "./ClientEvent.css";

const { Title, Text, Paragraph } = Typography;

export const ClientEvent: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const fetchEvents = (page: number = 1) => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/events?page=${page}&per_page=${pageSize}`)
      .then((res) => {
        setEvents(res.data.data);
        setTotal(res.data.meta?.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu sự kiện.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading)
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải sự kiện..." />
      </div>
    );

  if (error)
    return (
      <Alert message={error} type="error" showIcon style={{ margin: 20 }} />
    );

  return (
    <div className="client-event-container">
      <Title level={2} className="client-event-title">
        🌟 Các Sự Kiện Sắp Diễn Ra 🌟
      </Title>
      <Row gutter={[32, 32]} justify="start"> {/* thử 'center' nếu muốn căn giữa hàng */}
  {events.map((event) => (
    <Col xs={24} sm={12} md={12} lg={8} key={event.id}>
      <Card
        hoverable
        className="event-card"
        cover={
          <div className="event-image-container">
            <img
              src={event.image || "https://via.placeholder.com/800x450?text=No+Image"}
              alt={event.name}
              className="event-image"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = "https://via.placeholder.com/800x450?text=No+Image";
              }}
            />
          </div>
        }
      >
        <Card.Meta
          title={<span className="event-title">{event.name}</span>}
          description={
            <>
              <div className="event-info-row">
                <span className="event-date">Ngày: {formatDate(event.date)}</span>
              </div>
              <div className="event-info-row">
                <span className="event-location">Địa điểm: {event.location}</span>
              </div>
              <p className="event-description">{(event.description || '').substring(0, 140)}{(event.description && event.description.length>140) ? '...' : ''}</p>
            </>
          }
        />
        <div className="event-footer">
          <Button type="primary" className="event-detail-btn">Xem Chi Tiết</Button>
        </div>
      </Card>
    </Col>
  ))}
</Row>


      {total > pageSize && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `Hiển thị ${range[0]}-${range[1]} của ${total} sự kiện`
            }
          />
        </div>
      )}
    </div>
  );
};
