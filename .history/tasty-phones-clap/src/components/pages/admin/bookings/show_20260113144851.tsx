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
  Upload,
  notification,
  Radio,
  List,
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
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  UploadOutlined,
  PictureOutlined,
  KeyOutlined,
  CheckOutlined,
  ApartmentOutlined,
  PlusOutlined,
  DeleteOutlined,
  WalletOutlined,
  BankOutlined,
  CalculatorOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const API_URL = "http://localhost:8000";
const { Option } = Select;
const { TextArea } = Input;

// ============================================
// INTERFACES
// ============================================
interface GuestInfo {
  name: string;
  age: number;
}

interface CheckinFormData {
  guests: GuestInfo[];
  room_id?: number | null;
}

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

interface DamageType {
  id: number;
  damage_type_name: string;
  price: number;
  description?: string;
}

interface DamageInvoice {
  damage_invoice_id: number;
  damage_type: {
    damage_type_name: string;
  };
  amount: number;
  description: string;
  image_path?: string;
  created_at: string;
}

interface PenaltyCharge {
  penalty_charge_id: number;
  amount: number;
  days_late: number;
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

interface AssignedRoom {
  id: number;
  booking_id: number;
  room_id: number;
  room_number: string;
  room_type_id: number;
  room_type_name: string;
  check_in: string;
  check_out: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Room {
  room_id: number;
  room_number: string;
  room_type_id: number;
  room_type_name: string;
  floor: number;
  status: string;
  price_per_night: number;
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
  assignedRooms?: AssignedRoom[];
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

interface PenaltyFormData {
  days_late: number;
  amount: number;
}

interface DamageFormData {
  damage_type_id: number;
  description?: string;
  image?: File;
}

interface CheckoutSummary {
  room: number;
  service: number;
  damage: number;
  penalty: number;
  prepaid: number;
  final: number;
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
  checked_in: { color: "green", text: "Đang lưu trú" },
  in_use: { color: "green", text: "Đang lưu trú" },
};

const paymentStatusConfig: Record<string, { color: string; text: string }> = {
  pending: { color: "orange", text: "Chờ xử lý" },
  completed: { color: "green", text: "Hoàn thành" },
  success: { color: "green", text: "Thành công" },
  failed: { color: "red", text: "Thất bại" },
  refunded: { color: "purple", text: "Đã hoàn tiền" },
};

const roomStatusConfig: Record<string, { color: string; text: string }> = {
  assigned: { color: "blue", text: "Đã gắn" },
  checked_in: { color: "green", text: "Đã check-in" },
  checked_out: { color: "purple", text: "Đã check-out" },
  cancelled: { color: "red", text: "Đã hủy" },
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

  // State cho modal phạt
  const [penaltyModalVisible, setPenaltyModalVisible] = useState(false);
  const [penaltyLoading, setPenaltyLoading] = useState(false);
  const [penaltyForm, setPenaltyForm] = useState<PenaltyFormData>({
    days_late: 1,
    amount: 0,
  });

  // State cho modal damage
  const [damageModalVisible, setDamageModalVisible] = useState(false);
  const [damageLoading, setDamageLoading] = useState(false);
  const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);
  const [damageForm, setDamageForm] = useState<DamageFormData>({
    damage_type_id: 0,
    description: "",
    image: "",
  });

  // State cho modal gắn phòng
  const [assignRoomModalVisible, setAssignRoomModalVisible] = useState(false);
  const [assignRoomLoading, setAssignRoomLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [roomSearchLoading, setRoomSearchLoading] = useState(false);

  // State cho phòng đã gắn
  const [assignedRooms, setAssignedRooms] = useState<AssignedRoom[]>([]);

  // State cho checkin
  const [checkinModalVisible, setCheckinModalVisible] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinForm, setCheckinForm] = useState<CheckinFormData>({
    guests: [{ name: "", age: 18 }],
    room_id: null,
  });
  const [canCheckin, setCanCheckin] = useState(false);
  const [canCheckout, setCanCheckout] = useState(false);
  const [availableCheckinRooms, setAvailableCheckinRooms] = useState<Room[]>(
    []
  );

  // State cho checkout
  const [checkoutSummary, setCheckoutSummary] =
    useState<CheckoutSummary | null>(null);
  const [checkoutSummaryModalVisible, setCheckoutSummaryModalVisible] =
    useState(false);
  const [checkoutSummaryLoading, setCheckoutSummaryLoading] = useState(false);
  const [confirmCheckoutLoading, setConfirmCheckoutLoading] = useState(false);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
  // CHECKIN FUNCTIONS
  // ============================================

  // Kiểm tra điều kiện checkin
  const checkCheckinConditions = () => {
    if (!booking) return false;

    // Booking phải ở trạng thái "paid" (đã thanh toán)
    const isPaid = booking.status === "paid";

    // Booking phải có assigned rooms
    const hasAssignedRooms = assignedRooms.length > 0;

    // Chưa checkin (trạng thái assigned rooms phải là 'assigned' chứ không phải 'checked_in')
    const notCheckedIn = assignedRooms.every(
      (room) => room.status === "assigned"
    );

    return isPaid && hasAssignedRooms && notCheckedIn;
  };

  // Kiểm tra điều kiện checkout
  const checkCheckoutConditions = () => {
    if (!booking) return false;

    // Booking đang ở trạng thái 'in_use', 'check_in', 'checked_in'
    const isCheckedIn = ["in_use", "check_in", "checked_in"].includes(
      booking.status
    );

    // Hoặc assigned rooms có status 'checked_in'
    const hasCheckedInRooms = assignedRooms.some(
      (room) => room.status === "checked_in"
    );

    return isCheckedIn || hasCheckedInRooms;
  };

  // ============================================
  // CHECKOUT FUNCTIONS
  // ============================================

  // Fetch checkout summary - hiển thị trước khi xác nhận
  const fetchCheckoutSummary = async () => {
    if (!id) return;

    setCheckoutSummaryLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.get(
        `${API_URL}/api/admin/bookings/${id}/checkout/summary`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data.success) {
        setCheckoutSummary(response.data.data);
        setCheckoutSummaryModalVisible(true);
      } else {
        message.error(response.data.message || "Không thể lấy tổng thanh toán");
      }
    } catch (error: any) {
      console.error("Error fetching checkout summary:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi lấy tổng thanh toán"
      );
    } finally {
      setCheckoutSummaryLoading(false);
    }
  };

  // Xác nhận checkout - chỉ xác nhận thôi, không mở modal thanh toán
  const handleConfirmCheckout = async () => {
    if (!id) return;

    setConfirmCheckoutLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.post(
        `${API_URL}/api/admin/bookings/${id}/checkout/confirm`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data.success) {
        message.success("Đã xác nhận checkout!");

        // Đóng modal summary
        setCheckoutSummaryModalVisible(false);

        // Nếu tổng thanh toán = 0 (đã thanh toán đủ) thì hoàn tất checkout ngay
        if (checkoutSummary && checkoutSummary.final <= 0) {
          await handleCompleteCheckoutWithoutPayment();
        } else {
          // Nếu còn tiền cần thanh toán thì mở modal thanh toán
          setCheckoutModalVisible(true);
        }
      } else {
        message.error(response.data.message || "Không thể xác nhận checkout");
      }
    } catch (error: any) {
      console.error("Error confirming checkout:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi xác nhận checkout"
      );
    } finally {
      setConfirmCheckoutLoading(false);
    }
  };

  // Xử lý checkout khi không cần thanh toán (số tiền = 0)
  const handleCompleteCheckoutWithoutPayment = async () => {
    if (!id) return;

    setCheckoutLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      // Gọi API checkout với phương thức cash và số tiền = 0
      const response = await axios.post(
        `${API_URL}/api/admin/bookings/${id}/checkout/pay`,
        {
          method: "cash",
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      console.log("Complete checkout without payment response:", response.data);

      if (response.data.success) {
        message.success("Checkout thành công!");

        // Refresh booking details
        await fetchBookingDetails();

        // Show success notification
        notification.success({
          message: "Checkout thành công",
          description: `Booking #${displayBookingId} đã được checkout. Khách đã thanh toán đủ từ trước.`,
          placement: "topRight",
        });
      } else {
        message.error(response.data.message || "Checkout thất bại");
      }
    } catch (error: any) {
      console.error("Error completing checkout without payment:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi hoàn tất checkout"
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Process checkout payment - sửa lại để xử lý tốt hơn
  const handleCheckoutPayment = async () => {
    if (!id || !paymentMethod) return;

    setCheckoutLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.post(
        `${API_URL}/api/admin/bookings/${id}/checkout/pay`,
        {
          method: paymentMethod,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      console.log("Checkout payment response:", response.data);

      if (response.data.success) {
        // Đóng modal
        setCheckoutModalVisible(false);

        if (paymentMethod === "vnpay" && response.data.data?.payment_url) {
          // Nếu là VNPay, mở trang thanh toán trong tab mới
          message.info("Đang chuyển hướng đến trang thanh toán VNPay...");
          window.open(response.data.data.payment_url, "_blank");

          // Hiển thị hướng dẫn cho người dùng
          notification.info({
            message: "Chuyển hướng thanh toán VNPay",
            description:
              "Hệ thống đã mở trang thanh toán VNPay. Vui lòng hoàn tất thanh toán trong tab mới.",
            placement: "topRight",
            duration: 5,
          });
        } else if (paymentMethod === "cash") {
          // Nếu là tiền mặt, thông báo thành công
          message.success("Checkout thành công với thanh toán tiền mặt!");

          // Show success notification
          notification.success({
            message: "Checkout thành công",
            description: `Booking #${displayBookingId} đã được checkout. Phòng đã được mở lại.`,
            placement: "topRight",
          });
        }

        // Refresh booking details sau 2 giây
        setTimeout(async () => {
          await fetchBookingDetails();
        }, 2000);
      } else {
        message.error(response.data.message || "Checkout thất bại");
      }
    } catch (error: any) {
      console.error("Error processing checkout:", error);

      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        message.error("Chưa xác nhận checkout. Vui lòng xác nhận trước.");
      } else {
        message.error("Không thể xử lý checkout. Vui lòng thử lại.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Thêm hàm để check trạng thái checkout
  const checkCheckoutStatus = () => {
    if (!booking) return false;

    // Booking phải đang ở trạng thái check-in
    const validStatuses = ["check_in", "checked_in", "in_use"];
    return validStatuses.includes(booking.status);
  };

  // ============================================
  // CHECKIN HANDLER FUNCTIONS - THÊM VÀO ĐÂY
  // ============================================

  // Handle add guest trong form checkin
  const handleAddGuest = () => {
    setCheckinForm({
      ...checkinForm,
      guests: [...checkinForm.guests, { name: "", age: 18 }],
    });
  };

  // Handle remove guest
  const handleRemoveGuest = (index: number) => {
    const newGuests = [...checkinForm.guests];
    newGuests.splice(index, 1);
    setCheckinForm({
      ...checkinForm,
      guests: newGuests,
    });
  };

  // Handle change guest info
  const handleCheckinFormChange = (
    index: number,
    field: keyof GuestInfo,
    value: any
  ) => {
    const newGuests = [...checkinForm.guests];
    newGuests[index][field] = value;
    setCheckinForm({
      ...checkinForm,
      guests: newGuests,
    });
  };

  // Fetch available rooms cho checkin (khi chưa có assigned rooms)
  const fetchAvailableCheckinRooms = async () => {
    if (!booking) return;

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      // Lấy room_type_id từ booking items
      const roomTypeId = booking.items[0]?.room_type_id;
      if (!roomTypeId) {
        message.error("Không tìm thấy loại phòng trong booking");
        return;
      }

      const roomTypeName = booking.items[0]?.room_type_name || "Không xác định";

      console.log(
        "🔍 Fetching available checkin rooms for type:",
        roomTypeId,
        roomTypeName
      );

      // Thử endpoint chính
      const endpoints = [
        `${API_URL}/api/admin/rooms/available?room_type_id=${roomTypeId}&check_in=${booking.check_in}&check_out=${booking.check_out}`,
        `${API_URL}/api/rooms/available?room_type_id=${roomTypeId}&check_in=${booking.check_in}&check_out=${booking.check_out}`,
        `${API_URL}/api/rooms?room_type_id=${roomTypeId}&status=available`,
      ];

      let rooms: Room[] = [];

      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          console.log(`Endpoint ${endpoint} response:`, response.data);

          if (response.data.success && response.data.data) {
            rooms = response.data.data || [];
            break;
          } else if (Array.isArray(response.data)) {
            rooms = response.data;
            break;
          } else if (response.data.rooms) {
            rooms = response.data.rooms;
            break;
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed`);
        }
      }

      // Filter theo room_type_id (đảm bảo đúng loại phòng)
      rooms = rooms.filter((room: any) => room.room_type_id === roomTypeId);

      setAvailableCheckinRooms(rooms);
      console.log(
        `Found ${rooms.length} available checkin rooms of type ${roomTypeName}`
      );
    } catch (error: any) {
      console.error("Error fetching available checkin rooms:", error);
      message.error("Lỗi khi tải danh sách phòng checkin");
      setAvailableCheckinRooms([]);
    }
  };

  // Xử lý checkin
  const handleCheckin = async () => {
    if (!booking || !id) return;

    // Validate form
    const hasEmptyName = checkinForm.guests.some(
      (guest) => !guest.name || guest.name.trim() === ""
    );
    if (hasEmptyName) {
      message.error("Vui lòng nhập tên cho tất cả khách");
      return;
    }

    // Nếu không có assigned rooms và không chọn phòng
    if (!hasAssignedRooms && !checkinForm.room_id) {
      message.error("Vui lòng chọn phòng để check-in");
      return;
    }

    setCheckinLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      let payload: any = {
        guests: checkinForm.guests.map((guest) => ({
          name: guest.name.trim(),
          age: guest.age,
        })),
      };

      // Nếu chưa có assigned rooms, gửi room_id
      if (!hasAssignedRooms && checkinForm.room_id) {
        payload.room_id = checkinForm.room_id;
      }

      console.log("📤 Checkin payload:", payload);

      // Thử các endpoint khác nhau
      const endpoints = [
        `${API_URL}/api/admin/bookings/${id}/checkin`,
        `${API_URL}/api/bookings/${id}/checkin`,
        `${API_URL}/api/bookings/${id}/check-in`,
      ];

      let response = null;
      let error = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const res = await axios.post(endpoint, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (res.data.success) {
            response = res;
            break;
          }
        } catch (err: any) {
          error = err;
          console.log(`Endpoint ${endpoint} failed:`, err.message);
          continue;
        }
      }

      if (response && response.data.success) {
        message.success("Check-in thành công!");
        setCheckinModalVisible(false);
        setCheckinForm({
          guests: [{ name: "", age: 18 }],
          room_id: null,
        });

        // Refresh booking details
        await fetchBookingDetails();

        // Show success notification
        notification.success({
          message: "Check-in thành công",
          description: `Booking #${displayBookingId} đã được check-in thành công.`,
          placement: "topRight",
        });
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          "Không thể thực hiện check-in. Vui lòng thử lại.";
        message.error(errorMessage);
      }
    } catch (error: any) {
      console.error("❌ Error checking in:", error);

      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        message.error("API check-in không tồn tại");
      } else if (error.response?.status === 400) {
        message.error("Dữ liệu check-in không hợp lệ");
      } else {
        message.error("Lỗi khi thực hiện check-in");
      }
    } finally {
      setCheckinLoading(false);
    }
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

      // Fetch booking details
      const bookingResponse = await axios.get(`${API_URL}/api/bookings/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("📦 Booking API Response:", bookingResponse.data);

      const responseData = bookingResponse.data?.data || bookingResponse.data;

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
        const room_total =
          bookingData.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
        const service_total = bookingData.serviceInvoice?.total_amount || 0;
        const damage_total =
          bookingData.damageInvoices?.reduce(
            (sum, invoice) => sum + invoice.amount,
            0
          ) || 0;
        const penalty_total =
          bookingData.penaltyCharges?.reduce(
            (sum, charge) => sum + charge.amount,
            0
          ) || 0;

        const subtotal =
          room_total + service_total + damage_total + penalty_total;
        const grand_total = subtotal - (bookingData.voucher_discount || 0);

        pricingData = {
          room_total,
          service_total,
          damage_total,
          penalty_total,
          grand_total,
        };
      }

      setBooking(bookingData);
      setPricing(pricingData);

      // Lấy room_type_id từ booking items
      const roomTypeId = bookingData.items[0]?.room_type_id;
      const bookingId = bookingData.id || bookingData.booking_id;

      // Fetch assigned rooms nếu có API
      if (bookingId) {
        await fetchAssignedRooms(bookingId, roomTypeId, token);
      } else {
        setAssignedRooms([]);
      }

      // Check invoice status
      await checkInvoiceStatus(bookingData.id || bookingData.booking_id, token);

      // Kiểm tra điều kiện checkin/checkout
      setCanCheckin(checkCheckinConditions());
      setCanCheckout(checkCheckoutStatus());

      console.log("✅ Booking data loaded:", bookingData);
      console.log("🏨 Assigned rooms:", assignedRooms);
      console.log("🔑 Can checkin:", checkCheckinConditions());
      console.log("🚪 Can checkout:", checkCheckoutStatus());
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

  // ============================================
  // CÁC HÀM KHÁC
  // ============================================

  // Fetch assigned rooms
  const fetchAssignedRooms = async (
    bookingId: number,
    roomTypeId: number | undefined,
    token: string | null
  ) => {
    try {
      console.log(`Fetching assigned rooms for booking ${bookingId}`);

      // Chỉ thử endpoint chính
      const endpoint = `${API_URL}/api/bookings/${bookingId}/assigned-rooms`;

      try {
        const response = await axios.get(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log(`Assigned rooms API response:`, response.data);

        if (response.data.success) {
          let rooms = response.data.data || [];

          // Filter theo room_type_id nếu có
          if (roomTypeId && rooms.length > 0) {
            rooms = rooms.filter(
              (room: any) => room.room_type_id === roomTypeId
            );
          }

          setAssignedRooms(rooms);
          console.log(`Found ${rooms.length} assigned rooms`);
        } else {
          console.log("No assigned rooms data from API");
          setAssignedRooms([]);
        }
      } catch (apiError: any) {
        console.log(`API endpoint not available: ${apiError.message}`);

        // Nếu API không có, check nếu booking response có sẵn assigned rooms
        if (booking?.assignedRooms && Array.isArray(booking.assignedRooms)) {
          let rooms = booking.assignedRooms;
          if (roomTypeId) {
            rooms = rooms.filter(
              (room: any) => room.room_type_id === roomTypeId
            );
          }
          setAssignedRooms(rooms);
          console.log(`Using ${rooms.length} assigned rooms from booking data`);
        } else {
          setAssignedRooms([]);
        }
      }
    } catch (error) {
      console.error("Error fetching assigned rooms:", error);
      setAssignedRooms([]);
    }
  };

  // Fetch available rooms
  const fetchAvailableRooms = async () => {
    if (!booking) return;

    setRoomSearchLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      // Lấy room_type_id từ booking items
      const roomTypeId = booking.items[0]?.room_type_id;
      if (!roomTypeId) {
        message.error("Không tìm thấy loại phòng trong booking");
        return;
      }

      const roomTypeName = booking.items[0]?.room_type_name || "Không xác định";

      console.log(
        "🔍 Fetching available rooms for type:",
        roomTypeId,
        roomTypeName
      );

      // Thử endpoint chính
      const endpoints = [
        `${API_URL}/api/admin/rooms/available?room_type_id=${roomTypeId}&check_in=${booking.check_in}&check_out=${booking.check_out}`,
        `${API_URL}/api/rooms/available?room_type_id=${roomTypeId}&check_in=${booking.check_in}&check_out=${booking.check_out}`,
        `${API_URL}/api/rooms?room_type_id=${roomTypeId}&status=available`,
      ];

      let rooms: Room[] = [];

      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          console.log(`Endpoint ${endpoint} response:`, response.data);

          if (response.data.success && response.data.data) {
            rooms = response.data.data || [];
            break;
          } else if (Array.isArray(response.data)) {
            rooms = response.data;
            break;
          } else if (response.data.rooms) {
            rooms = response.data.rooms;
            break;
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed`);
        }
      }

      // Filter theo room_type_id (đảm bảo đúng loại phòng)
      rooms = rooms.filter((room: any) => room.room_type_id === roomTypeId);

      // Nếu không tìm thấy phòng trống
      if (rooms.length === 0) {
        message.warning(
          `Không tìm thấy phòng ${roomTypeName} trống trong khoảng thời gian này`
        );
      }

      setAvailableRooms(rooms);
      console.log(
        `Found ${rooms.length} available rooms of type ${roomTypeName}`
      );
    } catch (error: any) {
      console.error("Error fetching available rooms:", error);
      message.error("Lỗi khi tải danh sách phòng");
      setAvailableRooms([]);
    } finally {
      setRoomSearchLoading(false);
    }
  };

  // Handle assign room
  const handleAssignRoom = async () => {
    if (!booking || !id || !selectedRoomId) {
      message.error("Vui lòng chọn phòng");
      return;
    }

    setAssignRoomLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const payload = {
        room_id: selectedRoomId,
      };

      console.log("📤 Assigning room:", payload);

      const response = await axios.post(
        `${API_URL}/api/bookings/${id}/assign-room`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Assign room response:", response.data);

      if (response.data.success) {
        message.success("Gắn phòng thành công!");
        setAssignRoomModalVisible(false);

        // Thêm phòng vừa gắn vào danh sách assigned rooms
        const newAssignedRoom = response.data.data?.assigned_room || {
          id: Date.now(), // ID tạm thời
          booking_id: booking.id,
          room_id: selectedRoomId,
          room_number:
            availableRooms.find((r) => r.room_id === selectedRoomId)
              ?.room_number || "N/A",
          room_type_id: booking.items[0]?.room_type_id,
          room_type_name: booking.items[0]?.room_type_name,
          check_in: booking.check_in,
          check_out: booking.check_out,
          status: "assigned",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setAssignedRooms((prev) => [...prev, newAssignedRoom]);
        setSelectedRoomId(null);

        // Cập nhật điều kiện checkin
        setCanCheckin(checkCheckinConditions());

        // Refresh booking details để có dữ liệu mới nhất
        setTimeout(() => {
          fetchBookingDetails();
        }, 500);
      } else {
        message.error(response.data.error?.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("❌ Error assigning room:", error);

      if (error.response?.data?.error?.message) {
        message.error(error.response.data.error.message);
      } else if (error.response?.status === 403) {
        message.error("Bạn không có quyền thực hiện thao tác này");
      } else if (error.response?.status === 404) {
        message.error("Không tìm thấy booking hoặc phòng");
      } else if (error.response?.status === 422) {
        message.error("Dữ liệu không hợp lệ");
      } else {
        message.error("Không thể gắn phòng. Vui lòng thử lại.");
      }
    } finally {
      setAssignRoomLoading(false);
    }
  };

  // Open assign room modal
  const showAssignRoomModal = async () => {
    if (!booking) return;

    setSelectedRoomId(null);
    setAssignRoomModalVisible(true);

    // Fetch available rooms cùng loại với booking
    await fetchAvailableRooms();
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

  // Fetch damage types - SỬ DỤNG API CÓ SẴN HOẶC TẠO MỚI
  const fetchDamageTypes = async () => {
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      // Thử các endpoint khác nhau
      const endpoints = [
        `${API_URL}/api/damage-types`,
        `${API_URL}/api/admin/damage-types`,
        `${API_URL}/api/damage-types/list`,
      ];

      let damageTypesData: DamageType[] = [];

      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          console.log("⚙ RAW damage-types response:", response.data);

          let list = [];

          // Xử lý các định dạng response khác nhau
          if (
            response.data?.data?.data &&
            Array.isArray(response.data.data.data)
          ) {
            list = response.data.data.data; // Định dạng phân trang
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            list = response.data.data; // Định dạng có data wrapper
          } else if (Array.isArray(response.data)) {
            list = response.data; // Định dạng array trực tiếp
          } else if (
            response.data?.damage_types &&
            Array.isArray(response.data.damage_types)
          ) {
            list = response.data.damage_types; // Định dạng với key damage_types
          }

          if (list.length > 0) {
            damageTypesData = list.map((item: any) => ({
              id: item.id || item.damage_type_id,
              damage_type_name:
                item.name || item.damage_type_name || "Không xác định",
              price: item.price || item.amount || 0,
              description: item.description || "",
            }));
            break; // Thoát vòng lặp khi có dữ liệu
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err);
          continue;
        }
      }

      // Nếu không có dữ liệu từ API, sử dụng mock data
      if (damageTypesData.length === 0) {
        console.log("Using mock damage types");
        damageTypesData = [
          {
            id: 1,
            damage_type_name: "Vỡ kính",
            price: 500000,
            description: "Vỡ kính cửa sổ",
          },
          {
            id: 2,
            damage_type_name: "Hư TV",
            price: 2000000,
            description: "Hư hỏng TV",
          },
          {
            id: 3,
            damage_type_name: "Bể gương",
            price: 300000,
            description: "Vỡ gương trong phòng tắm",
          },
        ];
      }

      setDamageTypes(damageTypesData);
    } catch (err) {
      console.error("❌ Error fetching damage types:", err);
      message.error("Không thể tải danh sách loại hư hỏng");

      // Fallback to mock data
      const mockDamageTypes = [
        { id: 1, damage_type_name: "Vỡ kính", price: 500000 },
        { id: 2, damage_type_name: "Hư TV", price: 2000000 },
        { id: 3, damage_type_name: "Bể gương", price: 300000 },
      ];
      setDamageTypes(mockDamageTypes);
    }
  };

  // Open damage modal
  const showDamageModal = async () => {
    if (!booking) return;

    await fetchDamageTypes();
    setDamageForm({
      damage_type_id: 0,
      description: "",
      image: "",
    });
    setDamageModalVisible(true);
  };

  // Open penalty modal
  const showPenaltyModal = () => {
    if (!booking) return;

    setPenaltyForm({
      days_late: 1,
      amount: 0,
    });
    setPenaltyModalVisible(true);
  };

  // Handle form changes
  const handlePenaltyFormChange = (
    field: keyof PenaltyFormData,
    value: any
  ) => {
    setPenaltyForm({
      ...penaltyForm,
      [field]: value,
    });
  };

  const handleDamageFormChange = (field: keyof DamageFormData, value: any) => {
    setDamageForm({
      ...damageForm,
      [field]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const formData = new FormData();
      formData.append("image", file);

      const uploadEndpoints = [
        `${API_URL}/api/upload`,
        `${API_URL}/api/uploads`,
        `${API_URL}/api/upload-image`,
      ];

      let uploadSuccessful = false;
      let uploadedUrl = "";

      for (const endpoint of uploadEndpoints) {
        try {
          const response = await axios.post(endpoint, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success || response.data.url) {
            uploadedUrl =
              response.data.url ||
              response.data.path ||
              response.data.image_url;
            uploadSuccessful = true;
            break;
          }
        } catch (error) {
          console.log(`Upload endpoint ${endpoint} failed, trying next...`);
        }
      }

      if (uploadSuccessful) {
        setDamageForm({
          ...damageForm,
          image: uploadedUrl,
        });
        message.success("Tải ảnh lên thành công");
      } else {
        message.warning("Không thể tải ảnh lên, tiếp tục không có ảnh");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Lỗi khi tải ảnh lên");
    }
  };

  // Submit damage
  const handleAddDamage = async () => {
    if (!booking || !id) return;

    if (!damageForm.damage_type_id) {
      message.error("Vui lòng chọn loại hư hỏng");
      return;
    }

    setDamageLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const payload = {
        damage_type_id: damageForm.damage_type_id,
        image: damageForm.image || null,
      };

      const response = await axios.post(
        `${API_URL}/api/bookings/${id}/damages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success("Ghi nhận hư hỏng thành công!");
        setDamageModalVisible(false);
        fetchBookingDetails();
        setDamageForm({
          damage_type_id: 0,
          description: "",
          image: "",
        });
      } else {
        message.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("❌ Error adding damage:", error);

      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        message.error("API không tồn tại. Vui lòng kiểm tra route.");
      } else {
        message.error("Không thể ghi nhận hư hỏng");
      }
    } finally {
      setDamageLoading(false);
    }
  };

  // Submit penalties
  const handleAddPenalties = async () => {
    if (!booking || !id) return;

    if (!penaltyForm.amount || penaltyForm.amount <= 0) {
      message.error("Vui lòng nhập số tiền phạt");
      return;
    }

    if (!penaltyForm.days_late || penaltyForm.days_late <= 0) {
      message.error("Vui lòng nhập số ngày trễ");
      return;
    }

    setPenaltyLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const payload = {
        days_late: penaltyForm.days_late,
        amount: penaltyForm.amount,
      };

      const response = await axios.post(
        `${API_URL}/api/bookings/${id}/penalties`,
        payload,
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
        fetchBookingDetails();
        setPenaltyForm({ days_late: 1, amount: 0 });
      } else {
        message.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("❌ Error adding penalties:", error);

      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        message.error("API không tồn tại. Vui lòng kiểm tra route.");
      } else {
        message.error("Không thể ghi nhận phạt");
      }
    } finally {
      setPenaltyLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  // Cập nhật điều kiện checkin khi assignedRooms thay đổi
  useEffect(() => {
    if (booking && assignedRooms) {
      setCanCheckin(checkCheckinConditions());
      setCanCheckout(checkCheckoutStatus());
    }
  }, [booking, assignedRooms]);

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

        setInvoiceStatus({
          exists: true,
          code: response.data.invoice_code,
          issued_at: new Date().toISOString(),
        });

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
  // CALCULATED VALUES
  // ============================================
  const displayBookingId = booking?.booking_id || booking?.id || id;
  const status = booking
    ? statusConfig[booking.status] || {
        color: "default",
        text: booking.status,
      }
    : { color: "default", text: "N/A" };

  // Tổng đã thanh toán
  const totalPaid =
    booking?.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  // Sử dụng grand_total từ pricing
  const grandTotal = pricing?.grand_total || booking?.total_price || 0;

  // Tính số tiền còn lại
  const balanceDue = Math.max(0, grandTotal - totalPaid);

  const canCreateInvoice =
    booking?.status === "check_out" || booking?.status === "completed";

  // CHỈ HIỂN THỊ NÚT THÊM PHẠT VÀ DAMAGE KHI ĐANG LƯU TRÚ
  const canAddCharges =
    booking?.status === "check_in" ||
    booking?.status === "checked_in" ||
    booking?.status === "in_use";

  // Check if can assign room (only for paid bookings)
  const canAssignRoom =
    booking?.status === "paid" || booking?.status === "confirmed";

  // Room type info từ booking
  const roomTypeName = booking?.items[0]?.room_type_name || "Không xác định";
  const roomTypeId = booking?.items[0]?.room_type_id;

  // Hiển thị assigned rooms từ state riêng
  const hasAssignedRooms = assignedRooms.length > 0;

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

              {/* Room assignment status */}
              {hasAssignedRooms && (
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
                    <KeyOutlined style={{ marginRight: 6 }} />
                    Đã gắn {assignedRooms.length} phòng {roomTypeName}
                    {assignedRooms.some(
                      (room) => room.status === "checked_in"
                    ) && <span style={{ marginLeft: 8 }}>(Đã check-in)</span>}
                  </Tag>
                </div>
              )}

              {/* Checkin status */}
              {(booking.status === "in_use" ||
                booking.status === "checked_in") && (
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
                    <CheckCircleOutlined style={{ marginRight: 6 }} />
                    Đang lưu trú (Đã check-in)
                  </Tag>
                </div>
              )}

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
          {/* ASSIGNED ROOMS SECTION - HIỂN THỊ PHÒNG ĐÃ GẮN */}
          {hasAssignedRooms && (
            <Card
              title={
                <span style={{ fontWeight: "600", fontSize: "16px" }}>
                  <ApartmentOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  Phòng Đã Gắn ({assignedRooms.length})
                  <Tag
                    color="blue"
                    style={{ marginLeft: "8px", fontSize: "12px" }}
                  >
                    {roomTypeName}
                  </Tag>
                  {assignedRooms.some(
                    (room) => room.status === "checked_in"
                  ) && (
                    <Tag
                      color="green"
                      style={{ marginLeft: "8px", fontSize: "12px" }}
                    >
                      Đã check-in
                    </Tag>
                  )}
                </span>
              }
              style={{
                marginBottom: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #1890ff",
              }}
            >
              <Alert
                message={
                  assignedRooms.some((room) => room.status === "checked_in")
                    ? `Đã check-in ${assignedRooms.length} phòng ${roomTypeName}`
                    : `Đã gắn ${assignedRooms.length} phòng ${roomTypeName} cho booking này`
                }
                type={
                  assignedRooms.some((room) => room.status === "checked_in")
                    ? "success"
                    : "info"
                }
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={[16, 16]}>
                {assignedRooms.map((room) => {
                  const roomStatus = roomStatusConfig[room.status] || {
                    color: "default",
                    text: room.status,
                  };

                  return (
                    <Col xs={24} sm={12} md={8} key={room.id}>
                      <Card
                        style={{
                          borderRadius: "8px",
                          border:
                            room.status === "checked_in"
                              ? "2px solid #52c41a"
                              : "1px solid #f0f0f0",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                          background:
                            room.status === "checked_in" ? "#f6ffed" : "white",
                        }}
                        bodyStyle={{ padding: "16px" }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: "70px",
                              height: "70px",
                              borderRadius: "50%",
                              background:
                                room.status === "checked_in"
                                  ? "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)"
                                  : "linear-gradient(135deg, #1890ff 0%, #52c41a 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "24px",
                              fontWeight: "bold",
                              margin: "0 auto 12px",
                            }}
                          >
                            {room.room_number}
                          </div>

                          <div
                            style={{
                              fontWeight: "600",
                              fontSize: "18px",
                              marginBottom: "4px",
                            }}
                          >
                            Phòng {room.room_number}
                          </div>

                          <Tag
                            color={roomStatus.color}
                            style={{ marginBottom: "8px" }}
                          >
                            {roomStatus.text}
                          </Tag>

                          <div style={{ color: "#666", marginBottom: "4px" }}>
                            <HomeOutlined style={{ marginRight: "6px" }} />
                            {room.room_type_name || roomTypeName}
                          </div>

                          <div style={{ color: "#666", marginBottom: "4px" }}>
                            <CalendarOutlined style={{ marginRight: "6px" }} />
                            {formatDate(room.check_in)} -{" "}
                            {formatDate(room.check_out)}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#999",
                              marginTop: "8px",
                            }}
                          >
                            {room.status === "checked_in"
                              ? `Check-in lúc: ${formatDateTime(
                                  room.updated_at
                                )}`
                              : `Gắn lúc: ${formatDateTime(room.created_at)}`}
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          )}

          {/* ROOM ASSIGNMENT STATUS CARD - Hiển thị khi chưa gắn phòng */}
          {!hasAssignedRooms && canAssignRoom && (
            <Card
              title={
                <span style={{ fontWeight: "600", fontSize: "16px" }}>
                  <KeyOutlined
                    style={{ marginRight: "8px", color: "#ff4d4f" }}
                  />
                  Trạng thái Gắn phòng
                  <Tag
                    color="red"
                    style={{ marginLeft: "8px", fontSize: "12px" }}
                  >
                    {roomTypeName}
                  </Tag>
                </span>
              }
              style={{
                marginBottom: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px dashed #ff4d4f",
              }}
            >
              <div style={{ textAlign: "center", padding: "20px" }}>
                <KeyOutlined
                  style={{
                    fontSize: "48px",
                    color: "#ff4d4f",
                    marginBottom: "16px",
                  }}
                />
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#ff4d4f",
                  }}
                >
                  Chưa gắn phòng {roomTypeName}
                </div>
                <div style={{ color: "#666", marginBottom: "16px" }}>
                  Booking này chưa được gắn phòng. Vui lòng gắn phòng{" "}
                  {roomTypeName} để khách có thể check-in.
                </div>
                <Button
                  type="primary"
                  icon={<KeyOutlined />}
                  onClick={showAssignRoomModal}
                  style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
                >
                  Gắn phòng {roomTypeName}
                </Button>
              </div>
            </Card>
          )}

          {/* CHECKIN STATUS CARD - Hiển thị khi đã checkin */}
          {(booking.status === "in_use" || booking.status === "checked_in") && (
            <Card
              title={
                <span style={{ fontWeight: "600", fontSize: "16px" }}>
                  <CheckCircleOutlined
                    style={{ marginRight: "8px", color: "#52c41a" }}
                  />
                  Trạng thái Check-in
                </span>
              }
              style={{
                marginBottom: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #52c41a",
                background: "#f6ffed",
              }}
            >
              <Alert
                message="Đang lưu trú"
                description={`Khách đã check-in vào lúc ${formatDateTime(
                  booking.updated_at
                )}. Booking đang ở trạng thái lưu trú.`}
                type="success"
                showIcon
              />
              <div style={{ marginTop: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Ngày check-in"
                      value={formatDate(booking.check_in)}
                      prefix={<CalendarOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Ngày check-out"
                      value={formatDate(booking.check_out)}
                      prefix={<CalendarOutlined />}
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          )}

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

              {/* Assigned room timeline item */}
              {hasAssignedRooms && (
                <Timeline.Item
                  color="blue"
                  label={formatDateTime(assignedRooms[0].created_at)}
                >
                  <div style={{ fontWeight: "600" }}>Phòng đã được gắn</div>
                  <div style={{ color: "#666" }}>
                    {assignedRooms
                      .map((room) => `Phòng ${room.room_number}`)
                      .join(", ")}{" "}
                    ({roomTypeName})
                  </div>
                </Timeline.Item>
              )}

              {/* Checkin timeline item */}
              {(booking.status === "in_use" ||
                booking.status === "checked_in") && (
                <Timeline.Item
                  color="green"
                  label={formatDateTime(booking.updated_at)}
                >
                  <div style={{ fontWeight: "600" }}>Đã check-in</div>
                  <div style={{ color: "#666" }}>
                    Khách đã nhận phòng và đang lưu trú
                  </div>
                </Timeline.Item>
              )}

              <Timeline.Item
                color={
                  [
                    "check_in",
                    "check_out",
                    "completed",
                    "checked_in",
                    "in_use",
                  ].includes(booking.status)
                    ? "green"
                    : "gray"
                }
                label={formatDate(booking.check_in)}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: [
                      "check_in",
                      "check_out",
                      "completed",
                      "checked_in",
                      "in_use",
                    ].includes(booking.status)
                      ? "#000"
                      : "#999",
                  }}
                >
                  Nhận phòng
                </div>
                <div
                  style={{
                    color: [
                      "check_in",
                      "check_out",
                      "completed",
                      "checked_in",
                      "in_use",
                    ].includes(booking.status)
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

                  <Descriptions.Item label="Loại phòng" span={1}>
                    <div style={{ fontWeight: "600", color: "#1890ff" }}>
                      {roomTypeName}
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item label="Số lượng phòng" span={1}>
                    <Badge
                      count={booking.items[0]?.quantity || 1}
                      style={{
                        backgroundColor: "#1890ff",
                        fontSize: "16px",
                        padding: "4px 8px",
                      }}
                    />
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
                        render: (text, record) => (
                          <div>
                            {text}
                            {record.image_path && (
                              <div style={{ marginTop: 4 }}>
                                <PictureOutlined style={{ marginRight: 4 }} />
                                <a
                                  href={`${API_URL}${record.image_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Xem ảnh
                                </a>
                              </div>
                            )}
                          </div>
                        ),
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
                    Phạt trễ check-out
                  </Divider>
                  <Table
                    dataSource={booking.penaltyCharges}
                    rowKey="penalty_charge_id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Số ngày trễ",
                        dataIndex: "days_late",
                        key: "days_late",
                        render: (days) => <div>{days} ngày</div>,
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
                    {formatCurrency(grandTotal)}
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
              {/* Checkin Button - chỉ hiển thị khi có thể checkin */}
              {canCheckin && (
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={async () => {
                    setCheckinModalVisible(true);
                    // Fetch available rooms nếu chưa có assigned rooms
                    if (!hasAssignedRooms) {
                      await fetchAvailableCheckinRooms();
                    }
                  }}
                  icon={<CheckCircleOutlined />}
                  style={{
                    height: "48px",
                    fontSize: "16px",
                    background: "#52c41a",
                    borderColor: "#52c41a",
                  }}
                >
                  Check-in
                </Button>
              )}

              {/* Checkout Button - chỉ hiển thị khi đã checkin */}
              {canCheckout && (
                <>
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={fetchCheckoutSummary}
                    icon={<ShoppingCartOutlined />}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      background: "#fa8c16",
                      borderColor: "#fa8c16",
                    }}
                    loading={checkoutSummaryLoading}
                  >
                    Xem Tổng Thanh Toán
                  </Button>
                </>
              )}

              {/* Hiển thị trạng thái checkin nếu đã checkin */}
              {booking.status === "in_use" ||
              booking.status === "checked_in" ? (
                <Alert
                  message="Đã checkin"
                  description={`Đang lưu trú từ ${formatDate(
                    booking.check_in
                  )}`}
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              ) : null}

              {/* Assign Room Action */}
              {canAssignRoom && !hasAssignedRooms ? (
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={showAssignRoomModal}
                  icon={<KeyOutlined />}
                  style={{
                    height: "48px",
                    fontSize: "16px",
                    background: "#1890ff",
                    borderColor: "#1890ff",
                  }}
                >
                  Gắn phòng {roomTypeName}
                </Button>
              ) : hasAssignedRooms ? (
                <Button
                  type="default"
                  block
                  size="large"
                  onClick={showAssignRoomModal}
                  icon={<ApartmentOutlined />}
                  style={{
                    height: "48px",
                    fontSize: "16px",
                  }}
                  disabled={
                    booking.status !== "paid" && booking.status !== "confirmed"
                  }
                >
                  Đã gắn {assignedRooms.length} phòng {roomTypeName}
                </Button>
              ) : null}

              {/* Checkout Actions */}
              {canAddCharges && (
                <>
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={showDamageModal}
                    icon={<ExclamationCircleOutlined />}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      background: "#fa8c16",
                      borderColor: "#fa8c16",
                    }}
                  >
                    Thêm Hư hỏng
                  </Button>

                  <Button
                    type="primary"
                    danger
                    block
                    size="large"
                    onClick={showPenaltyModal}
                    icon={<WarningOutlined />}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      background: "#ff4d4f",
                      borderColor: "#ff4d4f",
                    }}
                  >
                    Thêm Phạt Trễ
                  </Button>
                </>
              )}

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

      {/* CHECKOUT SUMMARY MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalculatorOutlined style={{ color: "#1890ff" }} />
            <span>Tổng thanh toán Checkout</span>
            <Tag color="blue" style={{ marginLeft: "auto" }}>
              Booking #{displayBookingId}
            </Tag>
          </div>
        }
        open={checkoutSummaryModalVisible}
        onCancel={() => setCheckoutSummaryModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setCheckoutSummaryModalVisible(false)}
          >
            Đóng
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmCheckout}
            loading={confirmCheckoutLoading}
          >
            {checkoutSummary?.final === 0
              ? "Hoàn tất Checkout"
              : "Tiếp tục Thanh toán"}
          </Button>,
        ]}
        width={600}
      >
        {checkoutSummary && (
          <div style={{ padding: "16px 0" }}>
            <Alert
              message="Chi tiết thanh toán checkout"
              description="Tổng hợp tất cả các khoản phí cần thanh toán khi checkout"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <List
              size="large"
              dataSource={[
                {
                  label: "Tiền phòng",
                  value: checkoutSummary.room,
                  color: "#1890ff",
                },
                {
                  label: "Dịch vụ",
                  value: checkoutSummary.service,
                  color: "#722ed1",
                },
                {
                  label: "Hư hỏng",
                  value: checkoutSummary.damage,
                  color: "#fa8c16",
                },
                {
                  label: "Phạt trễ",
                  value: checkoutSummary.penalty,
                  color: "#fa541c",
                },
                {
                  label: "Đã trả trước",
                  value: -checkoutSummary.prepaid,
                  color: "#52c41a",
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div>{item.label}:</div>
                    <div style={{ color: item.color, fontWeight: "600" }}>
                      {item.value >= 0 ? "+" : ""}
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                </List.Item>
              )}
            />

            <Divider />

            <div
              style={{
                background: checkoutSummary.final === 0 ? "#f6ffed" : "#fff7e6",
                padding: "16px",
                borderRadius: "8px",
                border:
                  checkoutSummary.final === 0
                    ? "1px solid #b7eb8f"
                    : "1px solid #ffd591",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                  Tổng thanh toán:
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: checkoutSummary.final === 0 ? "#52c41a" : "#1890ff",
                  }}
                >
                  {formatCurrency(checkoutSummary.final)}
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: "14px", color: "#666" }}>
                {checkoutSummary.final === 0 ? (
                  <Alert
                    message="Khách đã thanh toán đủ"
                    description="Không cần thanh toán thêm. Bấm 'Hoàn tất Checkout' để hoàn thành."
                    type="success"
                    showIcon
                  />
                ) : checkoutSummary.final < 0 ? (
                  <Alert
                    message="Khách đã thanh toán thừa"
                    description={`Cần hoàn trả ${formatCurrency(
                      Math.abs(checkoutSummary.final)
                    )} cho khách.`}
                    type="warning"
                    showIcon
                  />
                ) : (
                  <Alert
                    message="Cần thanh toán thêm"
                    description={`Khách cần thanh toán thêm ${formatCurrency(
                      checkoutSummary.final
                    )}`}
                    type="info"
                    showIcon
                  />
                )}
              </div>
            </div>

            <Alert
              message="Lưu ý quan trọng"
              description={
                <div>
                  <p>1. Sau khi xác nhận checkout, hệ thống sẽ:</p>
                  <ul style={{ marginLeft: "20px" }}>
                    <li>Cập nhật trạng thái booking thành "check_out"</li>
                    <li>Mở lại phòng cho đặt tiếp</li>
                    <li>Tạo bản ghi thanh toán (nếu có)</li>
                  </ul>
                  <p style={{ marginTop: "8px" }}>
                    2. Quá trình này không thể hoàn tác.
                  </p>
                </div>
              }
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </Modal>

      {/* CHECKOUT PAYMENT MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShoppingCartOutlined style={{ color: "#1890ff" }} />
            <span>Thanh toán Checkout</span>
            <Tag color="blue" style={{ marginLeft: "auto" }}>
              Booking #{displayBookingId}
            </Tag>
          </div>
        }
        open={checkoutModalVisible}
        onCancel={() => !checkoutLoading && setCheckoutModalVisible(false)}
        onOk={handleCheckoutPayment}
        okText="Thanh toán"
        cancelText="Hủy"
        width={500}
        okButtonProps={{
          type: "primary",
          loading: checkoutLoading,
        }}
        cancelButtonProps={{ disabled: checkoutLoading }}
        closable={!checkoutLoading}
        maskClosable={!checkoutLoading}
      >
        <div style={{ padding: "16px 0" }}>
          <Alert
            message="Chọn phương thức thanh toán"
            description="Vui lòng chọn phương thức thanh toán cho khoản checkout"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          {checkoutSummary && (
            <div
              style={{
                background: "#f6ffed",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #b7eb8f",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "600" }}>Tổng thanh toán:</div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1890ff",
                  }}
                >
                  {formatCurrency(checkoutSummary.final)}
                </div>
              </div>
            </div>
          )}

          <Form layout="vertical">
            <Form.Item label="Phương thức thanh toán" required>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio value="cash" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <WalletOutlined style={{ color: "#52c41a" }} />
                      <div>
                        <div style={{ fontWeight: "600" }}>Tiền mặt</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Thanh toán trực tiếp tại quầy
                        </div>
                      </div>
                    </div>
                  </Radio>
                  <Radio value="vnpay" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <BankOutlined style={{ color: "#1890ff" }} />
                      <div>
                        <div style={{ fontWeight: "600" }}>VNPay</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Thanh toán qua ngân hàng/cổng VNPay
                        </div>
                      </div>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>

          <Alert
            message="Thông tin thanh toán"
            description={
              paymentMethod === "cash"
                ? "Sau khi xác nhận, hệ thống sẽ hoàn tất checkout và mở phòng."
                : "Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch."
            }
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      </Modal>

      {/* CHECKIN MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <span>Check-in Booking #{displayBookingId}</span>
            {roomTypeName && (
              <Tag color="blue" style={{ marginLeft: "auto" }}>
                {roomTypeName}
              </Tag>
            )}
          </div>
        }
        open={checkinModalVisible}
        onCancel={() => !checkinLoading && setCheckinModalVisible(false)}
        onOk={handleCheckin}
        okText="Xác nhận Check-in"
        cancelText="Hủy"
        width={700}
        okButtonProps={{
          type: "primary",
          loading: checkinLoading,
          style: { background: "#52c41a", borderColor: "#52c41a" },
        }}
        cancelButtonProps={{ disabled: checkinLoading }}
        closable={!checkinLoading}
        maskClosable={!checkinLoading}
      >
        <div style={{ padding: "16px 0" }}>
          <Alert
            message="Thông tin check-in"
            description={
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                    <div>
                      <strong>Booking:</strong> #{displayBookingId}
                    </div>
                    <div>
                      <strong>Khách hàng:</strong> {booking?.user?.name}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <strong>Thời gian:</strong>
                    </div>
                    <div>
                      {formatDate(booking?.check_in || "")} -{" "}
                      {formatDate(booking?.check_out || "")}
                    </div>
                  </Col>
                </Row>

                {/* Hiển thị phòng đã gắn */}
                {hasAssignedRooms && (
                  <div style={{ marginTop: 12 }}>
                    <strong>Phòng đã gắn:</strong>
                    <div style={{ marginTop: 8 }}>
                      {assignedRooms.map((room) => (
                        <Tag
                          key={room.id}
                          color="blue"
                          style={{ marginRight: 8 }}
                        >
                          Phòng {room.room_number}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            }
            type="info"
            style={{ marginBottom: 24 }}
          />

          {/* Room selection (chỉ hiển thị nếu chưa có assigned room) */}
          {!hasAssignedRooms && availableCheckinRooms.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: "600", marginBottom: 8 }}>
                Chọn phòng để check-in:
              </div>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn phòng"
                value={checkinForm.room_id}
                onChange={(value) =>
                  setCheckinForm({ ...checkinForm, room_id: value })
                }
                disabled={checkinLoading}
              >
                {availableCheckinRooms.map((room) => (
                  <Option key={room.room_id} value={room.room_id}>
                    Phòng {room.room_number} - {room.room_type_name} (Tầng{" "}
                    {room.floor})
                  </Option>
                ))}
              </Select>
              <Alert
                message="Lưu ý"
                description="Vui lòng chọn phòng trống để check-in"
                type="warning"
                showIcon
                style={{ marginTop: 8 }}
              />
            </div>
          )}

          {/* Guest information */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: "600" }}>Thông tin khách lưu trú *</div>
              <Button
                type="dashed"
                onClick={handleAddGuest}
                icon={<PlusOutlined />}
                size="small"
              >
                Thêm khách
              </Button>
            </div>

            {checkinForm.guests.map((guest, index) => (
              <Card
                key={index}
                size="small"
                style={{ marginBottom: 12, border: "1px solid #f0f0f0" }}
                title={`Khách ${index + 1}`}
                extra={
                  checkinForm.guests.length > 1 ? (
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() => handleRemoveGuest(index)}
                      disabled={checkinLoading}
                      icon={<DeleteOutlined />}
                    />
                  ) : null
                }
              >
                <Row gutter={16}>
                  <Col span={16}>
                    <Input
                      placeholder="Họ tên khách"
                      value={guest.name}
                      onChange={(e) =>
                        handleCheckinFormChange(index, "name", e.target.value)
                      }
                      disabled={checkinLoading}
                      prefix={<UserOutlined style={{ color: "#ccc" }} />}
                    />
                  </Col>
                  <Col span={8}>
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Tuổi"
                      value={guest.age}
                      onChange={(value) =>
                        handleCheckinFormChange(index, "age", value || 18)
                      }
                      min={0}
                      max={120}
                      disabled={checkinLoading}
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          <Alert
            message="Yêu cầu"
            description="Phải có ít nhất 1 khách. Tên khách không được để trống."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Divider />

          <div
            style={{
              background: "#f6ffed",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #b7eb8f",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: 4 }}>Tóm tắt:</div>
            <div>• Booking: #{displayBookingId}</div>
            <div>• Số khách: {checkinForm.guests.length} người</div>
            {hasAssignedRooms && (
              <div>
                • Phòng:{" "}
                {assignedRooms.map((r) => `Phòng ${r.room_number}`).join(", ")}
              </div>
            )}
            {checkinForm.room_id && !hasAssignedRooms && (
              <div>
                • Phòng:{" "}
                {
                  availableCheckinRooms.find(
                    (r) => r.room_id === checkinForm.room_id
                  )?.room_number
                }
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* DAMAGE MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ExclamationCircleOutlined style={{ color: "#fa8c16" }} />
            <span>Thêm Hư hỏng</span>
          </div>
        }
        open={damageModalVisible}
        onCancel={() => setDamageModalVisible(false)}
        onOk={handleAddDamage}
        okText="Ghi nhận"
        cancelText="Hủy"
        width={600}
        okButtonProps={{
          type: "primary",
          loading: damageLoading,
          style: { background: "#fa8c16", borderColor: "#fa8c16" },
        }}
        cancelButtonProps={{ disabled: damageLoading }}
        closable={!damageLoading}
        maskClosable={!damageLoading}
      >
        <div style={{ padding: "16px 0" }}>
          <Alert
            message="Thông báo"
            description={
              <div>
                <p>Bạn đang thêm hư hỏng cho Booking #{displayBookingId}</p>
                <p>
                  <strong>Khách hàng:</strong> {booking?.user?.name} (
                  {booking?.user?.email})
                </p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form layout="vertical">
            <Form.Item label={<strong>Loại hư hỏng *</strong>} required>
              <Select
                placeholder="Chọn loại hư hỏng"
                value={damageForm.damage_type_id || undefined}
                onChange={(value) =>
                  handleDamageFormChange("damage_type_id", value)
                }
                disabled={damageLoading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {damageTypes.map((type) => (
                  <Option
                    key={type.id}
                    value={type.id}
                    label={type.damage_type_name}
                  >
                    <div>
                      <div>{type.damage_type_name}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Giá: {formatCurrency(type.price)}
                        {type.description && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#999",
                              marginTop: 2,
                            }}
                          >
                            {type.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={<strong>Mô tả (tùy chọn)</strong>}>
              <TextArea
                placeholder="Mô tả chi tiết hư hỏng"
                value={damageForm.description}
                onChange={(e) =>
                  handleDamageFormChange("description", e.target.value)
                }
                rows={3}
                disabled={damageLoading}
              />
            </Form.Item>

            <Form.Item label={<strong>Ảnh minh chứng (tùy chọn)</strong>}>
              <Upload
                accept="image/*"
                beforeUpload={(file) => {
                  handleImageUpload(file);
                  return false; // Prevent auto upload
                }}
                showUploadList={false}
                disabled={damageLoading}
              >
                <Button icon={<UploadOutlined />} disabled={damageLoading}>
                  Tải ảnh lên
                </Button>
              </Upload>
              {damageForm.image && (
                <div style={{ marginTop: 8 }}>
                  <Alert
                    message="Đã tải ảnh lên thành công"
                    type="success"
                    showIcon
                  />
                </div>
              )}
            </Form.Item>
          </Form>

          <Alert
            message="Lưu ý"
            description="Hệ thống sẽ tự động tính tiền theo loại hư hỏng đã chọn. Ảnh và mô tả là tùy chọn."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      </Modal>

      {/* PENALTY MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <WarningOutlined style={{ color: "#ff4d4f" }} />
            <span>Thêm Phạt Trễ Check-out</span>
          </div>
        }
        open={penaltyModalVisible}
        onCancel={() => setPenaltyModalVisible(false)}
        onOk={handleAddPenalties}
        okText="Ghi nhận"
        cancelText="Hủy"
        width={500}
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
                  Bạn đang thêm phạt trễ check-out cho Booking #
                  {displayBookingId}
                </p>
                <p>
                  <strong>Khách hàng:</strong> {booking?.user?.name} (
                  {booking?.user?.email})
                </p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>
                <strong>Số ngày trễ *</strong>
              </div>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Số ngày trễ check-out"
                value={penaltyForm.days_late}
                onChange={(value) =>
                  handlePenaltyFormChange("days_late", value || 1)
                }
                min={1}
                max={30}
                disabled={penaltyLoading}
              />
              <div style={{ fontSize: "12px", color: "#999", marginTop: 4 }}>
                Số ngày khách trễ check-out
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>
                <strong>Số tiền phạt (VND) *</strong>
              </div>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập số tiền phạt"
                value={penaltyForm.amount}
                onChange={(value) =>
                  handlePenaltyFormChange("amount", value || 0)
                }
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                min={0}
                disabled={penaltyLoading}
              />
              <div style={{ fontSize: "12px", color: "#999", marginTop: 4 }}>
                Ví dụ: 100.000 VND
              </div>
            </Col>
          </Row>

          <Alert
            message="Lưu ý"
            description="Hệ thống sẽ tự động validate và trả về lỗi nếu booking không hợp lệ"
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      </Modal>

      {/* ASSIGN ROOM MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <KeyOutlined style={{ color: "#1890ff" }} />
            <span>Gắn phòng cho Booking #{displayBookingId}</span>
            <Tag color="blue" style={{ marginLeft: "auto" }}>
              {roomTypeName}
            </Tag>
          </div>
        }
        open={assignRoomModalVisible}
        onCancel={() => setAssignRoomModalVisible(false)}
        onOk={handleAssignRoom}
        okText="Gắn phòng"
        cancelText="Hủy"
        width={700}
        okButtonProps={{
          type: "primary",
          loading: assignRoomLoading,
          disabled: !selectedRoomId,
        }}
        cancelButtonProps={{ disabled: assignRoomLoading }}
        closable={!assignRoomLoading}
        maskClosable={!assignRoomLoading}
      >
        <div style={{ padding: "16px 0" }}>
          <Alert
            message="Thông tin booking"
            description={
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                    <div>
                      <strong>Loại phòng đặt:</strong>
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#1890ff",
                        fontWeight: "600",
                      }}
                    >
                      {roomTypeName}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <strong>Số lượng:</strong>
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "600" }}>
                      {booking?.items[0]?.quantity || 1} phòng
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {formatDate(booking?.check_in || "")} -{" "}
                  {formatDate(booking?.check_out || "")}
                </p>
                <p>
                  <strong>Khách hàng:</strong> {booking?.user?.name}
                </p>
              </div>
            }
            type="info"
            style={{ marginBottom: 24 }}
          />

          {roomSearchLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, color: "#666" }}>
                Đang tải danh sách phòng {roomTypeName}...
              </div>
            </div>
          ) : availableRooms.length > 0 ? (
            <div>
              <div style={{ fontWeight: "600", marginBottom: 16 }}>
                Chọn phòng {roomTypeName} trống:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "12px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "8px",
                }}
              >
                {availableRooms.map((room) => (
                  <div
                    key={room.room_id}
                    style={{
                      border:
                        selectedRoomId === room.room_id
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      background:
                        selectedRoomId === room.room_id ? "#e6f7ff" : "#ffffff",
                      transition: "all 0.3s",
                      textAlign: "center",
                    }}
                    onClick={() => setSelectedRoomId(room.room_id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "8px",
                        }}
                      >
                        {room.room_number}
                      </div>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "16px",
                          marginBottom: "4px",
                        }}
                      >
                        Phòng {room.room_number}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        {room.room_type_name || roomTypeName}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          marginBottom: "8px",
                        }}
                      >
                        Tầng {room.floor}
                      </div>
                      {selectedRoomId === room.room_id && (
                        <CheckOutlined
                          style={{
                            color: "#52c41a",
                            fontSize: "20px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedRoomId && (
                <Alert
                  message="Đã chọn phòng"
                  description={`Phòng ${
                    availableRooms.find((r) => r.room_id === selectedRoomId)
                      ?.room_number
                  } ({roomTypeName}) sẽ được gắn cho booking này.`}
                  type="success"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <ApartmentOutlined
                style={{
                  fontSize: "48px",
                  color: "#d9d9d9",
                  marginBottom: 16,
                }}
              />
              <div style={{ fontSize: "16px", color: "#999", marginBottom: 8 }}>
                Không có phòng {roomTypeName} trống
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Hiện không có phòng {roomTypeName} nào trống trong khoảng thời
                gian {formatDate(booking?.check_in || "")} -{" "}
                {formatDate(booking?.check_out || "")}.
              </div>
            </div>
          )}

          <Alert
            message="Lưu ý"
            description="Sau khi gắn phòng, hệ thống sẽ đánh dấu phòng là đã đặt và không thể gắn phòng khác cho booking này."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
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
                  <strong>Tổng thanh toán:</strong> {formatCurrency(grandTotal)}
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
    </div>
  );
}
