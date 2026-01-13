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
  MoreOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  WarningOutlined,
  UploadOutlined,
  PictureOutlined,
  KeyOutlined,
  CheckOutlined,
  CloseOutlined,
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
  image?: string;
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
        // Tính toán từ booking data - BAO GỒM PHẠT
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

        // TÍNH LẠI TỔNG BAO GỒM PHẠT VÀ DAMAGE
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

      // Check invoice status
      await checkInvoiceStatus(bookingData.id || bookingData.booking_id, token);

      console.log("✅ Booking data loaded:", bookingData);
      console.log(
        "💰 Pricing data (includes penalties & damage):",
        pricingData
      );
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

  // Fetch damage types - SỬ DỤNG API CÓ SẴN HOẶC TẠO MỚI
  const fetchDamageTypes = async () => {
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      // THỬ API damage-types TRƯỚC
      try {
        const response = await axios.get(`${API_URL}/api/damage-types`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.data.success) {
          setDamageTypes(response.data.data || []);
          return;
        }
      } catch (error) {
        console.log("API damage-types không tồn tại, sử dụng mock data");
      }

      // NẾU API KHÔNG TỒN TẠI, DÙNG MOCK DATA
      const mockDamageTypes = [
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
        {
          id: 4,
          damage_type_name: "Nệm bẩn",
          price: 1000000,
          description: "Nệm bị ố màu không thể tẩy",
        },
        {
          id: 5,
          damage_type_name: "Hư điều hòa",
          price: 1500000,
          description: "Hư hỏng điều hòa",
        },
      ];

      setDamageTypes(mockDamageTypes);
    } catch (error) {
      console.error("Error fetching damage types:", error);
      // Vẫn dùng mock data nếu có lỗi
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

  // Open assign room modal
  const showAssignRoomModal = async () => {
    if (!booking) return;

    setSelectedRoomId(null);
    setAssignRoomModalVisible(true);

    // Fetch available rooms
    await fetchAvailableRooms();
  };

  // Fetch available rooms
  const fetchAvailableRooms = async () => {
    if (!booking) return;

    setRoomSearchLoading(true);
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      // Get room type from booking items
      const roomTypeId = booking.items[0]?.room_type_id;
      if (!roomTypeId) {
        message.error("Không tìm thấy loại phòng trong booking");
        return;
      }

      // Fetch rooms of the same type that are available
      const response = await axios.get(`${API_URL}/api/rooms`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: {
          room_type_id: roomTypeId,
          status: "available",
          check_in: booking.check_in,
          check_out: booking.check_out,
        },
      });

      if (response.data.success) {
        setAvailableRooms(response.data.data || []);
      } else {
        setAvailableRooms([]);
        message.warning("Không tìm thấy phòng trống phù hợp");
      }
    } catch (error: any) {
      console.error("Error fetching available rooms:", error);
      message.error("Lỗi khi tải danh sách phòng");
      setAvailableRooms([]);
    } finally {
      setRoomSearchLoading(false);
    }
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

      if (response.data.success) {
        message.success("Gắn phòng thành công!");
        setAssignRoomModalVisible(false);
        fetchBookingDetails(); // Refresh data
        setSelectedRoomId(null);
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
        message.error("Không thể gắn phòng");
      }
    } finally {
      setAssignRoomLoading(false);
    }
  };

  // Handle image upload - SỬ DỤNG API UPLOAD CÓ SẴN
  const handleImageUpload = async (file: File) => {
    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const formData = new FormData();
      formData.append("image", file);

      // THỬ CÁC API UPLOAD KHÁC NHAU
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
        // Nếu không có API upload, vẫn cho tiếp tục nhưng không có ảnh
        message.warning("Không thể tải ảnh lên, tiếp tục không có ảnh");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Lỗi khi tải ảnh lên");
    }
  };

  // Submit damage - SỬ DỤNG API ĐÚNG THEO ROUTE ĐÃ ĐỊNH NGHĨA
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

      console.log(
        "📤 Sending to API:",
        `${API_URL}/api/bookings/${id}/damages`
      );
      console.log("📦 Payload:", payload);

      const response = await axios.post(
        `${API_URL}/api/bookings/${id}/damages`, // ĐÚNG ROUTE THEO ĐỊNH NGHĨA
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Damage API Response:", response.data);

      if (response.data.success) {
        message.success("Ghi nhận hư hỏng thành công!");
        setDamageModalVisible(false);
        fetchBookingDetails(); // Refresh data
        // Reset form
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

  // Submit penalties - SỬ DỤNG API ĐÚNG THEO ROUTE ĐÃ ĐỊNH NGHĨA
  const handleAddPenalties = async () => {
    if (!booking || !id) return;

    // Validate
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

      console.log(
        "📤 Sending to API:",
        `${API_URL}/api/bookings/${id}/penalties`
      );
      console.log("📦 Payload:", payload);

      const response = await axios.post(
        `${API_URL}/api/bookings/${id}/penalties`, // ĐÚNG ROUTE THEO ĐỊNH NGHĨA
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Penalty API Response:", response.data);

      if (response.data.success) {
        message.success("Ghi nhận phạt thành công!");
        setPenaltyModalVisible(false);
        fetchBookingDetails(); // Refresh data
        // Reset form
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

  // Handle confirm checkout
  const handleConfirmCheckout = async () => {
    if (!booking || !id) return;

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.post(
        `${API_URL}/api/admin/bookings/${id}/checkout/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success("Đã xác nhận checkout!");
        fetchBookingDetails();
      } else {
        message.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("Error confirming checkout:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi xác nhận checkout"
      );
    }
  };

  // Handle get checkout summary
  const handleGetCheckoutSummary = async () => {
    if (!booking || !id) return;

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      const response = await axios.get(
        `${API_URL}/api/admin/bookings/${id}/checkout/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const summary = response.data.data;
        Modal.info({
          title: "Tổng thanh toán checkout",
          content: (
            <div>
              <p>Tiền phòng: {formatCurrency(summary.room)}</p>
              <p>Dịch vụ: {formatCurrency(summary.service)}</p>
              <p>Hư hỏng: {formatCurrency(summary.damage)}</p>
              <p>Phạt: {formatCurrency(summary.penalty)}</p>
              <p>Đã trả trước: {formatCurrency(summary.prepaid)}</p>
              <Divider />
              <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                Tổng thanh toán: {formatCurrency(summary.final)}
              </p>
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error getting checkout summary:", error);
      message.error("Lỗi khi lấy tổng thanh toán");
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
  // CALCULATED VALUES - TÍNH TOÁN LẠI ĐỂ BAO GỒM PHẠT
  // ============================================
  const displayBookingId = booking.booking_id || booking.id;
  const status = statusConfig[booking.status] || {
    color: "default",
    text: booking.status,
  };

  // Tổng đã thanh toán
  const totalPaid =
    booking.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  // Sử dụng grand_total từ pricing (đã bao gồm phạt và damage)
  const grandTotal = pricing?.grand_total || booking.total_price;

  // Tính số tiền còn lại PHẢI BAO GỒM CẢ PHẠT VÀ DAMAGE
  const balanceDue = Math.max(0, grandTotal - totalPaid);

  const canCreateInvoice =
    booking.status === "check_out" || booking.status === "completed";

  // CHỈ HIỂN THỊ NÚT THÊM PHẠT VÀ DAMAGE KHI ĐANG LƯU TRÚ
  const canAddCharges =
    booking.status === "check_in" ||
    booking.status === "checked_in" ||
    booking.status === "in_use";

  // Check if can assign room (only for paid bookings)
  const canAssignRoom =
    booking.status === "paid" || booking.status === "confirmed";

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
          {/* ASSIGNED ROOMS SECTION */}
          {booking.assignedRooms && booking.assignedRooms.length > 0 && (
            <Card
              title={
                <span style={{ fontWeight: "600", fontSize: "16px" }}>
                  <KeyOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  Phòng Đã Gắn
                </span>
              }
              style={{
                marginBottom: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <List
                dataSource={booking.assignedRooms}
                renderItem={(room) => {
                  const roomStatus = roomStatusConfig[room.status] || {
                    color: "default",
                    text: room.status,
                  };

                  return (
                    <List.Item
                      key={room.id}
                      style={{
                        padding: "16px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        background: "#fafafa",
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "8px",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "24px",
                              fontWeight: "bold",
                            }}
                          >
                            {room.room_number}
                          </div>
                        }
                        title={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <span
                              style={{ fontSize: "18px", fontWeight: "600" }}
                            >
                              Phòng {room.room_number}
                            </span>
                            <Tag
                              color={roomStatus.color}
                              style={{ fontSize: "12px" }}
                            >
                              {roomStatus.text}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginTop: "4px", color: "#666" }}>
                              <HomeOutlined style={{ marginRight: "6px" }} />
                              {room.room_type_name}
                            </div>
                            <div style={{ marginTop: "4px", color: "#666" }}>
                              <CalendarOutlined
                                style={{ marginRight: "6px" }}
                              />
                              Check-in: {formatDate(room.check_in)} | Check-out:{" "}
                              {formatDate(room.check_out)}
                            </div>
                            <div
                              style={{
                                marginTop: "4px",
                                fontSize: "12px",
                                color: "#999",
                              }}
                            >
                              Gắn lúc: {formatDateTime(room.created_at)}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
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
              {booking.assignedRooms && booking.assignedRooms.length > 0 && (
                <Timeline.Item
                  color="blue"
                  label={formatDateTime(booking.assignedRooms[0].created_at)}
                >
                  <div style={{ fontWeight: "600" }}>Phòng đã được gắn</div>
                  <div style={{ color: "#666" }}>
                    {booking.assignedRooms
                      .map((room) => `Phòng ${room.room_number}`)
                      .join(", ")}
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

          {/* PAYMENT SUMMARY - SỬ DỤNG GRAND_TOTAL BAO GỒM PHẠT & DAMAGE */}
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

              {/* SỐ TIỀN CÒN LẠI TÍNH TỪ GRAND_TOTAL (ĐÃ BAO GỒM PHẠT & DAMAGE) */}
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
              {/* Assign Room Action - chỉ hiển thị khi booking đã thanh toán */}
              {canAssignRoom && (
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
                  disabled={
                    booking.assignedRooms && booking.assignedRooms.length > 0
                  }
                >
                  {booking.assignedRooms && booking.assignedRooms.length > 0
                    ? "Đã gắn phòng"
                    : "Gắn phòng"}
                </Button>
              )}

              {/* Checkout Actions - chỉ hiển thị khi đang lưu trú */}
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

                  <Button
                    type="default"
                    block
                    size="large"
                    onClick={handleGetCheckoutSummary}
                    icon={<DollarOutlined />}
                    style={{ height: "48px", fontSize: "16px" }}
                  >
                    Xem Tổng Thanh Toán
                  </Button>

                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleConfirmCheckout}
                    icon={<CheckCircleOutlined />}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      background: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                  >
                    Xác nhận Checkout
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
          </div>
        }
        open={assignRoomModalVisible}
        onCancel={() => setAssignRoomModalVisible(false)}
        onOk={handleAssignRoom}
        okText="Gắn phòng"
        cancelText="Hủy"
        width={600}
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
            message="Thông báo"
            description={
              <div>
                <p>
                  Chọn phòng để gắn cho booking này. Chỉ hiển thị các phòng
                  trống cùng loại với booking.
                </p>
                <p>
                  <strong>Khách hàng:</strong> {booking?.user?.name} (
                  {booking?.user?.email})
                </p>
                <p>
                  <strong>Loại phòng đặt:</strong>{" "}
                  {booking?.items[0]?.room_type_name}
                </p>
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {formatDate(booking?.check_in || "")} -{" "}
                  {formatDate(booking?.check_out || "")}
                </p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          {roomSearchLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, color: "#666" }}>
                Đang tải danh sách phòng...
              </div>
            </div>
          ) : availableRooms.length > 0 ? (
            <div>
              <div style={{ marginBottom: 16, fontWeight: "600" }}>
                Chọn phòng:
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
                          textAlign: "center",
                        }}
                      >
                        Phòng {room.room_number}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                          textAlign: "center",
                        }}
                      >
                        {room.room_type_name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          marginTop: "4px",
                        }}
                      >
                        Tầng {room.floor}
                      </div>
                      {selectedRoomId === room.room_id && (
                        <CheckOutlined
                          style={{
                            color: "#52c41a",
                            fontSize: "20px",
                            marginTop: "8px",
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
                  } sẽ được gắn cho booking này.`}
                  type="success"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <HomeOutlined
                style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: 16 }}
              />
              <div style={{ fontSize: "16px", color: "#999", marginBottom: 8 }}>
                Không có phòng trống phù hợp
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Không tìm thấy phòng trống cùng loại trong khoảng thời gian này.
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
