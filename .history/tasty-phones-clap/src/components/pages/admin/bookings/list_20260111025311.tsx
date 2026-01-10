import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Tag,
  Space,
  message,
  Spin,
  Descriptions,
  Divider,
  Popconfirm,
  List,
  Tooltip,
  Statistic,
  Alert,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  HomeOutlined,
  CloseOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;
const API_URL = "http://localhost:8000";

interface Booking {
  booking_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guest_number: number;
  status: string;
  booking_total_amount: number;
  remaining_balance: number;
  room_total_amount?: number;
  service_total_amount?: number;
  penalty_total_amount?: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  special_requests?: string;
  items?: any[];
  assigned_rooms?: any[];
  serviceCharges?: any[];
  penaltyCharges?: any[];
  created_at: string;
  updated_at: string;
}

interface Room {
  room_id: number;
  room_number: string;
  room_status: string;
  room_type_id: number;
  description?: string;
}

interface AssignedRoom {
  assigned_room_id: number;
  booking_id: number;
  room_id: number;
  room_type_id: number;
  check_in: string;
  check_out: string;
  created_at: string;
  updated_at: string;
  room: Room;
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [assignRoomModalVisible, setAssignRoomModalVisible] = useState(false);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [addPenaltyModalVisible, setAddPenaltyModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  // ===============================
  // FETCH BOOKINGS
  // ===============================
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/bookings`);
      setBookings(response.data.data.data || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách booking");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchAllRooms();
    fetchServices();
  }, []);

  // ===============================
  // FETCH ALL ROOMS
  // ===============================
  const fetchAllRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rooms`);
      setRooms(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng");
    }
  };

  // ===============================
  // FETCH AVAILABLE ROOMS FOR BOOKING DATE
  // ===============================
  const fetchAvailableRooms = async (booking: Booking) => {
    if (!booking) return;

    try {
      // Gọi API để lấy danh sách phòng trống trong khoảng thời gian booking
      const response = await axios.get(`${API_URL}/api/available-rooms`, {
        params: {
          check_in: booking.check_in,
          check_out: booking.check_out,
          room_type_id: booking.items?.[0]?.room_type_id, // Lấy room_type từ booking item đầu tiên
        },
      });

      setAvailableRooms(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng trống");
      // Fallback: lọc phòng có trạng thái available
      const available = rooms.filter(
        (room) => room.room_status === "available"
      );
      setAvailableRooms(available);
    }
  };

  // ===============================
  // FETCH SERVICES
  // ===============================
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách dịch vụ");
    }
  };

  // ===============================
  // STATUS CONFIGURATION
  // ===============================
  const statusConfig: Record<string, { color: string; text: string }> = {
    pending: { color: "orange", text: "Chờ xác nhận" },
    confirmed: { color: "blue", text: "Đã xác nhận" },
    checked_in: { color: "green", text: "Đã nhận phòng" },
    checked_out: { color: "purple", text: "Đã trả phòng" },
    cancelled: { color: "red", text: "Đã hủy" },
    paid: { color: "green", text: "Đã thanh toán" },
  };

  // ===============================
  // ROOM STATUS CONFIGURATION
  // ===============================
  const roomStatusConfig: Record<string, { color: string; text: string }> = {
    available: { color: "green", text: "Trống" },
    occupied: { color: "red", text: "Đã thuê" },
    maintenance: { color: "orange", text: "Bảo trì" },
    cleaning: { color: "blue", text: "Đang dọn" },
  };

  // ===============================
  // COLUMNS DEFINITION
  // ===============================
  const columns = [
    {
      title: "Mã Booking",
      dataIndex: "booking_id",
      key: "booking_id",
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (text: string, record: Booking) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text || "N/A"}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.customer_phone}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày nhận/trả",
      key: "dates",
      render: (record: Booking) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 500 }}>
            {dayjs(record.check_in).format("DD/MM/YYYY")}
          </div>
          <div>→</div>
          <div style={{ fontWeight: 500 }}>
            {dayjs(record.check_out).format("DD/MM/YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: "Số khách",
      dataIndex: "guest_number",
      key: "guest_number",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Phòng đã gán",
      key: "assigned_rooms",
      render: (record: Booking) => (
        <div>
          {record.assigned_rooms && record.assigned_rooms.length > 0 ? (
            <Space wrap>
              {record.assigned_rooms.map((ar: AssignedRoom) => (
                <Tag key={ar.assigned_room_id} color="blue">
                  {ar.room.room_number}
                </Tag>
              ))}
            </Space>
          ) : (
            <Tag color="orange">Chưa gán phòng</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "booking_total_amount",
      key: "booking_total_amount",
      render: (amount: number) =>
        amount ? (
          <span style={{ fontWeight: 500, color: "#1890ff" }}>
            {amount.toLocaleString()} ₫
          </span>
        ) : (
          "0 ₫"
        ),
    },
    {
      title: "Còn lại",
      dataIndex: "remaining_balance",
      key: "remaining_balance",
      render: (amount: number, record: Booking) => (
        <span
          style={{
            fontWeight: "bold",
            color: amount > 0 ? "#ff4d4f" : "#52c41a",
          }}
        >
          {amount.toLocaleString()} ₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 250,
      render: (record: Booking) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedBooking(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Gán phòng">
            <Button
              type="primary"
              icon={<HomeOutlined />}
              size="small"
              onClick={() => handleAssignRoomClick(record)}
              disabled={
                record.status === "paid" || record.status === "checked_out"
              }
            />
          </Tooltip>
          <Tooltip title="Xác nhận thanh toán">
            <Button
              type="primary"
              danger={record.remaining_balance > 0}
              icon={<DollarOutlined />}
              size="small"
              onClick={() => handlePaymentClick(record)}
              disabled={
                record.status === "paid" || record.remaining_balance === 0
              }
            >
              {record.remaining_balance > 0 ? "Thanh toán" : "Đã thanh toán"}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ===============================
  // HANDLE PAYMENT CLICK
  // ===============================
  const handlePaymentClick = (booking: Booking) => {
    setSelectedBooking(booking);
    paymentForm.setFieldsValue({
      paid_amount: booking.remaining_balance,
    });
    setPaymentModalVisible(true);
  };

  // ===============================
  // HANDLE CONFIRM PAYMENT
  // ===============================
  const handleConfirmPayment = async (values: any) => {
    if (!selectedBooking) return;

    setPaymentLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/bookings/${selectedBooking.booking_id}/confirm-payment`,
        {
          paid_amount: values.paid_amount,
        }
      );

      message.success("Xác nhận thanh toán thành công!");
      setPaymentModalVisible(false);

      // Cập nhật lại danh sách bookings
      fetchBookings();

      // Cập nhật selected booking với dữ liệu mới
      setSelectedBooking(response.data.data);
    } catch (error: any) {
      console.error("Payment confirmation error:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi xác nhận thanh toán";
      message.error(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  // ===============================
  // HANDLE ASSIGN ROOM CLICK
  // ===============================
  const handleAssignRoomClick = async (booking: Booking) => {
    setSelectedBooking(booking);
    await fetchAvailableRooms(booking);
    setAssignRoomModalVisible(true);
  };

  // ===============================
  // HANDLE ASSIGN ROOMS SUBMIT
  // ===============================
  const handleAssignRooms = async (values: any) => {
    if (!selectedBooking) return;

    setAssignLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/bookings/${selectedBooking.booking_id}/assign-rooms`,
        values
      );

      message.success("Gán phòng thành công");
      setAssignRoomModalVisible(false);

      // Cập nhật lại danh sách bookings
      fetchBookings();

      // Cập nhật selected booking với dữ liệu mới
      setSelectedBooking(response.data.data);
    } catch (error: any) {
      console.error("Assign room error:", error);
      const errorMessage = error.response?.data?.message || "Lỗi khi gán phòng";
      message.error(errorMessage);
    } finally {
      setAssignLoading(false);
    }
  };

  // ===============================
  // HANDLE REMOVE ASSIGNED ROOM
  // ===============================
  const handleRemoveAssignedRoom = async (assignedRoomId: number) => {
    if (!selectedBooking) return;

    try {
      // Gọi API để xóa phòng đã gán
      await axios.delete(
        `${API_URL}/api/bookings/${selectedBooking.booking_id}/assigned-rooms/${assignedRoomId}`
      );

      message.success("Xóa phòng đã gán thành công");
      fetchBookings();

      // Cập nhật selected booking
      const updatedBooking = { ...selectedBooking };
      if (updatedBooking.assigned_rooms) {
        updatedBooking.assigned_rooms = updatedBooking.assigned_rooms.filter(
          (ar: AssignedRoom) => ar.assigned_room_id !== assignedRoomId
        );
        setSelectedBooking(updatedBooking);
      }
    } catch (error: any) {
      console.error("Remove assigned room error:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi xóa phòng đã gán";
      message.error(errorMessage);
    }
  };

  // ===============================
  // RENDER ASSIGNED ROOMS SECTION
  // ===============================
  const renderAssignedRooms = () => {
    if (
      !selectedBooking?.assigned_rooms ||
      selectedBooking.assigned_rooms.length === 0
    ) {
      return (
        <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
          <HomeOutlined style={{ fontSize: "24px", marginBottom: "8px" }} />
          <div>Chưa có phòng nào được gán</div>
        </div>
      );
    }

    return (
      <List
        dataSource={selectedBooking.assigned_rooms}
        renderItem={(assignedRoom: AssignedRoom) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Xóa phòng đã gán?"
                description="Bạn có chắc muốn xóa phòng này khỏi booking?"
                onConfirm={() =>
                  handleRemoveAssignedRoom(assignedRoom.assigned_room_id)
                }
                okText="Xóa"
                cancelText="Hủy"
                disabled={
                  selectedBooking.status === "paid" ||
                  selectedBooking.status === "checked_out"
                }
              >
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  size="small"
                  disabled={
                    selectedBooking.status === "paid" ||
                    selectedBooking.status === "checked_out"
                  }
                >
                  Xóa
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <HomeOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
              }
              title={
                <Space>
                  <span>Phòng {assignedRoom.room.room_number}</span>
                  <Tag
                    color={
                      roomStatusConfig[assignedRoom.room.room_status]?.color ||
                      "default"
                    }
                  >
                    {roomStatusConfig[assignedRoom.room.room_status]?.text ||
                      assignedRoom.room.room_status}
                  </Tag>
                </Space>
              }
              description={
                <div>
                  <div>Loại phòng: {assignedRoom.room_type_id}</div>
                  <div>
                    Nhận phòng:{" "}
                    {dayjs(assignedRoom.check_in).format("DD/MM/YYYY HH:mm")}
                  </div>
                  <div>
                    Trả phòng:{" "}
                    {dayjs(assignedRoom.check_out).format("DD/MM/YYYY HH:mm")}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Quản lý Booking"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedBooking(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Tạo Booking Mới
          </Button>
        }
      >
        {/* Search and Filters */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Tìm theo tên khách hàng..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Select placeholder="Trạng thái" style={{ width: 150 }} allowClear>
              {Object.entries(statusConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.text}
                </Option>
              ))}
            </Select>
            <Button type="primary">Tìm kiếm</Button>
          </Space>
        </div>

        {/* Bookings Table */}
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="booking_id"
          loading={loading}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        title={`Chi tiết Booking #${selectedBooking?.booking_id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="assign"
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => handleAssignRoomClick(selectedBooking!)}
            disabled={
              selectedBooking?.status === "paid" ||
              selectedBooking?.status === "checked_out"
            }
          >
            Gán Phòng
          </Button>,
          <Button
            key="payment"
            type="primary"
            danger={selectedBooking?.remaining_balance > 0}
            icon={<DollarOutlined />}
            onClick={() => handlePaymentClick(selectedBooking!)}
            disabled={
              selectedBooking?.status === "paid" ||
              selectedBooking?.remaining_balance === 0
            }
          >
            {selectedBooking?.remaining_balance > 0
              ? "Xác nhận Thanh toán"
              : "Đã thanh toán"}
          </Button>,
        ]}
        width={800}
      >
        {selectedBooking && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Mã Booking">
              {selectedBooking.booking_id}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusConfig[selectedBooking.status]?.color}>
                {statusConfig[selectedBooking.status]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng" span={2}>
              {selectedBooking.customer_name} - {selectedBooking.customer_phone}
              <br />
              {selectedBooking.customer_email}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày nhận phòng">
              {dayjs(selectedBooking.check_in).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày trả phòng">
              {dayjs(selectedBooking.check_out).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Số khách">
              {selectedBooking.guest_number}
            </Descriptions.Item>

            {/* Phòng đã gán */}
            <Descriptions.Item label="Phòng đã gán" span={2}>
              {renderAssignedRooms()}
            </Descriptions.Item>

            <Descriptions.Item label="Tổng tiền phòng">
              {selectedBooking.room_total_amount?.toLocaleString()} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền dịch vụ">
              {selectedBooking.service_total_amount?.toLocaleString()} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Phụ phí">
              {selectedBooking.penalty_total_amount?.toLocaleString()} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Tổng cộng">
              <strong style={{ color: "#1890ff", fontSize: "16px" }}>
                {selectedBooking.booking_total_amount?.toLocaleString()} ₫
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Còn lại">
              <strong
                style={{
                  color:
                    selectedBooking.remaining_balance > 0
                      ? "#ff4d4f"
                      : "#52c41a",
                  fontSize: "16px",
                }}
              >
                {selectedBooking.remaining_balance?.toLocaleString()} ₫
              </strong>
            </Descriptions.Item>

            {/* Yêu cầu đặc biệt */}
            {selectedBooking.special_requests && (
              <Descriptions.Item label="Yêu cầu đặc biệt" span={2}>
                {selectedBooking.special_requests}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Assign Rooms Modal */}
      <Modal
        title={`Gán Phòng cho Booking #${selectedBooking?.booking_id}`}
        open={assignRoomModalVisible}
        onCancel={() => setAssignRoomModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form onFinish={handleAssignRooms}>
          <div
            style={{
              marginBottom: 16,
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "6px",
            }}
          >
            <strong>Thông tin booking:</strong>
            <div>Khách: {selectedBooking?.customer_name}</div>
            <div>
              Ngày: {dayjs(selectedBooking?.check_in).format("DD/MM/YYYY")} -{" "}
              {dayjs(selectedBooking?.check_out).format("DD/MM/YYYY")}
            </div>
            <div>Số khách: {selectedBooking?.guest_number}</div>
          </div>

          <Form.List name="rooms">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Chọn phòng để gán:</strong>
                </div>

                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "room_id"]}
                      rules={[{ required: true, message: "Chọn phòng" }]}
                      style={{ marginBottom: 8 }}
                    >
                      <Select
                        placeholder="Chọn phòng"
                        style={{ width: 300 }}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.children as unknown as string)
                            ?.toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {availableRooms.map((room) => (
                          <Option key={room.room_id} value={room.room_id}>
                            Phòng {room.room_number} -{" "}
                            {roomStatusConfig[room.room_status]?.text}
                            {room.description && ` - ${room.description}`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button
                        onClick={() => remove(field.name)}
                        danger
                        type="text"
                        icon={<CloseOutlined />}
                        style={{ marginTop: "4px" }}
                      />
                    )}
                  </Space>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  Thêm phòng
                </Button>
              </>
            )}
          </Form.List>

          {/* Hiển thị phòng đã gán (nếu có) */}
          {selectedBooking?.assigned_rooms &&
            selectedBooking.assigned_rooms.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Divider />
                <h4>Phòng đã gán:</h4>
                {selectedBooking.assigned_rooms.map((ar: AssignedRoom) => (
                  <Tag
                    key={ar.assigned_room_id}
                    color="blue"
                    closable
                    onClose={() =>
                      handleRemoveAssignedRoom(ar.assigned_room_id)
                    }
                  >
                    Phòng {ar.room.room_number}
                  </Tag>
                ))}
              </div>
            )}

          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button
              onClick={() => setAssignRoomModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={assignLoading}
              icon={<HomeOutlined />}
            >
              Gán Phòng
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal
        title={
          <Space>
            <DollarOutlined style={{ color: "#52c41a" }} />
            Xác nhận Thanh toán
          </Space>
        }
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedBooking && (
          <Form
            form={paymentForm}
            onFinish={handleConfirmPayment}
            layout="vertical"
          >
            <Alert
              message="Xác nhận thanh toán booking"
              description={`Booking #${selectedBooking.booking_id} - ${selectedBooking.customer_name}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Tổng số tiền"
                value={selectedBooking.booking_total_amount}
                formatter={(value) => `${value?.toLocaleString()} ₫`}
                valueStyle={{ color: "#1890ff" }}
              />
            </div>

            <Form.Item
              name="paid_amount"
              label="Số tiền thanh toán"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền thanh toán" },
                {
                  type: "number",
                  min: selectedBooking.remaining_balance,
                  message: `Số tiền thanh toán phải lớn hơn hoặc bằng ${selectedBooking.remaining_balance.toLocaleString()} ₫`,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập số tiền thanh toán"
                min={selectedBooking.remaining_balance}
                max={selectedBooking.booking_total_amount}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                size="large"
              />
            </Form.Item>

            <Alert
              message="Lưu ý quan trọng"
              description="Sau khi xác nhận thanh toán, trạng thái booking sẽ chuyển sang 'Đã thanh toán' và không thể thay đổi thông tin phòng."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <div style={{ textAlign: "right" }}>
              <Button
                onClick={() => setPaymentModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={paymentLoading}
                icon={<CheckCircleOutlined />}
                size="large"
                style={{
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
              >
                Xác nhận Thanh toán
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}
