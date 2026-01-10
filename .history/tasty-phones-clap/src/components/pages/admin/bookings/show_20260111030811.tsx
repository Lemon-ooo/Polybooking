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
} from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const API_URL = "http://localhost:8000";

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

interface Booking {
  id: number;
  user_id: number;
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

  // Pricing summary from API
  pricing?: {
    room_total: number;
    service_total: number;
    damage_total: number;
    penalty_total: number;
    grand_total: number;
  };
}

interface Pricing {
  room_total: number;
  service_total: number;
  damage_total: number;
  penalty_total: number;
  grand_total: number;
}

export default function BookingShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);

  // ===============================
  // FETCH BOOKING DETAILS
  // ===============================
  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.get(`${API_URL}/api/bookings/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("Booking Details API Response:", response.data);

      // API trả về { data: { booking: {...}, pricing: {...} } }
      const responseData = response.data?.data;

      if (responseData) {
        // Xử lý booking data
        let bookingData: Booking;
        if (responseData.booking) {
          bookingData = responseData.booking;
        } else {
          bookingData = responseData;
        }

        // Xử lý pricing data
        let pricingData: Pricing;
        if (responseData.pricing) {
          pricingData = responseData.pricing;
        } else {
          // Tính toán từ booking data nếu API không trả về pricing
          pricingData = {
            room_total:
              bookingData.items?.reduce((sum, item) => sum + item.amount, 0) ||
              0,
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
      } else {
        message.error("Không tìm thấy thông tin booking");
        navigate("/bookings");
      }
    } catch (error: any) {
      console.error("Error fetching booking details:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi tải thông tin booking"
      );
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STATUS CONFIGURATION
  // ===============================
  const statusConfig: Record<string, { color: string; text: string }> = {
    pending_payment: { color: "orange", text: "Chờ thanh toán" },
    pending: { color: "orange", text: "Chờ xác nhận" },
    confirmed: { color: "blue", text: "Đã xác nhận" },
    paid: { color: "green", text: "Đã thanh toán" },
    check_in: { color: "green", text: "Đã nhận phòng" },
    check_out: { color: "purple", text: "Đã trả phòng" },
    canceled: { color: "red", text: "Đã hủy" },
  };

  // ===============================
  // PAYMENT STATUS CONFIGURATION
  // ===============================
  const paymentStatusConfig: Record<string, { color: string; text: string }> = {
    pending: { color: "orange", text: "Chờ xử lý" },
    completed: { color: "green", text: "Hoàn thành" },
    failed: { color: "red", text: "Thất bại" },
    refunded: { color: "purple", text: "Đã hoàn tiền" },
  };

  // ===============================
  // FORMAT CURRENCY
  // ===============================
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // ===============================
  // FORMAT DATE TIME
  // ===============================
  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Không tìm thấy booking</h2>
        <Button type="primary" onClick={() => navigate("/bookings")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header with Booking ID */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
              Booking #{booking.id}
            </h1>
            <div style={{ color: "#666", marginTop: "8px" }}>
              Tạo ngày: {formatDateTime(booking.created_at)}
            </div>
          </div>
          <div>
            <Tag
              color={statusConfig[booking.status]?.color || "default"}
              style={{
                fontSize: "16px",
                padding: "8px 16px",
                borderRadius: "20px",
              }}
            >
              {statusConfig[booking.status]?.text || booking.status}
            </Tag>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left Column - Booking Information */}
        <Col xs={24} lg={16}>
          {/* Booking Timeline */}
          <Card
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: "8px" }} />
                Timeline
              </span>
            }
            style={{ marginBottom: "24px", borderRadius: "12px" }}
          >
            <Timeline>
              <Timeline.Item color="green">
                <div style={{ fontWeight: "500" }}>Tạo booking</div>
                <div style={{ color: "#666" }}>
                  {formatDateTime(booking.created_at)}
                </div>
              </Timeline.Item>

              <Timeline.Item
                color={booking.status === "paid" ? "green" : "gray"}
              >
                <div style={{ fontWeight: "500" }}>Thanh toán</div>
                <div style={{ color: "#666" }}>
                  {booking.payments && booking.payments.length > 0
                    ? formatDateTime(booking.payments[0].payment_date)
                    : "Chưa thanh toán"}
                </div>
              </Timeline.Item>

              <Timeline.Item
                color={
                  booking.status === "check_in" ||
                  booking.status === "check_out"
                    ? "green"
                    : "gray"
                }
              >
                <div style={{ fontWeight: "500" }}>Nhận phòng</div>
                <div style={{ color: "#666" }}>
                  {dayjs(booking.check_in).format("DD/MM/YYYY")}
                </div>
              </Timeline.Item>

              <Timeline.Item
                color={booking.status === "check_out" ? "green" : "gray"}
              >
                <div style={{ fontWeight: "500" }}>Trả phòng</div>
                <div style={{ color: "#666" }}>
                  {dayjs(booking.check_out).format("DD/MM/YYYY")}
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>

          {/* Booking Details */}
          <Card
            title={
              <span>
                <FileTextOutlined style={{ marginRight: "8px" }} />
                Thông tin Booking
              </span>
            }
            style={{ marginBottom: "24px", borderRadius: "12px" }}
          >
            <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
              <Descriptions.Item label="Mã Booking">
                <strong style={{ color: "#1890ff" }}>#{booking.id}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag color={statusConfig[booking.status]?.color}>
                  {statusConfig[booking.status]?.text}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày nhận phòng">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CalendarOutlined />
                  {dayjs(booking.check_in).format("dddd, DD/MM/YYYY")}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày trả phòng">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CalendarOutlined />
                  {dayjs(booking.check_out).format("dddd, DD/MM/YYYY")}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Số đêm">
                <Badge
                  count={booking.nights}
                  style={{ backgroundColor: "#52c41a", fontSize: "14px" }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Số khách">
                <div>
                  <div>Người lớn: {booking.adults}</div>
                  {booking.children > 0 && (
                    <div>Trẻ em: {booking.children}</div>
                  )}
                </div>
              </Descriptions.Item>

              {booking.special_requests && (
                <Descriptions.Item label="Yêu cầu đặc biệt" span={2}>
                  {booking.special_requests}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Voucher">
                {booking.voucher_code ? (
                  <div>
                    <Tag color="green">{booking.voucher_code}</Tag>
                    <div style={{ color: "#52c41a", marginTop: "4px" }}>
                      Giảm: {formatCurrency(booking.voucher_discount)}
                    </div>
                  </div>
                ) : (
                  "Không sử dụng"
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Room Details */}
          <Card
            title={
              <span>
                <HomeOutlined style={{ marginRight: "8px" }} />
                Chi tiết Phòng
              </span>
            }
            style={{ marginBottom: "24px", borderRadius: "12px" }}
          >
            <Table
              dataSource={booking.items}
              rowKey="booking_item_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Loại phòng",
                  dataIndex: "room_type_name",
                  key: "room_type_name",
                  render: (text) => <strong>{text}</strong>,
                },
                {
                  title: "Số lượng",
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "center" as const,
                  render: (quantity) => (
                    <Badge
                      count={quantity}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  ),
                },
                {
                  title: "Số đêm",
                  dataIndex: "number_of_nights",
                  key: "number_of_nights",
                  align: "center" as const,
                  render: (nights) => (
                    <Badge
                      count={nights}
                      style={{ backgroundColor: "#fa8c16" }}
                    />
                  ),
                },
                {
                  title: "Giá/đêm",
                  dataIndex: "base_price",
                  key: "base_price",
                  align: "right" as const,
                  render: (price) => formatCurrency(price),
                },
                {
                  title: "Thành tiền",
                  dataIndex: "amount",
                  key: "amount",
                  align: "right" as const,
                  render: (amount) => (
                    <strong style={{ color: "#1890ff", fontSize: "14px" }}>
                      {formatCurrency(amount)}
                    </strong>
                  ),
                },
              ]}
              summary={() => (
                <Table.Summary.Row style={{ background: "#fafafa" }}>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>Tổng tiền phòng</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={2} align="right">
                    <strong style={{ color: "#1890ff", fontSize: "16px" }}>
                      {formatCurrency(pricing?.room_total || 0)}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>

          {/* Services */}
          {booking.serviceInvoice?.charges &&
            booking.serviceInvoice.charges.length > 0 && (
              <Card
                title={
                  <span>
                    <EnvironmentOutlined style={{ marginRight: "8px" }} />
                    Dịch vụ Sử dụng
                  </span>
                }
                style={{ marginBottom: "24px", borderRadius: "12px" }}
              >
                <Table
                  dataSource={booking.serviceInvoice.charges}
                  rowKey="service_id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: "Dịch vụ",
                      dataIndex: "service_name",
                      key: "service_name",
                    },
                    {
                      title: "Số lượng",
                      dataIndex: "quantity",
                      key: "quantity",
                      align: "center" as const,
                    },
                    {
                      title: "Thành tiền",
                      dataIndex: "amount",
                      key: "amount",
                      align: "right" as const,
                      render: (amount) => formatCurrency(amount),
                    },
                    {
                      title: "Ngày sử dụng",
                      dataIndex: "created_at",
                      key: "created_at",
                      render: (date) => formatDateTime(date),
                    },
                  ]}
                  summary={() => (
                    <Table.Summary.Row style={{ background: "#fafafa" }}>
                      <Table.Summary.Cell index={0} colSpan={2}>
                        <strong>Tổng tiền dịch vụ</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={2} align="right">
                        <strong style={{ color: "#1890ff", fontSize: "16px" }}>
                          {formatCurrency(pricing?.service_total || 0)}
                        </strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </Card>
            )}

          {/* Additional Charges */}
          {(booking.damageInvoices?.length > 0 ||
            booking.penaltyCharges?.length > 0) && (
            <Card
              title={
                <span>
                  <ExclamationCircleOutlined style={{ marginRight: "8px" }} />
                  Phụ phí & Bồi thường
                </span>
              }
              style={{ marginBottom: "24px", borderRadius: "12px" }}
            >
              {/* Damage Invoices */}
              {booking.damageInvoices?.length > 0 && (
                <>
                  <Divider orientation="left">Hư hỏng</Divider>
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
                        render: (amount) => formatCurrency(amount),
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
                  <Divider orientation="left">Phạt</Divider>
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
                        render: (amount) => formatCurrency(amount),
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

        {/* Right Column - Summary & Payments */}
        <Col xs={24} lg={8}>
          {/* Pricing Summary */}
          <Card
            title={
              <span>
                <DollarOutlined style={{ marginRight: "8px" }} />
                Tổng hợp Thanh toán
              </span>
            }
            style={{ marginBottom: "24px", borderRadius: "12px" }}
          >
            <div style={{ marginBottom: "16px" }}>
              <Statistic
                title="Tổng tiền phòng"
                value={pricing?.room_total || 0}
                precision={0}
                valueStyle={{ color: "#1890ff", fontSize: "18px" }}
                formatter={(value) => formatCurrency(value as number)}
              />
            </div>

            {pricing?.service_total && pricing.service_total > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <Statistic
                  title="Dịch vụ"
                  value={pricing.service_total}
                  precision={0}
                  valueStyle={{ color: "#722ed1", fontSize: "16px" }}
                  formatter={(value) => formatCurrency(value as number)}
                />
              </div>
            )}

            {pricing?.damage_total && pricing.damage_total > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <Statistic
                  title="Hư hỏng"
                  value={pricing.damage_total}
                  precision={0}
                  valueStyle={{ color: "#fa8c16", fontSize: "16px" }}
                  formatter={(value) => formatCurrency(value as number)}
                />
              </div>
            )}

            {pricing?.penalty_total && pricing.penalty_total > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <Statistic
                  title="Phạt"
                  value={pricing.penalty_total}
                  precision={0}
                  valueStyle={{ color: "#fa541c", fontSize: "16px" }}
                  formatter={(value) => formatCurrency(value as number)}
                />
              </div>
            )}

            {booking.voucher_discount > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <Statistic
                  title={`Giảm giá (${booking.voucher_code})`}
                  value={booking.voucher_discount}
                  precision={0}
                  valueStyle={{ color: "#52c41a", fontSize: "16px" }}
                  formatter={(value) => `-${formatCurrency(value as number)}`}
                />
              </div>
            )}

            <Divider />

            <div style={{ marginBottom: "16px" }}>
              <Statistic
                title="Tổng thanh toán"
                value={pricing?.grand_total || booking.total_price}
                precision={0}
                valueStyle={{
                  color: "#1890ff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                formatter={(value) => formatCurrency(value as number)}
              />
            </div>
          </Card>

          {/* Payments */}
          <Card
            title={
              <span>
                <CreditCardOutlined style={{ marginRight: "8px" }} />
                Lịch sử Thanh toán
              </span>
            }
            style={{ marginBottom: "24px", borderRadius: "12px" }}
          >
            {booking.payments && booking.payments.length > 0 ? (
              <Table
                dataSource={booking.payments}
                rowKey="payment_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Ngày",
                    dataIndex: "payment_date",
                    key: "payment_date",
                    render: (date) => formatDateTime(date),
                    width: "40%",
                  },
                  {
                    title: "Số tiền",
                    dataIndex: "amount",
                    key: "amount",
                    render: (amount) => formatCurrency(amount),
                    width: "30%",
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                      <Tag
                        color={paymentStatusConfig[status]?.color || "default"}
                      >
                        {paymentStatusConfig[status]?.text || status}
                      </Tag>
                    ),
                    width: "30%",
                  },
                ]}
                summary={() => (
                  <Table.Summary.Row style={{ background: "#fafafa" }}>
                    <Table.Summary.Cell index={0}>
                      <strong>Tổng đã thanh toán</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2} align="right">
                      <strong style={{ color: "#52c41a", fontSize: "16px" }}>
                        {formatCurrency(
                          booking.payments.reduce(
                            (sum, payment) => sum + payment.amount,
                            0
                          )
                        )}
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            ) : (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#999" }}
              >
                <CreditCardOutlined
                  style={{ fontSize: "32px", marginBottom: "8px" }}
                />
                <div>Chưa có thanh toán</div>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <Card
            style={{ borderRadius: "12px" }}
            bodyStyle={{ padding: "16px" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                block
                size="large"
                onClick={() => navigate(`/bookings/${id}/invoice`)}
              >
                Xuất Hóa đơn
              </Button>

              <Button block size="large" onClick={() => navigate("/bookings")}>
                Quay lại Danh sách
              </Button>

              {booking.status === "pending_payment" && (
                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  onClick={() => {
                    // Handle payment confirmation
                    message.info("Chức năng xác nhận thanh toán");
                  }}
                >
                  Xác nhận Thanh toán
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
