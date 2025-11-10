// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useState } from "react";
import { useOne } from "@refinedev/core";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Divider,
  List,
  Carousel,
  Modal,
  Rate,
  Space,
  Spin,
  Alert,
  DatePicker,
  InputNumber,
  Form,
} from "antd";
import {
  EnvironmentOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  TeamOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarFilled,
  ShareAltOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  formatPrice,
  getRoomStatusColor,
  getRoomStatusLabel,
  Room,
} from "../../../../interfaces/rooms";
import "./RoomDetail.css";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

export const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingDates, setBookingDates] = useState<any>(null);
  const [guests, setGuests] = useState(1);

  const { data, isLoading, isError } = useOne<Room>({
    resource: "rooms",
    id: id,
  });

  const room = data?.data;

  // Debug dữ liệu API
  console.log("Room Detail API Data:", room);

  // Dữ liệu mẫu fallback
  const defaultImages = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
  ];

  const amenitiesList = [
    { icon: <WifiOutlined />, text: "WiFi miễn phí" },
    { icon: <CarOutlined />, text: "Bãi đỗ xe" },
    { icon: <CoffeeOutlined />, text: "Bữa sáng" },
    { icon: <TeamOutlined />, text: "Phù hợp gia đình" },
    { icon: <CloseCircleOutlined />, text: "Không hút thuốc" },
    { icon: <ClockCircleOutlined />, text: "Check-in linh hoạt" },
  ];

  const reviews = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Phòng rất đẹp và sạch sẽ. Nhân viên nhiệt tình, view thành phố tuyệt vời!",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 4,
      date: "2024-01-10",
      comment:
        "Trải nghiệm tốt, phòng rộng rãi. Chỉ có wifi hơi chậm một chút.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  ];

  const handleBookNow = () => {
    if (bookingDates) {
      navigate(`/client/booking/${id}`, {
        state: {
          dates: bookingDates,
          guests: guests,
          room: room,
        },
      });
    } else {
      Modal.info({
        title: "Chọn ngày",
        content:
          "Vui lòng chọn ngày nhận phòng và trả phòng để tiếp tục đặt phòng.",
      });
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImage(index);
    setIsModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text style={{ marginTop: 16, display: "block" }}>
          Đang tải thông tin phòng...
        </Text>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="error-container">
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải thông tin phòng. Vui lòng thử lại sau."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  // Xử lý dữ liệu từ API
  const roomImages = room.room_type?.image_url
    ? [room.room_type.image_url, ...defaultImages]
    : defaultImages;

  const roomAmenities = room.amenities?.map((amenity: any) => amenity.name) || [
    "WiFi miễn phí",
    "Điều hòa nhiệt độ",
    "TV màn hình phẳng",
    "Minibar",
    "Bồn tắm",
    "Phòng tắm riêng",
  ];

  const roomSize = room.room_type?.size || "45 m²";
  const bedType = room.room_type?.bed_type || "Giường King Size";
  const maxGuests = room.room_type?.max_guests || 2;
  const roomView = room.room_type?.view || "View thành phố";

  return (
    <div className="room-detail-container">
      {/* Header Navigation */}
      <div className="room-detail-header">
        <div className="container">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/client/rooms")}
            className="back-button"
          >
            Quay lại danh sách phòng
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <Row gutter={[48, 32]}>
          {/* Left Column - Images & Details */}
          <Col xs={24} lg={16}>
            {/* Image Gallery */}
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={roomImages[selectedImage]}
                  alt={room.room_type?.name || `Phòng ${room.room_number}`}
                  onClick={() => openImageModal(selectedImage)}
                />
                <Tag
                  color={getRoomStatusColor(room.status)}
                  className="room-status-tag"
                >
                  {getRoomStatusLabel(room.status)}
                </Tag>
                <div className="image-actions">
                  <Button
                    icon={<ShareAltOutlined />}
                    shape="circle"
                    className="action-btn"
                  />
                  <Button
                    icon={<HeartOutlined />}
                    shape="circle"
                    className="action-btn"
                  />
                </div>
              </div>

              <div className="thumbnail-list">
                {roomImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${room.room_type?.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Information */}
            <div className="room-info-section">
              <div className="room-header">
                <Title level={1} className="room-title">
                  {room.room_type?.name || `Phòng ${room.room_number}`}
                </Title>
                <div className="room-meta">
                  <Space size={16}>
                    <div className="rating">
                      <StarFilled style={{ color: "#ffc107" }} />
                      <Text strong>4.8</Text>
                      <Text type="secondary">(124 đánh giá)</Text>
                    </div>
                    <div className="location">
                      <EnvironmentOutlined />
                      <Text>Trung tâm Quận 1, TP.HCM</Text>
                    </div>
                  </Space>
                </div>
              </div>

              <Divider />

              {/* Room Features */}
              <div className="room-features-grid">
                <div className="feature-item">
                  <Text strong>Diện tích</Text>
                  <Text>{roomSize}</Text>
                </div>
                <div className="feature-item">
                  <Text strong>Loại giường</Text>
                  <Text>{bedType}</Text>
                </div>
                <div className="feature-item">
                  <Text strong>Số khách tối đa</Text>
                  <Text>{maxGuests} người</Text>
                </div>
                <div className="feature-item">
                  <Text strong>View</Text>
                  <Text>{roomView}</Text>
                </div>
              </div>

              <Divider />

              {/* Description */}
              <div className="description-section">
                <Title level={3}>Mô tả phòng</Title>
                <Paragraph className="room-description">
                  {room.description ||
                    room.room_type?.description ||
                    "Phòng nghỉ sang trọng với đầy đủ tiện nghi hiện đại, không gian thoải mái phù hợp cho cả công tác và nghỉ dưỡng."}
                </Paragraph>
              </div>

              <Divider />

              {/* Amenities */}
              <div className="amenities-section">
                <Title level={3}>Tiện nghi phòng</Title>
                <Row gutter={[16, 16]}>
                  {roomAmenities.map((amenity, index) => (
                    <Col xs={12} md={8} key={index}>
                      <div className="amenity-item">
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        <Text>{amenity}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              <Divider />

              {/* Reviews */}
              <div className="reviews-section">
                <Title level={3}>Đánh giá từ khách hàng</Title>
                <div className="reviews-summary">
                  <div className="overall-rating">
                    <Text className="rating-score">4.8</Text>
                    <div>
                      <Rate disabled defaultValue={4.8} />
                      <Text type="secondary">124 đánh giá</Text>
                    </div>
                  </div>
                </div>

                <List
                  dataSource={reviews}
                  renderItem={(review) => (
                    <List.Item className="review-item">
                      <List.Item.Meta
                        avatar={
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="review-avatar"
                          />
                        }
                        title={
                          <div className="review-header">
                            <Text strong>{review.name}</Text>
                            <div className="review-meta">
                              <Rate disabled value={review.rating} />
                              <Text type="secondary">{review.date}</Text>
                            </div>
                          </div>
                        }
                        description={review.comment}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>

          {/* Right Column - Booking Card */}
          <Col xs={24} lg={8}>
            <Card className="booking-card" bordered={false}>
              <div className="price-section">
                <Text className="price-label">Giá phòng mỗi đêm</Text>
                <Text className="price-amount">{formatPrice(room.price)}</Text>
                <Text type="secondary">+ thuế và phí</Text>
              </div>

              <Divider />

              <Form layout="vertical" className="booking-form">
                <Form.Item label="Ngày nhận phòng - trả phòng">
                  <RangePicker
                    style={{ width: "100%" }}
                    size="large"
                    onChange={(dates) => setBookingDates(dates)}
                  />
                </Form.Item>

                <Form.Item label="Số khách">
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    min={1}
                    max={maxGuests}
                    value={guests}
                    onChange={(value) => setGuests(value || 1)}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  size="large"
                  block
                  className="book-now-btn"
                  onClick={handleBookNow}
                  disabled={room.status !== "available"} // Disable nếu phòng không khả dụng
                >
                  {room.status === "available"
                    ? "Đặt Phòng Ngay"
                    : "Phòng Đã Được Đặt"}
                </Button>
              </Form>

              <Divider />

              <div className="hotel-features">
                <Title level={5}>Tiện nghi khách sạn</Title>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {amenitiesList.map((item, index) => (
                    <div key={index} className="hotel-feature-item">
                      {item.icon}
                      <Text>{item.text}</Text>
                    </div>
                  ))}
                </Space>
              </div>

              <Divider />

              <div className="cancellation-policy">
                <Title level={5}>Chính sách hủy phòng</Title>
                <Text type="secondary">
                  Miễn phí hủy phòng trước 48 giờ. Hủy sau thời gian này sẽ bị
                  tính phí 50% giá trị đặt phòng.
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Image Modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        className="image-modal"
      >
        <Carousel
          initialSlide={selectedImage}
          dots={{ className: "custom-dots" }}
        >
          {roomImages.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`${room.room_type?.name} ${index + 1}`}
                style={{ width: "100%", height: "80vh", objectFit: "contain" }}
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
};
