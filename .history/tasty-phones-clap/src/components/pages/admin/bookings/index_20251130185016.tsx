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
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
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
  assignedRooms?: any[];
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
}

interface Service {
  service_id: number;
  service_name: string;
  service_price: number;
}

export default function BookingClientAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [assignRoomModalVisible, setAssignRoomModalVisible] = useState(false);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [addPenaltyModalVisible, setAddPenaltyModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

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
    fetchRooms();
    fetchServices();
  }, []);

  // ===============================
  // FETCH ROOMS FOR ASSIGNMENT
  // ===============================
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rooms`);
      setRooms(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng");
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
          <div>{text || "N/A"}</div>
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
        <div>
          <div>{dayjs(record.check_in).format("DD/MM/YYYY")}</div>
          <div>{dayjs(record.check_out).format("DD/MM/YYYY")}</div>
        </div>
      ),
    },
    {
      title: "Số khách",
      dataIndex: "guest_number",
      key: "guest_number",
      width: 100,
    },
    {
      title: "Tổng tiền",
      dataIndex: "booking_total_amount",
      key: "booking_total_amount",
      render: (amount: number) =>
        amount ? `${amount.toLocaleString()} ₫` : "0 ₫",
    },
    {
      title: "Còn lại",
      dataIndex: "remaining_balance",
      key: "remaining_balance",
      render: (amount: number) =>
        amount ? `${amount.toLocaleString()} ₫` : "0 ₫",
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
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (record: Booking) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setDetailModalVisible(true);
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  // ===============================
  // HANDLE EDIT
  // ===============================
  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    form.setFieldsValue({
      ...booking,
      check_in: dayjs(booking.check_in),
      check_out: dayjs(booking.check_out),
    });
    setModalVisible(true);
  };

  // ===============================
  // HANDLE SUBMIT
  // ===============================
  const handleSubmit = async (values: any) => {
    try {
      if (selectedBooking) {
        // Update existing booking
        await axios.put(
          `${API_URL}/api/bookings/${selectedBooking.booking_id}`,
          values
        );
        message.success("Cập nhật booking thành công");
      } else {
        // Create new booking
        await axios.post(`${API_URL}/api/bookings`, values);
        message.success("Tạo booking thành công");
      }
      setModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Lỗi khi lưu booking");
    }
  };

  // ===============================
  // HANDLE ASSIGN ROOMS
  // ===============================
  const handleAssignRooms = async (values: any) => {
    if (!selectedBooking) return;

    try {
      await axios.post(
        `${API_URL}/api/bookings/${selectedBooking.booking_id}/assign-rooms`,
        values
      );
      message.success("Gán phòng thành công");
      setAssignRoomModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Lỗi khi gán phòng");
    }
  };

  // ===============================
  // HANDLE ADD SERVICES
  // ===============================
  const handleAddServices = async (values: any) => {
    if (!selectedBooking) return;

    try {
      await axios.put(
        `${API_URL}/api/bookings/${selectedBooking.booking_id}/add-services`,
        values
      );
      message.success("Thêm dịch vụ thành công");
      setAddServiceModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Lỗi khi thêm dịch vụ");
    }
  };

  // ===============================
  // HANDLE ADD PENALTIES
  // ===============================
  const handleAddPenalties = async (values: any) => {
    if (!selectedBooking) return;

    try {
      await axios.post(
        `${API_URL}/api/bookings/${selectedBooking.booking_id}/add-penalties`,
        values
      );
      message.success("Thêm phụ phí thành công");
      setAddPenaltyModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Lỗi khi thêm phụ phí");
    }
  };

  // ===============================
  // HANDLE PAYMENT
  // ===============================
  const handlePayment = async (values: any) => {
    if (!selectedBooking) return;

    try {
      await axios.post(
        `${API_URL}/api/bookings/${selectedBooking.booking_id}/confirm-payment`,
        values
      );
      message.success("Xác nhận thanh toán thành công");
      setPaymentModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Lỗi khi xác nhận thanh toán");
    }
  };

  // ===============================
  // RENDER
  // ===============================
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
            <RangePicker />
            <Button type="primary">Tìm kiếm</Button>
          </Space>
        </div>

        {/* Bookings Table */}
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="booking_id"
          loading={loading}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        title="Chi tiết Booking"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={() => setAssignRoomModalVisible(true)}
          >
            Gán Phòng
          </Button>,
          <Button key="service" onClick={() => setAddServiceModalVisible(true)}>
            Thêm DV
          </Button>,
          <Button key="penalty" onClick={() => setAddPenaltyModalVisible(true)}>
            Thêm Phụ Phí
          </Button>,
          <Button
            key="payment"
            type="primary"
            danger
            onClick={() => setPaymentModalVisible(true)}
          >
            Xác nhận TT
          </Button>,
        ]}
        width={800}
      >
        {selectedBooking && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Mã Booking" span={1}>
              {selectedBooking.booking_id}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={1}>
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
              {dayjs(selectedBooking.check_in).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày trả phòng">
              {dayjs(selectedBooking.check_out).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Số khách">
              {selectedBooking.guest_number}
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
              <strong>
                {selectedBooking.booking_total_amount?.toLocaleString()} ₫
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Còn lại">
              <strong>
                {selectedBooking.remaining_balance?.toLocaleString()} ₫
              </strong>
            </Descriptions.Item>

            {/* Assigned Rooms */}
            {selectedBooking.assignedRooms &&
              selectedBooking.assignedRooms.length > 0 && (
                <Descriptions.Item label="Phòng đã gán" span={2}>
                  {selectedBooking.assignedRooms.map((room: any) => (
                    <Tag key={room.room_id} color="blue">
                      {room.room?.room_number}
                    </Tag>
                  ))}
                </Descriptions.Item>
              )}

            {/* Services */}
            {selectedBooking.serviceCharges &&
              selectedBooking.serviceCharges.length > 0 && (
                <Descriptions.Item label="Dịch vụ" span={2}>
                  {selectedBooking.serviceCharges.map((service: any) => (
                    <div key={service.service_charge_id}>
                      {service.service?.service_name} x {service.quantity} -{" "}
                      {service.amount.toLocaleString()} ₫
                    </div>
                  ))}
                </Descriptions.Item>
              )}

            {/* Special Requests */}
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
        title="Gán Phòng cho Booking"
        open={assignRoomModalVisible}
        onCancel={() => setAssignRoomModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAssignRooms}>
          <Form.List name="rooms">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "room_id"]}
                      rules={[{ required: true, message: "Chọn phòng" }]}
                    >
                      <Select placeholder="Chọn phòng" style={{ width: 200 }}>
                        {rooms
                          .filter((room) => room.room_status === "available")
                          .map((room) => (
                            <Option key={room.room_id} value={room.room_id}>
                              {room.room_number}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Button onClick={() => remove(field.name)} danger>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm phòng
                </Button>
              </>
            )}
          </Form.List>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button
              onClick={() => setAssignRoomModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Gán Phòng
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Services Modal */}
      <Modal
        title="Thêm Dịch vụ"
        open={addServiceModalVisible}
        onCancel={() => setAddServiceModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddServices}>
          <Form.List name="services">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "service_id"]}
                      rules={[{ required: true, message: "Chọn dịch vụ" }]}
                    >
                      <Select placeholder="Chọn dịch vụ" style={{ width: 200 }}>
                        {services.map((service) => (
                          <Option
                            key={service.service_id}
                            value={service.service_id}
                          >
                            {service.service_name} -{" "}
                            {service.service_price.toLocaleString()} ₫
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "quantity"]}
                      rules={[{ required: true, message: "Nhập số lượng" }]}
                    >
                      <InputNumber placeholder="Số lượng" min={1} />
                    </Form.Item>
                    <Button onClick={() => remove(field.name)} danger>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm dịch vụ
                </Button>
              </>
            )}
          </Form.List>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button
              onClick={() => setAddServiceModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm Dịch vụ
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Penalties Modal */}
      <Modal
        title="Thêm Phụ phí/Phạt"
        open={addPenaltyModalVisible}
        onCancel={() => setAddPenaltyModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddPenalties}>
          <Form.List name="penalties">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "description"]}
                      rules={[{ required: true, message: "Nhập mô tả" }]}
                    >
                      <Input placeholder="Mô tả" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "amount"]}
                      rules={[{ required: true, message: "Nhập số tiền" }]}
                    >
                      <InputNumber placeholder="Số tiền" min={0} />
                    </Form.Item>
                    <Button onClick={() => remove(field.name)} danger>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm phụ phí
                </Button>
              </>
            )}
          </Form.List>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button
              onClick={() => setAddPenaltyModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm Phụ phí
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        title="Xác nhận Thanh toán"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
      >
        {selectedBooking && (
          <Form onFinish={handlePayment}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tổng số tiền">
                <strong>
                  {selectedBooking.booking_total_amount?.toLocaleString()} ₫
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền còn lại">
                <strong>
                  {selectedBooking.remaining_balance?.toLocaleString()} ₫
                </strong>
              </Descriptions.Item>
            </Descriptions>

            <Form.Item
              name="paid_amount"
              label="Số tiền thanh toán"
              rules={[
                { required: true, message: "Nhập số tiền" },
                {
                  validator: (_, value) => {
                    if (value < (selectedBooking.remaining_balance || 0)) {
                      return Promise.reject(
                        new Error(
                          "Số tiền thanh toán phải lớn hơn hoặc bằng số tiền còn lại"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={{ marginTop: 16 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập số tiền thanh toán"
                min={selectedBooking.remaining_balance || 0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
              />
            </Form.Item>

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Button
                onClick={() => setPaymentModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" danger>
                Xác nhận Thanh toán
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}
