import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Spin,
  message,
  Timeline,
  Table,
  Divider,
  Badge,
  Statistic,
  Row,
  Col,
  Space,
  Button,
  Alert,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const API_URL = "http://localhost:8000";

// ============================================
// INTERFACES
// ============================================
interface BookingItem {
  booking_item_id: number;
  room_type_id: number;
  room_type_name: string;
  quantity: number;
  number_of_nights: number;
  base_price: number;
  amount: number;
}

interface ServiceCharge {
  service_id: number;
  service_name: string;
  amount: number;
  quantity: number;
  created_at: string;
}

interface DamageInvoice {
  damage_invoice_id: number;
  damage_type: {
    damage_type_name: string;
  };
  amount: number;
  description: string;
  created_at: string;
}

interface PenaltyCharge {
  penalty_charge_id: number;
  amount: number;
  reason: string;
  created_at: string;
}

interface Payment {
  payment_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
  transaction_id?: string;
}

interface User {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Booking {
  booking_id?: number; // Thêm trường này
  id: number;
  user_id: number;
  user?: User; // Thêm thông tin user
  check_in: string;
  check_out: string;
  nights: number;
  subtotal_price: number;
  voucher_code: string | null;
  voucher_discount: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  adults: number;
  children: number;
  special_requests?: string;

  // Relations
  items: BookingItem[];
  serviceInvoice?: {
    total_amount: number;
    charges: ServiceCharge[];
  };
  damageInvoices: DamageInvoice[];
  penaltyCharges: PenaltyCharge[];
  payments: Payment[];
}

interface Pricing {
  room_total: number;
  service_total: number;
  damage_total: number;
  penalty_total: number;
  grand_total: number;
}

// ============================================
// STATUS CONFIG
// ============================================
const statusConfig: Record<string, { color: string; text: string }> = {
  pending_payment: { color: "orange", text: "Chờ thanh toán" },
  pending: { color: "orange", text: "Chờ xác nhận" },
  confirmed: { color: "blue", text: "Đã xác nhận" },
  paid: { color: "green", text: "Đã thanh toán" },
  check_in: { color: "green", text: "Đã nhận phòng" },
  check_out: { color: "purple", text: "Đã trả phòng" },
  canceled: { color: "red", text: "Đã hủy" },
  completed: { color: "purple", text: "Hoàn thành" },
};

const paymentStatusConfig: Record<string, { color: string; text: string }> = {
  pending: { color: "orange", text: "Chờ xử lý" },
  completed: { color: "green", text: "Hoàn thành" },
  failed: { color: "red", text: "Thất bại" },
  refunded: { color: "purple", text: "Đã hoàn tiền" },
  success: { color: "green", text: "Thành công" },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function BookingShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FORMATTING FUNCTIONS
  // ============================================
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  // ============================================
  // FETCH BOOKING DETAILS
  // ============================================
  const fetchBookingDetails = async () => {
    if (!id) {
      setError("Không tìm thấy ID booking trong URL");
      setLoading(false);
      return;
    }

    console.log("🔍 Fetching booking details for ID:", id);

    setLoading(true);
    setError(null);

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.get(`${API_URL}/api/bookings/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("📦 API Response:", response.data);

      const responseData = response.data?.data;

      if (!responseData) {
        throw new Error("API không trả về dữ liệu");
      }

      // Xác định booking data từ response
      let bookingData: Booking;
      if (responseData.booking) {
        bookingData = responseData.booking;
      } else if (responseData.id || responseData.booking_id) {
        bookingData = responseData;
      } else {
        throw new Error("Cấu trúc dữ liệu không hợp lệ");
      }

      // Xác định pricing data
      let pricingData: Pricing;
      if (responseData.pricing) {
        pricingData = responseData.pricing;
      } else {
        // Tính toán từ booking data
        pricingData = {
          room_total:
            bookingData.items?.reduce((sum, item) => sum + item.amount, 0) || 0,
          service_total: bookingData.serviceInvoice?.total_amount || 0,
          damage_total:
            bookingData.damageInvoices?.reduce(
              (sum, invoice) => sum + invoice.amount,
              0
            ) || 0,
          penalty_total:
            bookingData.penaltyCharges?.reduce(
              (sum, charge) => sum + charge.amount,
              0
            ) || 0,
          grand_total: bookingData.total_price || 0,
        };
      }

      setBooking(bookingData);
      setPricing(pricingData);

      console.log("✅ Booking data loaded:", bookingData);
      console.log("💰 Pricing data:", pricingData);
    } catch (error: any) {
      console.error("❌ Error fetching booking details:", error);

      if (error.response?.status === 404) {
        setError(`Không tìm thấy booking với ID: ${id}`);
      } else if (error.response?.status === 401) {
        setError("Bạn cần đăng nhập để xem thông tin booking");
        navigate("/login");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Lỗi khi tải thông tin booking. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  // ============================================
  // HANDLE ACTIONS
  // ============================================
  const handleConfirmPayment = async () => {
    if (!booking) return;

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      await axios.put(
        `${API_URL}/api/bookings/${
          booking.id || booking.booking_id
        }/confirm-payment`,
        { paid_amount: booking.total_price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Xác nhận thanh toán thành công!");
      fetchBookingDetails(); // Refresh data
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Lỗi khi xác nhận thanh toán"
      );
    }
  };

  const handleSendConfirmationEmail = async () => {
    if (!booking) return;

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      await axios.post(
        `${API_URL}/api/bookings/${
          booking.id || booking.booking_id
        }/send-confirmation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Đã gửi email xác nhận!");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Lỗi khi gửi email");
    }
  };

  // ============================================
  // RENDER LOADING
  // ============================================
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Spin size="large" />
        <div style={{ color: "#666" }}>Đang tải thông tin booking #{id}...</div>
      </div>
    );
  }

  // ============================================
  // RENDER ERROR
  // ============================================
  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Space>
          <Button type="primary" onClick={() => navigate("/admin/bookings")}>
            Quay lại danh sách
          </Button>
          <Button onClick={fetchBookingDetails}>
            <ReloadOutlined /> Thử lại
          </Button>
        </Space>
      </div>
    );
  }

  // ============================================
  // RENDER NO BOOKING FOUND
  // ============================================
  if (!booking) {
    return (
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Alert
          message="Không tìm thấy booking"
          description={`Không tìm thấy booking với ID: ${id}`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Space>
          <Button type="primary" onClick={() => navigate("/admin/bookings")}>
            Quay lại danh sách
          </Button>
          <Button onClick={() => navigate("/admin/dashboard")}>
            Về Dashboard
          </Button>
        </Space>
      </div>
    );
  }

  // ============================================
  // CALCULATED VALUES
  // ============================================
  const displayBookingId = booking.booking_id || booking.id;
  const status = statusConfig[booking.status] || {
    color: "default",
    text: booking.status,
  };
  const totalPaid =
    booking.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const balanceDue = booking.total_price - totalPaid;

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* ============================================
          HEADER SECTION
      ============================================ */}
      <div style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/bookings")}
          >
            Quay lại danh sách
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchBookingDetails}>
            Tải lại
          </Button>
        </Space>

        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ zIndex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Booking #{displayBookingId}
              </h1>
              <div
                style={{
                  color: "rgba(255,255,255,0.9)",
                  marginTop: "8px",
                  fontSize: "16px",
                }}
              >
                <CalendarOutlined style={{ marginRight: 8 }} />
                Tạo ngày: {formatDateTime(booking.created_at)}
              </div>
            </div>

            <div style={{ zIndex: 1 }}>
              <Tag
                color={status.color}
                style={{
                  fontSize: "16px",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                {status.text}
              </Tag>
            </div>
          </div>
        </Card>
      </div>

      <Row gutter={[24, 24]}>
        {/* ============================================
            LEFT COLUMN - MAIN CONTENT
        ============================================ */}
        <Col xs={24} lg={16}>
          {/* TIMELINE */}
          <Card
            title={
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                <ClockCircleOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Timeline & Trạng thái
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Timeline mode="left">
              <Timeline.Item
                color="green"
                label={formatDateTime(booking.created_at)}
              >
                <div style={{ fontWeight: "600" }}>Booking được tạo</div>
                <div style={{ color: "#666" }}>
                  Khách hàng đặt phòng thành công
                </div>
              </Timeline.Item>

              {booking.payments && booking.payments.length > 0 ? (
                <Timeline.Item
                  color="green"
                  label={formatDateTime(booking.payments[0].payment_date)}
                >
                  <div style={{ fontWeight: "600" }}>Thanh toán thành công</div>
                  <div style={{ color: "#666" }}>
                    {formatCurrency(booking.payments[0].amount)}
                    via {booking.payments[0].payment_method}
                  </div>
                </Timeline.Item>
              ) : (
                <Timeline.Item color="gray">
                  <div style={{ fontWeight: "600", color: "#999" }}>
                    Chờ thanh toán
                  </div>
                  <div style={{ color: "#999" }}>
                    Chưa có giao dịch thanh toán
                  </div>
                </Timeline.Item>
              )}

              <Timeline.Item
                color={
                  ["check_in", "check_out", "completed"].includes(
                    booking.status
                  )
                    ? "green"
                    : "gray"
                }
                label={formatDate(booking.check_in)}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: ["check_in", "check_out", "completed"].includes(
                      booking.status
                    )
                      ? "#000"
                      : "#999",
                  }}
                >
                  Nhận phòng
                </div>
                <div
                  style={{
                    color: ["check_in", "check_out", "completed"].includes(
                      booking.status
                    )
                      ? "#666"
                      : "#999",
                  }}
                >
                  {dayjs(booking.check_in).format("dddd, DD/MM/YYYY")}
                </div>
              </Timeline.Item>

              <Timeline.Item
                color={
                  ["check_out", "completed"].includes(booking.status)
                    ? "green"
                    : "gray"
                }
                label={formatDate(booking.check_out)}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: ["check_out", "completed"].includes(booking.status)
                      ? "#000"
                      : "#999",
                  }}
                >
                  Trả phòng
                </div>
                <div
                  style={{
                    color: ["check_out", "completed"].includes(booking.status)
                      ? "#666"
                      : "#999",
                  }}
                >
                  {dayjs(booking.check_out).format("dddd, DD/MM/YYYY")}
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>

          {/* BOOKING DETAILS */}
          <Card
            title={
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                <FileTextOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Thông tin Chi tiết
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Descriptions
                  bordered
                  column={{ xs: 1, sm: 2, md: 3 }}
                  size="middle"
                >
                  <Descriptions.Item label="Mã Booking" span={1}>
                    <strong style={{ color: "#1890ff", fontSize: "18px" }}>
                      #{displayBookingId}
                    </strong>
                  </Descriptions.Item>

                  <Descriptions.Item label="Trạng thái" span={1}>
                    <Tag
                      color={status.color}
                      style={{ fontSize: "14px", padding: "4px 12px" }}
                    >
                      {status.text}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Số đêm" span={1}>
                    <Badge
                      count={booking.nights}
                      style={{
                        backgroundColor: "#52c41a",
                        fontSize: "16px",
                        padding: "4px 8px",
                      }}
                    />
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày nhận phòng" span={1}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {formatDate(booking.check_in)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {dayjs(booking.check_in).format("dddd")}
                        </div>
                      </div>
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày trả phòng" span={1}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {formatDate(booking.check_out)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {dayjs(booking.check_out).format("dddd")}
                        </div>
                      </div>
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item label="Số khách" span={1}>
                    <div>
                      <div>
                        <UserOutlined
                          style={{ marginRight: 8, color: "#666" }}
                        />
                        Người lớn: <strong>{booking.adults}</strong>
                      </div>
                      {booking.children > 0 && (
                        <div style={{ marginTop: 4 }}>
                          Trẻ em: <strong>{booking.children}</strong>
                        </div>
                      )}
                    </div>
                  </Descriptions.Item>

                  {booking.voucher_code && (
                    <Descriptions.Item label="Voucher" span={2}>
                      <Space>
                        <Tag color="green" style={{ fontSize: "14px" }}>
                          {booking.voucher_code}
                        </Tag>
                        <span style={{ color: "#52c41a", fontWeight: "500" }}>
                          Giảm: {formatCurrency(booking.voucher_discount)}
                        </span>
                      </Space>
                    </Descriptions.Item>
                  )}

                  {booking.special_requests && (
                    <Descriptions.Item label="Yêu cầu đặc biệt" span={3}>
                      <div
                        style={{
                          padding: "12px",
                          background: "#f6ffed",
                          borderRadius: "6px",
                          border: "1px solid #b7eb8f",
                        }}
                      >
                        {booking.special_requests}
                      </div>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* ROOM DETAILS */}
          <Card
            title={
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                <HomeOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Chi tiết Phòng Đặt
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Table
              dataSource={booking.items}
              rowKey="booking_item_id"
              pagination={false}
              size="middle"
              scroll={{ x: 800 }}
              columns={[
                {
                  title: "Loại phòng",
                  dataIndex: "room_type_name",
                  key: "room_type_name",
                  width: 200,
                  render: (text) => (
                    <div style={{ fontWeight: "600", color: "#1890ff" }}>
                      {text}
                    </div>
                  ),
                },
                {
                  title: "Số lượng",
                  dataIndex: "quantity",
                  key: "quantity",
                  width: 100,
                  align: "center" as const,
                  render: (quantity) => (
                    <Badge
                      count={quantity}
                      style={{
                        backgroundColor: "#1890ff",
                        fontSize: "14px",
                        padding: "4px 8px",
                      }}
                    />
                  ),
                },
                {
                  title: "Số đêm",
                  dataIndex: "number_of_nights",
                  key: "number_of_nights",
                  width: 100,
                  align: "center" as const,
                  render: (nights) => (
                    <Badge
                      count={nights}
                      style={{
                        backgroundColor: "#fa8c16",
                        fontSize: "14px",
                        padding: "4px 8px",
                      }}
                    />
                  ),
                },
                {
                  title: "Giá/đêm",
                  dataIndex: "base_price",
                  key: "base_price",
                  width: 150,
                  align: "right" as const,
                  render: (price) => (
                    <div style={{ fontWeight: "500" }}>
                      {formatCurrency(price)}
                    </div>
                  ),
                },
                {
                  title: "Tổng",
                  dataIndex: "amount",
                  key: "amount",
                  width: 150,
                  align: "right" as const,
                  render: (amount) => (
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1890ff",
                        fontSize: "15px",
                      }}
                    >
                      {formatCurrency(amount)}
                    </div>
                  ),
                },
              ]}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row
                    style={{ background: "#fafafa", fontWeight: "600" }}
                  >
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <div style={{ textAlign: "right" }}>Tổng tiền phòng:</div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2} align="right">
                      <div
                        style={{
                          color: "#1890ff",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        {formatCurrency(pricing?.room_total || 0)}
                      </div>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>

          {/* SERVICES */}
          {booking.serviceInvoice?.charges &&
            booking.serviceInvoice.charges.length > 0 && (
              <Card
                title={
                  <span style={{ fontWeight: "600", fontSize: "16px" }}>
                    <EnvironmentOutlined
                      style={{ marginRight: "8px", color: "#1890ff" }}
                    />
                    Dịch vụ Sử dụng
                  </span>
                }
                style={{
                  marginBottom: "24px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <Table
                  dataSource={booking.serviceInvoice.charges}
                  rowKey="service_id"
                  pagination={false}
                  size="middle"
                  columns={[
                    {
                      title: "Dịch vụ",
                      dataIndex: "service_name",
                      key: "service_name",
                      width: 200,
                    },
                    {
                      title: "Số lượng",
                      dataIndex: "quantity",
                      key: "quantity",
                      width: 100,
                      align: "center" as const,
                    },
                    {
                      title: "Đơn giá",
                      dataIndex: "amount",
                      key: "amount",
                      width: 150,
                      align: "right" as const,
                      render: (amount, record) => (
                        <div>
                          {formatCurrency(amount / (record.quantity || 1))}
                        </div>
                      ),
                    },
                    {
                      title: "Thành tiền",
                      dataIndex: "amount",
                      key: "amount",
                      width: 150,
                      align: "right" as const,
                      render: (amount) => (
                        <div style={{ fontWeight: "500", color: "#722ed1" }}>
                          {formatCurrency(amount)}
                        </div>
                      ),
                    },
                    {
                      title: "Ngày sử dụng",
                      dataIndex: "created_at",
                      key: "created_at",
                      width: 180,
                      render: (date) => formatDateTime(date),
                    },
                  ]}
                  summary={() => (
                    <Table.Summary.Row
                      style={{ background: "#fafafa", fontWeight: "600" }}
                    >
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <div style={{ textAlign: "right" }}>
                          Tổng tiền dịch vụ:
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={2} align="right">
                        <div
                          style={{
                            color: "#722ed1",
                            fontSize: "18px",
                            fontWeight: "700",
                          }}
                        >
                          {formatCurrency(pricing?.service_total || 0)}
                        </div>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </Card>
            )}

          {/* ADDITIONAL CHARGES */}
          {(booking.damageInvoices?.length > 0 ||
            booking.penaltyCharges?.length > 0) && (
            <Card
              title={
                <span style={{ fontWeight: "600", fontSize: "16px" }}>
                  <ExclamationCircleOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  Phụ phí & Bồi thường
                </span>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Damage Invoices */}
              {booking.damageInvoices?.length > 0 && (
                <>
                  <Divider orientation="left" style={{ fontWeight: "600" }}>
                    Hư hỏng
                  </Divider>
                  <Table
                    dataSource={booking.damageInvoices}
                    rowKey="damage_invoice_id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Loại hư hỏng",
                        dataIndex: ["damage_type", "damage_type_name"],
                        key: "damage_type_name",
                      },
                      {
                        title: "Mô tả",
                        dataIndex: "description",
                        key: "description",
                      },
                      {
                        title: "Số tiền",
                        dataIndex: "amount",
                        key: "amount",
                        align: "right" as const,
                        render: (amount) => (
                          <div style={{ color: "#fa8c16", fontWeight: "500" }}>
                            {formatCurrency(amount)}
                          </div>
                        ),
                      },
                      {
                        title: "Ngày ghi nhận",
                        dataIndex: "created_at",
                        key: "created_at",
                        render: (date) => formatDateTime(date),
                      },
                    ]}
                  />
                </>
              )}

              {/* Penalty Charges */}
              {booking.penaltyCharges?.length > 0 && (
                <>
                  <Divider orientation="left" style={{ fontWeight: "600" }}>
                    Phạt
                  </Divider>
                  <Table
                    dataSource={booking.penaltyCharges}
                    rowKey="penalty_charge_id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Lý do",
                        dataIndex: "reason",
                        key: "reason",
                      },
                      {
                        title: "Số tiền",
                        dataIndex: "amount",
                        key: "amount",
                        align: "right" as const,
                        render: (amount) => (
                          <div style={{ color: "#fa541c", fontWeight: "500" }}>
                            {formatCurrency(amount)}
                          </div>
                        ),
                      },
                      {
                        title: "Ngày ghi nhận",
                        dataIndex: "created_at",
                        key: "created_at",
                        render: (date) => formatDateTime(date),
                      },
                    ]}
                  />
                </>
              )}
            </Card>
          )}
        </Col>

        {/* ============================================
            RIGHT COLUMN - SUMMARY & ACTIONS
        ============================================ */}
        <Col xs={24} lg={8}>
          {/* CUSTOMER INFO */}
          <Card
            title={
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                <UserOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Thông tin Khách hàng
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {booking.user ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: 4,
                    }}
                  >
                    {booking.user.name}
                  </div>
                  <div style={{ color: "#666", marginBottom: 8 }}>
                    <MailOutlined style={{ marginRight: 8 }} />
                    {booking.user.email}
                  </div>
                  {booking.user.phone && (
                    <div style={{ color: "#666" }}>
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {booking.user.phone}
                    </div>
                  )}
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div style={{ fontSize: "12px", color: "#999" }}>
                  User ID: {booking.user.user_id}
                </div>
              </div>
            ) : (
              <div
                style={{
                  color: "#999",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                Không có thông tin khách hàng
              </div>
            )}
          </Card>

          {/* PAYMENT SUMMARY */}
          <Card
            title={
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                <DollarOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Tổng hợp Thanh toán
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ padding: "8px 0" }}>
              <Row gutter={[8, 16]} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <div style={{ color: "#666" }}>Tiền phòng:</div>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "500" }}>
                    {formatCurrency(pricing?.room_total || 0)}
                  </div>
                </Col>

                {pricing?.service_total && pricing.service_total > 0 && (
                  <>
                    <Col span={12}>
                      <div style={{ color: "#666" }}>Dịch vụ:</div>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "500", color: "#722ed1" }}>
                        {formatCurrency(pricing.service_total)}
                      </div>
                    </Col>
                  </>
                )}

                {pricing?.damage_total && pricing.damage_total > 0 && (
                  <>
                    <Col span={12}>
                      <div style={{ color: "#666" }}>Hư hỏng:</div>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "500", color: "#fa8c16" }}>
                        {formatCurrency(pricing.damage_total)}
                      </div>
                    </Col>
                  </>
                )}

                {pricing?.penalty_total && pricing.penalty_total > 0 && (
                  <>
                    <Col span={12}>
                      <div style={{ color: "#666" }}>Phạt:</div>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "500", color: "#fa541c" }}>
                        {formatCurrency(pricing.penalty_total)}
                      </div>
                    </Col>
                  </>
                )}

                {booking.voucher_discount > 0 && (
                  <>
                    <Col span={12}>
                      <div style={{ color: "#666" }}>Giảm giá:</div>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "500", color: "#52c41a" }}>
                        -{formatCurrency(booking.voucher_discount)}
                      </div>
                    </Col>
                  </>
                )}
              </Row>

              <Divider style={{ margin: "16px 0" }} />

              <Row style={{ marginBottom: 8 }}>
                <Col span={12}>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>
                    Tổng cộng:
                  </div>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#1890ff",
                    }}
                  >
                    {formatCurrency(
                      pricing?.grand_total || booking.total_price
                    )}
                  </div>
                </Col>
              </Row>

              <Row style={{ marginTop: 16 }}>
                <Col span={12}>
                  <div style={{ color: "#666" }}>Đã thanh toán:</div>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "500", color: "#52c41a" }}>
                    {formatCurrency(totalPaid)}
                  </div>
                </Col>
              </Row>

              {balanceDue > 0 && (
                <Row style={{ marginTop: 8 }}>
                  <Col span={12}>
                    <div style={{ color: "#666" }}>Còn lại:</div>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "600", color: "#fa541c" }}>
                      {formatCurrency(balanceDue)}
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </Card>

          {/* PAYMENT HISTORY */}
          <Card
            title={
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                <CreditCardOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Lịch sử Thanh toán
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {booking.payments && booking.payments.length > 0 ? (
              <div>
                {booking.payments.map((payment) => {
                  const paymentStatus = paymentStatusConfig[payment.status] || {
                    color: "default",
                    text: payment.status,
                  };

                  return (
                    <div
                      key={payment.payment_id}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #f0f0f0",
                        marginBottom: "8px",
                        borderRadius: "6px",
                        background: "#fafafa",
                      }}
                    >
                      <Row gutter={8}>
                        <Col span={16}>
                          <div style={{ fontWeight: "500" }}>
                            {formatDateTime(payment.payment_date)}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: 4,
                            }}
                          >
                            {payment.payment_method}
                            {payment.transaction_id &&
                              ` • ${payment.transaction_id}`}
                          </div>
                        </Col>
                        <Col span={8} style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: "600", marginBottom: 4 }}>
                            {formatCurrency(payment.amount)}
                          </div>
                          <Tag
                            color={paymentStatus.color}
                            style={{ fontSize: "12px", padding: "2px 6px" }}
                          >
                            {paymentStatus.text}
                          </Tag>
                        </Col>
                      </Row>
                    </div>
                  );
                })}

                <Divider style={{ margin: "12px 0" }} />
                <Row>
                  <Col span={12}>
                    <div style={{ fontWeight: "600" }}>Tổng đã thanh toán:</div>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#52c41a",
                      }}
                    >
                      {formatCurrency(totalPaid)}
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#999",
                }}
              >
                <CreditCardOutlined
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    color: "#d9d9d9",
                  }}
                />
                <div style={{ fontSize: "16px" }}>Chưa có thanh toán</div>
              </div>
            )}
          </Card>

          {/* ACTIONS */}
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                block
                size="large"
                onClick={() =>
                  navigate(`/admin/bookings/${displayBookingId}/invoice`)
                }
                style={{ height: "48px", fontSize: "16px" }}
              >
                📄 Xuất Hóa đơn
              </Button>

              <Button
                type="default"
                block
                size="large"
                onClick={handleSendConfirmationEmail}
                icon={<MailOutlined />}
                style={{ height: "48px", fontSize: "16px" }}
              >
                Gửi Email Xác nhận
              </Button>

              {booking.status === "pending_payment" && (
                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  onClick={handleConfirmPayment}
                  icon={<DollarOutlined />}
                  style={{ height: "48px", fontSize: "16px" }}
                >
                  ✅ Xác nhận Thanh toán
                </Button>
              )}

              <Button
                block
                size="large"
                onClick={() => navigate("/admin/bookings")}
                style={{ height: "48px", fontSize: "16px" }}
              >
                ↩️ Quay lại Danh sách
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* DEBUG INFO - Remove in production */}
      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#f6ffed",
          border: "1px solid #b7eb8f",
          borderRadius: "6px",
          fontSize: "12px",
        }}
      >
        <strong>Debug Info:</strong> Booking ID: {id} | Display ID:{" "}
        {displayBookingId} | Status: {booking.status} | Total:{" "}
        {formatCurrency(booking.total_price)}
      </div>
    </div>
  );
}
