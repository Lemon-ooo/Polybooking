// src/components/pages/client/rooms/ClientRooms.tsx
import React from "react";
import { Row, Col, Card, Typography, Button, Space, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  BedOutlined,
  BathOutlined,
  RulerOutlined,
} from "@ant-design/icons";
import "./ClientRooms.css";

const { Title, Paragraph, Text } = Typography;

interface RoomData {
  id: number;
  name: string;
  title: string;
  description: string;
  size: string;
  view: string;
  bed: string;
  bathroom: string;
  image1: string;
  image2: string;
}

export const ClientRooms: React.FC = () => {
  const navigate = useNavigate();

  const rooms: RoomData[] = [
    {
      id: 1,
      name: "L’AMOUR SUITE ROOM",
      title: "L’amour Suite Room",
      description:
        "Trải nghiệm độc quyền từng bước từ phong cách Đông Dương và văn hóa địa phương. Phòng nghỉ sang trọng có ban công tầm nhìn đẹp nhất. Bạn có thể tận dụng không khí trong mây trời và cây cổ thụ trên phố Phan Đình",
      size: "46 sqm",
      view: "City view",
      bed: "1 King-size bed",
      bathroom: "A separate bathtub & a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/lamour-suite-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/lamour-suite-2.jpg",
    },
    {
      id: 2,
      name: "LA BELLE SUITE ROOM",
      title: "La Belle Suite Room",
      description:
        "“La Belle” trong tiếng Pháp có nghĩa là “người phụ nữ xinh đẹp”. Đúng với cái tên quyến rũ của nó, căn hộ này có vẻ đẹp tinh tế từ màu sắc đến thiết kế nội thất. Sự hấp dẫn cũng đến từ bồn tắm",
      size: "36 sqm",
      view: "City view",
      bed: "1 King-size bed",
      bathroom: "A separate bathtub & a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/la-belle-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/la-belle-2.jpg",
    },
    {
      id: 3,
      name: "VIRTUAL SUITE ROOM",
      title: "Virtual Suite Room",
      description:
        "Thiết kế thơm và quyến rũ. Bên trong phòng tạo cảm giác ấm cúng và riêng tư, nhưng có thể quan sát thành phố tốc độ qua khung kính bí mật. Ánh sáng bạch linh từ dải mây thác mây ở trả không gian trở",
      size: "35 sqm",
      view: "City view",
      bed: "2 single beds (Combined into 1 King-size bed upon request)",
      bathroom: "A separate bathtub & a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/virtual-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/virtual-2.jpg",
    },
    {
      id: 4,
      name: "SECRET SUITE ROOM",
      title: "Secret Suite Room",
      description:
        "Ban công với các sản phẩm nghệ thuật cây cảnh như một khu vườn bí mật được chiếu sáng bởi một chuỗi đèn lồng đám mây treo trên trần sảnh. Căn phòng có thiết kế đặc biệt sang trọng vừa lãng mạn…",
      size: "35 sqm",
      view: "City view",
      bed: "2 single beds (Combined into 1 King-size bed upon request)",
      bathroom: "A separate bathtub & a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/secret-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/secret-2.jpg",
    },
    {
      id: 5,
      name: "PREMIER KING ROOM",
      title: "Premier King Room",
      description:
        "Phòng có cửa sổ nhìn ra thành phố. Nội thất theo phong cách Đông Dương, thiết kế độc lập, tinh tế đến từng chi tiết.",
      size: "29 sqm",
      view: "City view",
      bed: "1 King-size bed",
      bathroom: "A separate bathtub or a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/premier-king-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/premier-king-2.jpg",
    },
    {
      id: 6,
      name: "PREMIER TWIN ROOM",
      title: "Premier Twin Room",
      description:
        "Phòng có cửa sổ nhìn ra thành phố. Nội thất theo phong cách Đông Dương, thiết kế độc lập, tinh tế đến từng chi tiết.",
      size: "29 sqm",
      view: "City view",
      bed: "2 Single beds",
      bathroom: "A separate bathtub or a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/premier-twin-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/premier-twin-2.jpg",
    },
    {
      id: 7,
      name: "DELUXE KING ROOM",
      title: "Deluxe King Room",
      description:
        "Phòng ấm cúng, đầy đủ tiện nghi, thích hợp cho chuyến đi công tác hoặc kỳ nghỉ yên bình tại thủ đô nhộn nhịp.",
      size: "28 sqm",
      view: "City view",
      bed: "1 King-size bed",
      bathroom: "A separate bathtub or a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/deluxe-king-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/deluxe-king-2.jpg",
    },
    {
      id: 8,
      name: "DELUXE TWIN ROOM",
      title: "Deluxe Twin Room",
      description:
        "Phòng ấm cúng, đầy đủ tiện nghi, thích hợp cho chuyến đi công tác hoặc kỳ nghỉ yên bình tại thủ đô nhộn nhịp.",
      size: "28 sqm",
      view: "City view",
      bed: "2 Single beds",
      bathroom: "A separate bathtub or a standing shower",
      image1:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/deluxe-twin-1.jpg",
      image2:
        "https://ruedelamourhotel.com/wp-content/uploads/2024/08/deluxe-twin-2.jpg",
    },
  ];

  const handleViewDetails = (id: number) => {
    navigate(`/client/rooms/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="rue-client-rooms">
      {/* BANNER - TO HƠN, DÀI HƠN */}
      <div className="rue-hero-banner">
        <div className="rue-hero-content">
          <Title level={1} className="rue-page-title">
            Suite Room
          </Title>
        </div>
      </div>

      {/* ROOMS LIST - 2 CỘT, KHÔNG FILTER */}
      <div className="rue-rooms-container">
        <div className="container">
          <Row gutter={[48, 64]} justify="center">
            {rooms.map((room) => (
              <Col xs={24} md={12} key={room.id}>
                <Card className="rue-room-card" bordered={false} hoverable>
                  <Row gutter={[24, 24]}>
                    {/* 2 ảnh */}
                    <Col span={12}>
                      <img
                        src={room.image1}
                        alt={room.name}
                        className="rue-room-img"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop";
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <img
                        src={room.image2}
                        alt={room.name}
                        className="rue-room-img"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop";
                        }}
                      />
                    </Col>
                  </Row>

                  <Divider
                    style={{ margin: "24px 0", borderColor: "#e8e8e8" }}
                  />

                  {/* Nội dung */}
                  <div className="rue-room-content">
                    <Title level={4} className="rue-room-name">
                      {room.name}
                    </Title>
                    <Paragraph className="rue-room-desc">
                      {room.description}
                    </Paragraph>

                    <Space
                      direction="vertical"
                      size={8}
                      className="rue-room-features"
                    >
                      <Space>
                        <RulerOutlined />
                        <Text>Room Size: {room.size}</Text>
                      </Space>
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{room.view}</Text>
                      </Space>
                      <Space>
                        <BedOutlined />
                        <Text>{room.bed}</Text>
                      </Space>
                      <Space>
                        <BathOutlined />
                        <Text>{room.bathroom}</Text>
                      </Space>
                    </Space>

                    <Button
                      type="link"
                      className="rue-details-btn"
                      onClick={() => handleViewDetails(room.id)}
                      block
                    >
                      ROOM DETAILS
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CONNECTING ROOMS */}
          <div className="rue-connecting">
            <Title level={3} className="rue-connecting-title">
              Connecting rooms
            </Title>
            <Paragraph className="rue-connecting-desc">
              Một lựa chọn tuyệt vời cho kỳ nghỉ gia đình của bạn. Vui lòng liên
              hệ với chúng tôi qua đường dây nóng{" "}
              <Text strong>(+84) 24 5555 5599</Text> hoặc email:{" "}
              <Text strong>sales@ruedelamourhotel.com</Text>
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};
