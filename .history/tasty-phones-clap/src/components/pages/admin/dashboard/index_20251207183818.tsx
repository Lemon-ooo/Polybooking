<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Empty, Table } from "antd";
import {
  HomeOutlined,
  ApartmentOutlined,
  HeartOutlined,
  ToolOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../../providers/data/axiosConfig";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (!stats) return <p>Lỗi tải dữ liệu</p>;

  return (
    <div style={{ padding: "10px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Dashboard Quản Trị</h1>

      {/* ==== 4 BOX THỐNG KÊ TRÊN ĐẦU ===== */}
      <Row gutter={20} style={{ marginBottom: 20, marginTop: 10 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Loại Phòng</div>}
              value={stats.roomTypes}
              prefix={<ApartmentOutlined style={{ color: "#1677ff", fontSize: 22 }} />}
            />
            <a style={{ fontSize: 14 }}>Quản lý Loại Phòng</a>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Phòng</div>}
              value={stats.rooms}
              prefix={<HomeOutlined style={{ color: "#52c41a", fontSize: 22 }} />}
            />
            <a style={{ fontSize: 14 }}>Quản lý Phòng</a>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Tiện Ích</div>}
              value={stats.amenities}
              prefix={<HeartOutlined style={{ color: "#13c2c2", fontSize: 22 }} />}
            />
            <a style={{ fontSize: 14 }}>Quản lý Tiện Ích</a>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 15 }}>Dịch Vụ</div>}
              value={stats.services}
              prefix={<ToolOutlined style={{ color: "#faad14", fontSize: 22 }} />}
            />
            <a style={{ fontSize: 14 }}>Quản lý Dịch Vụ</a>
          </Card>
        </Col>
      </Row>

      {/* ==== THỐNG KÊ NGƯỜI DÙNG ==== */}
      <Card title="Thống Kê Người Dùng" style={{ marginBottom: 25 }}>
        <Row gutter={20}>
          <Col span={8}>
            <Statistic
              title="Tổng Người Dùng"
              value={stats.totalUsers}
              prefix={<TeamOutlined style={{ color: "#1677ff" }} />}
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Quản Trị Viên"
              value={stats.admins}
              prefix={<UserOutlined style={{ color: "red" }} />}
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Khách Hàng"
              value={stats.customers}
              prefix={<UserOutlined style={{ color: "green" }} />}
            />
          </Col>
        </Row>

        <a style={{ display: "block", marginTop: 10 }}>Xem chi tiết Người Dùng</a>
      </Card>

      {/* ==== 3 KHỐI DƯỚI ===== */}
      <Row gutter={20}>
        <Col span={8}>
          <Card title="Loại Phòng Gần Đây">
            {stats.recentRoomTypes.length === 0 ? (
              <Empty description="No data" />
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey="room_type_id"
                dataSource={stats.recentRoomTypes}
                columns={[
                  { title: "Tên", dataIndex: "room_type_name" },
                  { title: "Giá", dataIndex: "base_price" },
                ]}
              />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Phòng Gần Đây">
            {stats.recentRooms.length === 0 ? (
              <Empty description="No data" />
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey="room_id"
                dataSource={stats.recentRooms}
                columns={[
                  { title: "Phòng", dataIndex: "room_number" },
                  { title: "Loại", dataIndex: "room_type_id" },
                ]}
              />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Người Dùng Gần Đây">
            {stats.recentUsers.length === 0 ? (
              <Empty description="No data" />
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey="user_id"
                dataSource={stats.recentUsers}
                columns={[
                  { title: "Tên", dataIndex: "user_name" },
                  { title: "Vai trò", dataIndex: "role" },
                ]}
              />
=======
import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Typography,
  Button,
  Tag,
  Space,
  Spin,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  HeartOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useList, useTable, BaseRecord } from "@refinedev/core";

const { Title, Text } = Typography;

// --- HÀM COMPONENT CHÍNH ---

export const AdminDashboard: React.FC = () => {
  // =======================================================================
  // 1. KÉO DỮ LIỆU ĐẾM
  // =======================================================================
  const { data: countsData, isLoading: isLoadingCounts } = useList<BaseRecord>({
    resource: "stats/counts",
    config: {
      pagination: { pageSize: 1 },
    },
  });

  const counts = countsData?.data?.[0] || {
    roomTypesCount: 0,
    roomsCount: 0,
    amenitiesCount: 0,
    servicesCount: 0,
    usersCount: 0,
    adminsCount: 0,
    customersCount: 0,
  };

  // 2. KÉO DANH SÁCH GẦN ĐÂY

  // Loại Phòng Gần Đây (KHÔNG THAY ĐỔI)
  const { data: roomTypesData, isLoading: isLoadingRoomTypes } = useList<
    BaseRecord & { room_type_name: string; max_guests: number }
  >({
    resource: "room-types",
    config: {
      pagination: { pageSize: 3 },
      sort: [{ field: "createdAt", order: "desc" }],
    },
  });
  const recentRoomTypes = roomTypesData?.data || [];

  // Phòng Gần Đây (ĐÃ ĐƯỢC SỬA: Giả định API trả về room_type là một object lồng)
  const { data: roomsData, isLoading: isLoadingRooms } = useList<
    BaseRecord & {
      room_number: string;
      room_status: string;
      // Đã thay đổi data type để truy cập tên loại phòng qua object lồng
      room_type: { room_type_name: string };
    }
  >({
    resource: "rooms",
    config: {
      pagination: { pageSize: 3 },
      sort: [{ field: "createdAt", order: "desc" }],
    },
  });
  const recentRooms = roomsData?.data || [];

  // Người Dùng Gần Đây
  const { data: usersData, isLoading: isLoadingUsers } = useList<
    BaseRecord & { user_name: string; email: string; role: string }
  >({
    resource: "users",
    config: {
      pagination: { pageSize: 3 },
      sort: [{ field: "createdAt", order: "desc" }],
    },
  });
  const recentUsers = usersData?.data || [];

  // CÁC HÀM HỖ TRỢ

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "green";
      case "Booked":
        return "volcano";
      case "Maintenance":
        return "red";
      default:
        return "default";
    }
  };

  // Component Card Thống kê Người Dùng
  const UserStatsCard: React.FC = () => (
    <Card
      title={
        <Space className="text-gray-900">
          <UserOutlined className="text-xl" />{" "}
          <Title level={4} className="mb-0">
            Thống kê Người Dùng
          </Title>
        </Space>
      }
      bordered={false}
      className="shadow-xl bg-white h-full transition-shadow duration-300 rounded-lg"
      headStyle={{ borderBottom: "1px solid #f0f0f0" }}
    >
      {isLoadingCounts ? (
        <Spin tip="Đang tải..." />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="Tổng Người Dùng"
              value={counts.usersCount}
              valueStyle={{ color: "#1890ff", fontWeight: 600 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Quản Trị Viên"
              value={counts.adminsCount}
              valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
            />
          </Col>
          <Col span={24} style={{ marginTop: 16 }}>
            <Statistic
              title="Khách Hàng"
              value={counts.customersCount}
              valueStyle={{ color: "#52c41a", fontWeight: 600 }}
            />
          </Col>
        </Row>
      )}
      <Link
        to="/admin/customers"
        className="text-blue-600 hover:text-blue-800 text-sm mt-4 block font-medium"
      >
        Xem chi tiết Người Dùng
      </Link>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center md:text-left mb-6 text-gray-800">
        Dashboard Quản Trị
      </Title>

      {/* ------------------------------------------- */}
      {/* 1. HÀNG THỐNG KÊ CHÍNH */}
      {/* ------------------------------------------- */}
      {isLoadingCounts ? (
        <Spin tip="Đang tải dữ liệu thống kê..." style={{ margin: "20px 0" }} />
      ) : (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {/* Room Types */}
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full rounded-lg"
            >
              <Statistic
                title="Loại Phòng"
                value={counts.roomTypesCount}
                prefix={<HomeOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Link
                to="/admin/room-types"
                className="text-blue-600 hover:text-blue-800 text-sm mt-2 block"
              >
                Quản lý Loại Phòng
              </Link>
            </Card>
          </Col>

          {/* Rooms */}
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full rounded-lg"
            >
              <Statistic
                title="Phòng"
                value={counts.roomsCount}
                prefix={<HomeOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
              <Link
                to="/admin/rooms"
                className="text-green-600 hover:text-green-800 text-sm mt-2 block"
              >
                Quản lý Phòng
              </Link>
            </Card>
          </Col>

          {/* Amenities */}
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full rounded-lg"
            >
              <Statistic
                title="Tiện Ích"
                value={counts.amenitiesCount}
                prefix={<HeartOutlined />}
                valueStyle={{ color: "#13c2c2" }}
              />
              <Link
                to="/admin/amenities"
                className="text-cyan-600 hover:text-cyan-800 text-sm mt-2 block"
              >
                Quản lý Tiện Ích
              </Link>
            </Card>
          </Col>

          {/* Services */}
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={false}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full rounded-lg"
            >
              <Statistic
                title="Dịch Vụ"
                value={counts.servicesCount}
                prefix={<ToolOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
              <Link
                to="/admin/services"
                className="text-yellow-600 hover:text-yellow-800 text-sm mt-2 block"
              >
                Quản lý Dịch Vụ
              </Link>
            </Card>
          </Col>
        </Row>
      )}

      {/* 2. HÀNG THỐNG KÊ NGƯỜI DÙNG */}

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8} lg={6}>
          <UserStatsCard />
        </Col>
      </Row>

      {/* 3. BẢNG DỮ LIỆU GẦN ĐÂY (3 CỘT) */}

      <Row gutter={[16, 16]}>
        {/* Recent Room Types */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Title level={4} className="mb-0 text-gray-700">
                Loại Phòng Gần Đây
              </Title>
            }
            bordered={false}
            className="shadow-lg rounded-lg h-full"
          >
            {isLoadingRoomTypes ? (
              <Spin tip="Đang tải loại phòng..." />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={recentRoomTypes}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Link key="edit" to={`/admin/room-types/edit/${item.id}`}>
                        <Button size="small" type="dashed">
                          Edit
                        </Button>
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Text strong>{item.room_type_name}</Text>}
                      description={
                        <small className="text-gray-500">
                          ID: {item.id} · Tối đa khách: {item.max_guests}
                        </small>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
            {!isLoadingRoomTypes && !recentRoomTypes.length && (
              <Text type="secondary">Chưa có loại phòng nào.</Text>
            )}
          </Card>
        </Col>

        {/* Recent Rooms */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Title level={4} className="mb-0 text-gray-700">
                Phòng Gần Đây
              </Title>
            }
            bordered={false}
            className="shadow-lg rounded-lg h-full"
          >
            {isLoadingRooms ? (
              <Spin tip="Đang tải phòng..." />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={recentRooms}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Link key="edit" to={`/admin/rooms/edit/${item.id}`}>
                        <Button size="small" type="default">
                          Edit
                        </Button>
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Text strong>Phòng {item.room_number}</Text>}
                      description={
                        <small>
                          {/* ĐÃ SỬA LỖI TẠI ĐÂY: Truy cập qua item.room_type.room_type_name */}
                          Loại: {item.room_type?.room_type_name || "N/A"} ·
                          Trạng thái:{" "}
                          <Tag color={getStatusColor(item.room_status)}>
                            {item.room_status}
                          </Tag>
                        </small>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
            {!isLoadingRooms && !recentRooms.length && (
              <Text type="secondary">Chưa có phòng nào.</Text>
            )}
          </Card>
        </Col>

        {/* Recent Users */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Title level={4} className="mb-0 text-gray-700">
                Người Dùng Gần Đây
              </Title>
            }
            bordered={false}
            className="shadow-lg rounded-lg h-full"
          >
            {isLoadingUsers ? (
              <Spin tip="Đang tải người dùng..." />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={recentUsers}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Link key="set-role" to={`/admin/users/edit/${item.id}`}>
                        <Button
                          size="small"
                          type="primary"
                          danger={item.role === "Admin"}
                          className="bg-blue-500 hover:bg-blue-600 border-none"
                        >
                          Set Role
                        </Button>
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Text strong>{item.user_name}</Text>}
                      description={
                        <small>
                          {item.email} · Role:{" "}
                          <Tag color={item.role === "Admin" ? "red" : "blue"}>
                            {item.role}
                          </Tag>
                        </small>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
            {!isLoadingUsers && !recentUsers.length && (
              <Text type="secondary">Chưa có người dùng nào.</Text>
>>>>>>> minhnguyet2
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
