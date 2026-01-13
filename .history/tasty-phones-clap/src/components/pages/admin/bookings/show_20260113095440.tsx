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
  LockOutlined,
  DoorOutlined,
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
  room?: {
    room_number: string;
    floor: number;
    room_type: {
      room_type_name: string;
    };
  };
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
  assigned_rooms?: AssignedRoom[];
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

const assignedRoomStatusConfig: Record<
  string,
  { color: string; text: string }
> = {
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
  // FETCH BOOKING DETAILS - CẬP NHẬT ĐỂ LẤY PHÒNG ĐÃ GẮN
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

      const bookingData = bookingResponse.data?.data;

      if (!bookingData) {
        throw new Error("API không trả về dữ liệu booking");
      }

      // Fetch assigned rooms
      let assignedRooms: AssignedRoom[] = [];
      try {
        const assignedRoomsResponse = await axios.get(
          `${API_URL}/api/bookings/${id}/assigned-rooms`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        console.log(
          "🏨 Assigned Rooms API Response:",
          assignedRoomsResponse.data
        );

        if (assignedRoomsResponse.data.success) {
          assignedRooms = assignedRoomsResponse.data.data || [];
        }
      } catch (error) {
        console.log("No assigned rooms API or error checking:", error);
        // Try alternative endpoint
        try {
          const altResponse = await axios.get(
            `${API_URL}/api/bookings/${id}/rooms`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          if (altResponse.data.success) {
            assignedRooms = altResponse.data.data || [];
          }
        } catch (altError) {
          console.log("Alternative endpoint also failed");
        }
      }

      // Combine booking data with assigned rooms
      const combinedBookingData = {
        ...bookingData,
        assignedRooms: assignedRooms,
        assigned_rooms: assignedRooms, // Alternative property name
      };

      // Xác định pricing data
      let pricingData: Pricing;
      if (bookingResponse.data.pricing) {
        pricingData = bookingResponse.data.pricing;
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

      setBooking(combinedBookingData);
      setPricing(pricingData);

      // Check invoice status
      await checkInvoiceStatus(bookingData.id || bookingData.booking_id, token);

      console.log("✅ Booking data loaded:", combinedBookingData);
      console.log("🏨 Assigned rooms:", assignedRooms);
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

  // Helper function to get assigned rooms
  const getAssignedRooms = (): AssignedRoom[] => {
    if (!booking) return [];

    // Try multiple property names
    return (
      booking.assignedRooms ||
      booking.assigned_rooms ||
      (booking as any).rooms ||
      []
    );
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

      // Fetch available rooms - try multiple endpoints
      const endpoints = [
        `${API_URL}/api/rooms/available`,
        `${API_URL}/api/rooms?status=available`,
        `${API_URL}/api/admin/rooms/available`,
      ];

      let rooms: Room[] = [];

      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            params: {
              room_type_id: roomTypeId,
              check_in: booking.check_in,
              check_out: booking.check_out,
              exclude_assigned: true,
            },
          });

          if (response.data.success || Array.isArray(response.data.data)) {
            rooms = response.data.data || response.data.rooms || [];
            if (rooms.length > 0) break;
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed, trying next...`);
        }
      }

      // Filter by room type if needed
      if (rooms.length > 0) {
        rooms = rooms.filter((room) => room.room_type_id === roomTypeId);
      }

      setAvailableRooms(rooms);

      if (rooms.length === 0) {
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

        // Refresh data to show assigned room
        await fetchBookingDetails();

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
      } else if (error.response?.status === 409) {
        message.error("Phòng không khả dụng trong khoảng thời gian này");
      } else {
        message.error("Không thể gắn phòng");
      }
    } finally {
      setAssignRoomLoading(false);
    }
  };

  // Handle remove assigned room
  const handleRemoveAssignedRoom = async (assignedRoomId: number) => {
    Modal.confirm({
      title: "Xác nhận hủy gắn phòng",
      content: "Bạn có chắc chắn muốn hủy gắn phòng này?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          const authStr = localStorage.getItem("auth");
          const token = authStr ? JSON.parse(authStr).token : null;

          const response = await axios.delete(
            `${API_URL}/api/assigned-rooms/${assignedRoomId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            message.success("Đã hủy gắn phòng");
            fetchBookingDetails(); // Refresh data
          } else {
            message.error(response.data.message || "Có lỗi xảy ra");
          }
        } catch (error: any) {
          console.error("Error removing assigned room:", error);
          message.error(
            error.response?.data?.message || "Lỗi khi hủy gắn phòng"
          );
        }
      },
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

  // Get assigned rooms
  const assignedRooms = getAssignedRooms();
  const hasAssignedRooms = assignedRooms.length > 0;

  // Tổng đã thanh toán
  const totalPaid =
    booking.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  // Sử dụng grand_total từ pricing
  const grandTotal = pricing?.grand_total || booking.total_price;

  // Tính số tiền còn lại
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
    (booking.status === "paid" || booking.status === "confirmed") &&
    !hasAssignedRooms;

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
                    Đã gắn {assignedRooms.length} phòng
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
                  <DoorOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  Phòng Đã Gắn ({assignedRooms.length})
                </span>
              }
              style={{
                marginBottom: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              extra={
                canAssignRoom && (
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={showAssignRoomModal}
                  >
                    Thêm phòng
                  </Button>
                )
              }
            >
              <Row gutter={[16, 16]}>
                {assignedRooms.map((room) => {
                  const roomStatus = assignedRoomStatusConfig[room.status] || {
                    color: "default",
                    text: room.status,
                  };

                  const roomNumber =
                    room.room_number ||
                    room.room?.room_number ||
                    `Phòng ${room.room_id}`;

                  const floor = room.room?.floor || "N/A";
                  const roomTypeName =
                    room.room_type_name ||
                    room.room?.room_type?.room_type_name ||
                    "Không xác định";

                  return (
                    <Col xs={24} sm={12} md={8} key={room.id}>
                      <Card
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
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
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "24px",
                              fontWeight: "bold",
                              margin: "0 auto 12px",
                            }}
                          >
                            {roomNumber.replace(/\D/g, "") || "?"}
                          </div>

                          <div
                            style={{
                              fontWeight: "600",
                              fontSize: "18px",
                              marginBottom: "4px",
                            }}
                          >
                            Phòng {roomNumber}
                          </div>

                          <Tag
                            color={roomStatus.color}
                            style={{ marginBottom: "8px" }}
                          >
                            {roomStatus.text}
                          </Tag>

                          <div style={{ color: "#666", marginBottom: "4px" }}>
                            <HomeOutlined style={{ marginRight: "6px" }} />
                            {roomTypeName}
                          </div>

                          <div style={{ color: "#666", marginBottom: "4px" }}>
                            <LockOutlined style={{ marginRight: "6px" }} />
                            Tầng {floor}
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
                            Gắn lúc: {formatDateTime(room.created_at)}
                          </div>

                          {canAssignRoom && (
                            <Button
                              type="link"
                              danger
                              size="small"
                              onClick={() => handleRemoveAssignedRoom(room.id)}
                              style={{ marginTop: "8px" }}
                            >
                              <CloseOutlined /> Hủy gắn
                            </Button>
                          )}
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
                  Chưa gắn phòng
                </div>
                <div style={{ color: "#666", marginBottom: "16px" }}>
                  Booking này chưa được gắn phòng. Vui lòng gắn phòng để khách
                  có thể check-in.
                </div>
                <Button
                  type="primary"
                  icon={<KeyOutlined />}
                  onClick={showAssignRoomModal}
                  style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
                >
                  Gắn phòng ngay
                </Button>
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
                      .map(
                        (room) => room.room_number || `Phòng ${room.room_id}`
                      )
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
              {/* Assign Room Action */}
              {canAssignRoom ? (
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
                  Gắn phòng
                </Button>
              ) : hasAssignedRooms ? (
                <Button
                  type="default"
                  block
                  size="large"
                  onClick={showAssignRoomModal}
                  icon={<KeyOutlined />}
                  style={{
                    height: "48px",
                    fontSize: "16px",
                  }}
                  disabled={
                    booking.status !== "paid" && booking.status !== "confirmed"
                  }
                >
                  Đã gắn {assignedRooms.length} phòng
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

      {/* MODALS - DAMAGE, PENALTY, ASSIGN ROOM, INVOICE */}
      {/* (Các modal giữ nguyên từ code trước) */}
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
        {/* Modal content giữ nguyên */}
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
        {/* Modal content giữ nguyên */}
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
        {/* Modal content giữ nguyên */}
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
        {/* Modal content giữ nguyên */}
      </Modal>
    </div>
  );
}
