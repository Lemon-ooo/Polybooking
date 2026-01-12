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
  Modal,
  Dropdown,
  Menu,
  Tooltip,
  Form,
  Input,
  InputNumber,
  Select,
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
  DownloadOutlined,
  SendOutlined,
  EyeOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const API_URL = "http://localhost:8000";
const { Option } = Select;

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
  id?: number;
  payment_id?: number;
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
  booking_id?: number;
  id: number;
  user_id: number;
  user?: User;
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

interface InvoiceStatus {
  exists: boolean;
  code?: string;
  issued_at?: string;
}

interface DamageType {
  id: number;
  name: string;
  default_amount: number;
  description?: string;
}

interface PenaltyFormData {
  damage_type_id: number;
  amount: number;
  note: string;
}

// ============================================
// STATUS CONFIG
// ============================================
const statusConfig: Record<string, { color: string; text: string }> = {
  pending: { color: "orange", text: "Chờ xác nhận" },
  pending_payment: { color: "orange", text: "Chờ thanh toán" },
  confirmed: { color: "blue", text: "Đã xác nhận" },
  paid: { color: "green", text: "Đã thanh toán" },
  check_in: { color: "green", text: "Đã nhận phòng" },
  check_out: { color: "purple", text: "Đã trả phòng" },
  completed: { color: "purple", text: "Hoàn thành" },
  canceled: { color: "red", text: "Đã hủy" },
};

const paymentStatusConfig: Record<string, { color: string; text: string }> = {
  pending: { color: "orange", text: "Chờ xử lý" },
  completed: { color: "green", text: "Hoàn thành" },
  success: { color: "green", text: "Thành công" },
  failed: { color: "red", text: "Thất bại" },
  refunded: { color: "purple", text: "Đã hoàn tiền" },
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
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>({
    exists: false,
  });
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // Thêm state cho modal phạt
  const [penaltyModalVisible, setPenaltyModalVisible] = useState(false);
  const [penaltyLoading, setPenaltyLoading] = useState(false);
  const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);
  const [form] = Form.useForm();

  // State cho danh sách phạt
  const [penalties, setPenalties] = useState<PenaltyFormData[]>([
    { damage_type_id: 0, amount: 0, note: "" },
  ]);

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

      // Check invoice status
      await checkInvoiceStatus(bookingData.id || bookingData.booking_id, token);

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

  // Check invoice status
  const checkInvoiceStatus = async (
    bookingId: number,
    token: string | null
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bookings/${bookingId}/invoice/check`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (response.data.exists) {
        setInvoiceStatus({
          exists: true,
          code: response.data.invoice_code,
          issued_at: response.data.issued_at,
        });
      } else {
        setInvoiceStatus({ exists: false });
      }
    } catch (error) {
      console.log("No invoice check API or error checking");
      setInvoiceStatus({ exists: false });
    }
  };

  // Fetch damage types
  const fetchDamageTypes = async () => {
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.get(`${API_URL}/api/damage-types`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        setDamageTypes(response.data.data || []);
      } else {
        message.error("Không thể tải danh sách loại hư hỏng");
      }
    } catch (error: any) {
      console.error("Error fetching damage types:", error);
      message.error("Lỗi khi tải danh sách loại hư hỏng");
    }
  };

  // Open penalty modal
  const showPenaltyModal = () => {
    if (!booking) return;

    // Chỉ cho phép khi booking đang ở trạng thái checked_in
    if (booking.status !== "checked_in") {
      message.warning(
        "Chỉ có thể ghi nhận phạt khi khách đang lưu trú (trạng thái checked_in)"
      );
      return;
    }

    setPenaltyModalVisible(true);
    fetchDamageTypes();
    // Reset form
    setPenalties([{ damage_type_id: 0, amount: 0, note: "" }]);
    form.resetFields();
  };

  // Handle penalty form changes
  const handlePenaltyChange = (
    index: number,
    field: keyof PenaltyFormData,
    value: any
  ) => {
    const newPenalties = [...penalties];
    newPenalties[index][field] = value;
    setPenalties(newPenalties);
  };

  // Add new penalty line
  const addPenaltyLine = () => {
    setPenalties([...penalties, { damage_type_id: 0, amount: 0, note: "" }]);
  };

  // Remove penalty line
  const removePenaltyLine = (index: number) => {
    if (penalties.length > 1) {
      const newPenalties = [...penalties];
      newPenalties.splice(index, 1);
      setPenalties(newPenalties);
    }
  };

  // Submit penalties
  const handleAddPenalties = async () => {
    if (!booking || !id) return;

    // Validate
    const hasEmptyDamageType = penalties.some((p) => !p.damage_type_id);
    if (hasEmptyDamageType) {
      message.error("Vui lòng chọn loại hư hỏng cho tất cả các dòng");
      return;
    }

    setPenaltyLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.post(
        `${API_URL}/api/admin/bookings/${id}/penalties`,
        {
          penalties: penalties.map((p) => ({
            damage_type_id: p.damage_type_id,
            amount: p.amount || null, // Gửi null nếu amount là 0 để backend dùng default_amount
            note: p.note || null,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success("Ghi nhận phạt thành công!");
        setPenaltyModalVisible(false);
        fetchBookingDetails(); // Refresh data
      } else {
        message.error(response.data.error?.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("Error adding penalties:", error);

      if (error.response?.status === 403) {
        message.error("Bạn không có quyền thực hiện hành động này");
      } else if (
        error.response?.data?.error?.code === "INVALID_BOOKING_STATUS"
      ) {
        message.error("Chỉ có thể ghi nhận phạt khi khách đang lưu trú");
      } else if (error.response?.data?.error?.details) {
        // Validation errors
        const errors = error.response.data.error.details;
        const firstError = Object.values(errors)[0];
        message.error(
          Array.isArray(firstError) ? firstError[0] : "Dữ liệu không hợp lệ"
        );
      } else {
        message.error(
          error.response?.data?.error?.message || "Không thể ghi nhận phạt"
        );
      }
    } finally {
      setPenaltyLoading(false);
    }
  };

  // Auto-fill amount when damage type changes
  const handleDamageTypeChange = (index: number, damageTypeId: number) => {
    const damageType = damageTypes.find((dt) => dt.id === damageTypeId);
    if (damageType && damageType.default_amount > 0) {
      handlePenaltyChange(index, "amount", damageType.default_amount);
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
      fetchBookingDetails();
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
  // INVOICE FUNCTIONS
  // ============================================
  const handleExportInvoice = async () => {
    if (!booking) return;

    setInvoiceLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      message.loading({
        content: "Đang tạo và gửi hóa đơn...",
        key: "invoice",
        duration: 0,
      });

      const response = await axios.post(
        `${API_URL}/api/bookings/${
          booking.id || booking.booking_id
        }/invoice/store-and-send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Invoice API Response:", response.data);

      if (response.data.success) {
        message.success({
          content:
            response.data.message ||
            "Hóa đơn đã được tạo và gửi email thành công!",
          key: "invoice",
          duration: 4,
        });

        // Update invoice status
        setInvoiceStatus({
          exists: true,
          code: response.data.invoice_code,
          issued_at: new Date().toISOString(),
        });

        // Open PDF in new tab
        if (response.data.pdf_url) {
          setTimeout(() => {
            window.open(response.data.pdf_url, "_blank");
          }, 1000);
        }
      } else {
        message.error({
          content: response.data.message || "Có lỗi xảy ra khi tạo hóa đơn",
          key: "invoice",
        });
      }
    } catch (error: any) {
      console.error("Error exporting invoice:", error);
      message.error({
        content: error.response?.data?.message || "Lỗi khi xuất hóa đơn",
        key: "invoice",
      });
    } finally {
      setInvoiceLoading(false);
      setInvoiceModalVisible(false);
    }
  };

  const handleSendInvoiceEmail = async () => {
    if (!booking) return;

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      message.loading({
        content: "Đang gửi email hóa đơn...",
        key: "invoice_email",
        duration: 0,
      });

      const response = await axios.post(
        `${API_URL}/api/bookings/${
          booking.id || booking.booking_id
        }/invoice/send-mail`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Send invoice email response:", response.data);

      if (response.data.success) {
        message.success({
          content:
            response.data.message || "Email hóa đơn đã được gửi thành công!",
          key: "invoice_email",
          duration: 4,
        });
      } else {
        message.error({
          content: response.data.message || "Có lỗi xảy ra khi gửi email",
          key: "invoice_email",
        });
      }
    } catch (error: any) {
      console.error("Error sending invoice email:", error);
      message.error({
        content: error.response?.data?.message || "Lỗi khi gửi email hóa đơn",
        key: "invoice_email",
      });
    }
  };

  const showInvoiceModal = () => {
    setInvoiceModalVisible(true);
  };

  const handleInvoiceConfirm = () => {
    handleExportInvoice();
  };

  const handlePreviewInvoice = () => {
    if (!booking) return;
    window.open(
      `${API_URL}/api/bookings/${booking.id || booking.booking_id}/invoice/pdf`,
      "_blank"
    );
  };

  const handleDownloadInvoice = () => {
    if (!booking) return;
    const link = document.createElement("a");
    link.href = `${API_URL}/api/bookings/${
      booking.id || booking.booking_id
    }/invoice/pdf`;
    link.download = `invoice_${booking.id || booking.booking_id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const canCreateInvoice =
    booking.status === "check_out" || booking.status === "completed";

  // Check if can add penalties (only when checked_in)
  const canAddPenalties = booking.status === "checked_in";

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
              alignItems: "flex-start",
            }}
          >
            <div style={{ zIndex: 1, flex: 1 }}>
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

              {/* Invoice Status Badge */}
              {invoiceStatus.exists ? (
                <div style={{ marginTop: 12 }}>
                  <Tag
                    color="green"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                      fontSize: "14px",
                      padding: "4px 12px",
                    }}
                  >
                    <FileTextOutlined style={{ marginRight: 6 }} />
                    Hóa đơn: {invoiceStatus.code}
                    {invoiceStatus.issued_at && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: "12px",
                          opacity: 0.8,
                        }}
                      >
                        (Ngày: {formatDate(invoiceStatus.issued_at)})
                      </span>
                    )}
                  </Tag>
                </div>
              ) : (
                canCreateInvoice && (
                  <div style={{ marginTop: 12 }}>
                    <Tag
                      color="orange"
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "white",
                        fontSize: "14px",
                        padding: "4px 12px",
                      }}
                    >
                      <InfoCircleOutlined style={{ marginRight: 6 }} />
                      Chưa có hóa đơn
                    </Tag>
                  </div>
                )
              )}
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
                {booking.payments.map((payment, index) => {
                  const paymentStatus = paymentStatusConfig[payment.status] || {
                    color: "default",
                    text: payment.status,
                  };

                  return (
                    <div
                      key={payment.payment_id || payment.id || index}
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
              {/* Add Penalty Button */}
              <Button
                type="primary"
                danger={canAddPenalties}
                block
                size="large"
                onClick={showPenaltyModal}
                icon={<ExclamationCircleOutlined />}
                style={{
                  height: "48px",
                  fontSize: "16px",
                  background: canAddPenalties ? "#ff4d4f" : "#d9d9d9",
                  borderColor: canAddPenalties ? "#ff4d4f" : "#d9d9d9",
                }}
                disabled={!canAddPenalties}
              >
                {canAddPenalties ? "Thêm Phạt" : "Không thể thêm phạt"}
              </Button>

              {/* Invoice Dropdown */}
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="store_and_send"
                      icon={<SendOutlined />}
                      onClick={showInvoiceModal}
                      disabled={!canCreateInvoice || invoiceLoading}
                    >
                      <Tooltip title="Tạo hóa đơn mới, lưu database, và gửi email">
                        Tạo & Gửi qua Email
                      </Tooltip>
                    </Menu.Item>

                    <Menu.Item
                      key="preview"
                      icon={<EyeOutlined />}
                      onClick={handlePreviewInvoice}
                      disabled={!canCreateInvoice}
                    >
                      <Tooltip title="Xem PDF trực tiếp trên trình duyệt">
                        Xem trước PDF
                      </Tooltip>
                    </Menu.Item>

                    <Menu.Item
                      key="download"
                      icon={<DownloadOutlined />}
                      onClick={handleDownloadInvoice}
                      disabled={!canCreateInvoice}
                    >
                      <Tooltip title="Tải file PDF về máy">
                        Tải xuống PDF
                      </Tooltip>
                    </Menu.Item>

                    <Menu.Item
                      key="send_only"
                      icon={<MailOutlined />}
                      onClick={handleSendInvoiceEmail}
                      disabled={!invoiceStatus.exists || invoiceLoading}
                    >
                      <Tooltip title="Gửi lại email hóa đơn nếu đã tạo trước đó">
                        Chỉ gửi Email
                      </Tooltip>
                    </Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
                placement="bottomLeft"
              >
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{
                    height: "48px",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  loading={invoiceLoading}
                >
                  {invoiceLoading ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <FileTextOutlined />
                      Xuất Hóa đơn
                    </>
                  )}
                </Button>
              </Dropdown>

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
                  <CheckCircleOutlined /> Xác nhận Thanh toán
                </Button>
              )}

              <Button
                block
                size="large"
                onClick={() => navigate("/admin/bookings")}
                style={{ height: "48px", fontSize: "16px" }}
              >
                <ArrowLeftOutlined /> Quay lại Danh sách
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* PENALTY MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
            <span>Thêm Phạt / Hư hỏng</span>
          </div>
        }
        open={penaltyModalVisible}
        onCancel={() => setPenaltyModalVisible(false)}
        onOk={handleAddPenalties}
        okText="Ghi nhận"
        cancelText="Hủy"
        width={800}
        okButtonProps={{
          type: "primary",
          danger: true,
          loading: penaltyLoading,
        }}
        cancelButtonProps={{ disabled: penaltyLoading }}
        closable={!penaltyLoading}
        maskClosable={!penaltyLoading}
      >
        <div style={{ padding: "16px 0" }}>
          <Alert
            message="Thông báo"
            description={
              <div>
                <p>
                  Bạn đang thêm phạt/hư hỏng cho Booking #{displayBookingId}
                </p>
                <p>
                  <strong>Khách hàng:</strong> {booking?.user?.name} (
                  {booking?.user?.email})
                </p>
                <Alert
                  message="Lưu ý"
                  description="Chỉ có thể ghi nhận phạt khi khách đang lưu trú (trạng thái checked_in)"
                  type="warning"
                  showIcon
                  style={{ marginTop: 12 }}
                />
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <div
            style={{ maxHeight: "400px", overflowY: "auto", padding: "8px" }}
          >
            {penalties.map((penalty, index) => (
              <Card
                key={index}
                title={`Hạng mục ${index + 1}`}
                size="small"
                style={{ marginBottom: 16 }}
                extra={
                  penalties.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() => removePenaltyLine(index)}
                      disabled={penaltyLoading}
                    >
                      Xóa
                    </Button>
                  )
                }
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Loại hư hỏng *</strong>
                    </div>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn loại hư hỏng"
                      value={penalty.damage_type_id || undefined}
                      onChange={(value) => {
                        handlePenaltyChange(index, "damage_type_id", value);
                        handleDamageTypeChange(index, value);
                      }}
                      disabled={penaltyLoading}
                      showSearch
                      optionFilterProp="children"
                    >
                      <Option value={0}>-- Chọn loại hư hỏng --</Option>
                      {damageTypes.map((damage) => (
                        <Option key={damage.id} value={damage.id}>
                          {damage.name}
                          {damage.default_amount > 0 && (
                            <span style={{ color: "#fa8c16", marginLeft: 8 }}>
                              (Mặc định: {formatCurrency(damage.default_amount)}
                              )
                            </span>
                          )}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Số tiền (VND)</strong>
                      <span
                        style={{
                          color: "#999",
                          fontSize: "12px",
                          marginLeft: 4,
                        }}
                      >
                        (Để trống để dùng mức mặc định)
                      </span>
                    </div>
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Nhập số tiền"
                      value={penalty.amount || undefined}
                      onChange={(value) =>
                        handlePenaltyChange(index, "amount", value || 0)
                      }
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                      min={0}
                      disabled={penaltyLoading}
                    />
                  </Col>
                  <Col span={24} style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Ghi chú</strong>
                    </div>
                    <Input.TextArea
                      placeholder="Nhập ghi chú (tùy chọn)"
                      value={penalty.note}
                      onChange={(e) =>
                        handlePenaltyChange(index, "note", e.target.value)
                      }
                      rows={2}
                      disabled={penaltyLoading}
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            block
            onClick={addPenaltyLine}
            icon={<PlusOutlined />}
            style={{ marginTop: 8 }}
            disabled={penaltyLoading}
          >
            Thêm hạng mục phạt
          </Button>

          <Divider style={{ margin: "16px 0" }} />

          <div
            style={{
              background: "#fff7e6",
              padding: "12px",
              borderRadius: "6px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
            >
              <InfoCircleOutlined style={{ color: "#fa8c16", marginTop: 2 }} />
              <div>
                <strong>Hướng dẫn:</strong>
                <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                  <li>Chọn loại hư hỏng từ danh sách (bắt buộc)</li>
                  <li>Nhập số tiền hoặc để trống để dùng mức mặc định</li>
                  <li>Có thể thêm nhiều hạng mục phạt cùng lúc</li>
                  <li>
                    Thông tin phạt sẽ được cộng vào tổng thanh toán của booking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* INVOICE CONFIRMATION MODAL */}
      <Modal
        title="Xác nhận tạo hóa đơn"
        open={invoiceModalVisible}
        onCancel={() => setInvoiceModalVisible(false)}
        onOk={handleInvoiceConfirm}
        okText="Tạo và gửi"
        cancelText="Hủy"
        okButtonProps={{
          type: "primary",
          loading: invoiceLoading,
        }}
        cancelButtonProps={{ disabled: invoiceLoading }}
        closable={!invoiceLoading}
        maskClosable={!invoiceLoading}
      >
        <div style={{ padding: "16px 0" }}>
          <Alert
            message="Thông báo"
            description={
              <div>
                <p>Bạn sắp tạo hóa đơn cho Booking #{displayBookingId}</p>
                <p>
                  <strong>Khách hàng:</strong> {booking?.user?.name} (
                  {booking?.user?.email})
                </p>
                <p>
                  <strong>Tổng thanh toán:</strong>{" "}
                  {formatCurrency(booking?.total_price || 0)}
                </p>
                <Divider style={{ margin: "12px 0" }} />
                <p>Hệ thống sẽ tự động:</p>
                <ul>
                  <li>Tạo hóa đơn và lưu vào database</li>
                  <li>Tạo file PDF hóa đơn</li>
                  <li>Gửi email hóa đơn đến khách hàng</li>
                </ul>
                <Alert
                  message="Lưu ý"
                  description="Chỉ nên tạo hóa đơn khi booking đã hoàn thành (check-out)"
                  type="info"
                  showIcon
                  style={{ marginTop: 12 }}
                />
              </div>
            }
            type="info"
            showIcon
          />
        </div>
      </Modal>

      {/* DEBUG INFO - Remove in production */}
      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#f6ffed",
          border: "1px solid #b7eb8f",
          borderRadius: "6px",
          fontSize: "12px",
          display: "none", // Hide in production
        }}
      >
        <strong>Debug Info:</strong>
        <div>Booking ID: {id}</div>
        <div>Display ID: {displayBookingId}</div>
        <div>Status: {booking.status}</div>
        <div>Total: {formatCurrency(booking.total_price)}</div>
        <div>Invoice Exists: {invoiceStatus.exists ? "Yes" : "No"}</div>
        {invoiceStatus.code && <div>Invoice Code: {invoiceStatus.code}</div>}
      </div>
    </div>
  );
}
