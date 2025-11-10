// src/components/pages/client/rooms/RoomDetail.tsx
import React, { useState } from "react";
import { useOne, useApiUrl } from "@refinedev/core";
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
  Tabs,
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
  SmokeFreeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarFilled,
  ShareAltOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { formatPrice } from "../../../../interfaces/rooms";
import "./RoomDetail.css";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface RoomDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  amenities: string[];
  size: string;
  bed_type: string;
  max_guests: number;
  view: string;
  rating: number;
  reviews_count: number;
}

export const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = useApiUrl();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingDates, setBookingDates] = useState<any>(null);
  const [guests, setGuests] = useState(2);

  const { data, isLoading, isError } = useOne<RoomDetail>({
    resource: "rooms",
    id: id,
  });

  const room = data?.data;

  // Dữ liệu mẫu nếu API chưa có
  const defaultRoom: RoomDetail = {
    id: 1,
    name: "Deluxe King Room",
    description:
      "Phòng Deluxe King sang trọng với giường king-size, view thành phố tuyệt đẹp và đầy đủ tiện nghi cao cấp. Phòng được thiết kế hiện đại với không gian rộng rãi, phù hợp cho cả công tác và nghỉ dưỡng.",
    price: 2500000,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
    ],
    amenities: [
      "WiFi miễn phí",
      "Điều hòa nhiệt độ",
      "TV màn hình phẳng",
      "Minibar",
      "Bồn tắm",
      "Vòi sen",
      "Máy sấy tóc",
      "Bàn làm việc",
      "Két an toàn",
      "Phòng tắm riêng",
    ],
    size: "45 m²",
    bed_type: "Giường King Size",
    max_guests: 3,
    view: "View thành phố",
    rating: 4.8,
    reviews_count: 124,
  };

  const roomData = room || defaultRoom;

  const amenitiesList = [
    { icon: <WifiOutlined />, text: "WiFi miễn phí" },
    { icon: <CarOutlined />, text: "Bãi đỗ xe" },
    { icon: <CoffeeOutlined />, text: "Bữa sáng" },
    { icon: <TeamOutlined />, text: "Phù hợp gia đình" },
    { icon: <SmokeFreeOutlined />, text: "Không hút thuốc" },
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
    {
      id: 3,
      name: "Lê Văn C",
      rating: 5,
      date: "2024-01-05",
      comment: "Tuyệt vời! Sẽ quay lại trong kỳ nghỉ tới.",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const handleBookNow = () => {
    if (bookingDates) {
      navigate(`/client/booking/${id}`, {
        state: {
          dates: bookingDates,
          guests: guests,
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

  if (isError) {
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
                  src={roomData.images[selectedImage]}
                  alt={roomData.name}
                  onClick={() => openImageModal(selectedImage)}
                />
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
                {roomData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${roomData.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Information */}
            <div className="room-info-section">
              <div className="room-header">
                <Title level={1} className="room-title">
                  {roomData.name}
                </Title>
                <div className="room-meta">
                  <Space size={16}>
                    <div className="rating">
                      <StarFilled style={{ color: "#ffc107" }} />
                      <Text strong>{roomData.rating}</Text>
                      <Text type="secondary">
                        ({roomData.reviews_count} đánh giá)
                      </Text>
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
                  <Text>{roomData.size}</Text>
                </div>
                <div className="feature-item">
                  <Text strong>Loại giường</Text>
                  <Text>{roomData.bed_type}</Text>
                </div>
                <div className="feature-item">
                  <Text strong>Số khách tối đa</Text>
                  <Text>{roomData.max_guests} người</Text>
                </div>
                <div className="feature-item">
                  <Text strong>View</Text>
                  <Text>{roomData.view}</Text>
                </div>
              </div>

              <Divider />

              {/* Description */}
              <div className="description-section">
                <Title level={3}>Mô tả phòng</Title>
                <Paragraph className="room-description">
                  {roomData.description}
                </Paragraph>
              </div>

              <Divider />

              {/* Amenities */}
              <div className="amenities-section">
                <Title level={3}>Tiện nghi phòng</Title>
                <Row gutter={[16, 16]}>
                  {roomData.amenities.map((amenity, index) => (
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
                    <Text className="rating-score">{roomData.rating}</Text>
                    <div>
                      <Rate disabled defaultValue={roomData.rating} />
                      <Text type="secondary">
                        {roomData.reviews_count} đánh giá
                      </Text>
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
                <Text className="price-amount">
                  {formatPrice(roomData.price)}
                </Text>
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
                    max={roomData.max_guests}
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
                >
                  Đặt Phòng Ngay
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
          {roomData.images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`${roomData.name} ${index + 1}`}
                style={{ width: "100%", height: "80vh", objectFit: "contain" }}
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
};
