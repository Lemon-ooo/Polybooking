import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Tag,
  Space,
  message,
  Spin,
  Descriptions,
  Select,
  Input,
  DatePicker,
  Tooltip,
  Badge,
  Popconfirm,
  Dropdown,
  Menu,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Option } = Select;
const API_URL = "http://localhost:8000";

interface Booking {
  booking_id: number;
  user: {
    user_id: number;
    name: string;
    email: string;
  };
  check_in: string;
  check_out: string;
  nights: number;
  subtotal_price: number;
  voucher_code: string | null;
  voucher_discount: number;
  total_price: number;
  status: string;
  created_at: string;
  items: BookingItem[];
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

export default function BookingList() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: null as string | null,
    search: "",
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
  });

  // ===============================
  // FETCH BOOKINGS
  // ===============================
  const fetchBookings = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        per_page: pageSize,
      };

      // Thêm filters
      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        params.from_date = filters.dateRange[0].format("YYYY-MM-DD");
        params.to_date = filters.dateRange[1].format("YYYY-MM-DD");
      }

      const token = localStorage.getItem("auth")
        ? JSON.parse(localStorage.getItem("auth")!).token
        : null;

      const response = await axios.get(`${API_URL}/api/bookings`, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("Bookings API Response:", response.data);

      // Xử lý response theo cấu trúc mới
      const responseData = response.data?.data;

      if (responseData && responseData.data) {
        // Paginated response
        setBookings(responseData.data);
        setPagination({
          current: responseData.current_page || 1,
          pageSize: responseData.per_page || 10,
          total: responseData.total || 0,
        });
      } else if (Array.isArray(responseData)) {
        // Array response (non-paginated)
        setBookings(responseData);
        setPagination({
          current: 1,
          pageSize: responseData.length,
          total: responseData.length,
        });
      } else if (Array.isArray(response.data)) {
        // Fallback
        setBookings(response.data);
        setPagination({
          current: 1,
          pageSize: response.data.length,
          total: response.data.length,
        });
      } else {
        setBookings([]);
        message.warning("Không có dữ liệu booking");
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi tải danh sách booking"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ===============================
  // STATUS CONFIGURATION
  // ===============================
  const statusConfig: Record<
    string,
    { color: string; text: string; badge: string }
  > = {
    pending_payment: {
      color: "orange",
      text: "Chờ thanh toán",
      badge: "warning",
    },
    pending: { color: "orange", text: "Chờ xác nhận", badge: "warning" },
    confirmed: { color: "blue", text: "Đã xác nhận", badge: "processing" },
    paid: { color: "green", text: "Đã thanh toán", badge: "success" },
    check_in: { color: "green", text: "Đã nhận phòng", badge: "success" },
    check_out: { color: "purple", text: "Đã trả phòng", badge: "default" },
    canceled: { color: "red", text: "Đã hủy", badge: "error" },
  };

  // ===============================
  // HANDLE TABLE CHANGE
  // ===============================
  const handleTableChange = (pagination: any) => {
    fetchBookings(pagination.current, pagination.pageSize);
  };

  // ===============================
  // HANDLE FILTER CHANGE
  // ===============================
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ===============================
  // APPLY FILTERS
  // ===============================
  const applyFilters = () => {
    fetchBookings(1, pagination.pageSize);
  };

  // ===============================
  // RESET FILTERS
  // ===============================
  const resetFilters = () => {
    setFilters({
      status: null,
      search: "",
      dateRange: null,
    });
    fetchBookings(1, pagination.pageSize);
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
  // COLUMNS DEFINITION
  // ===============================
  const columns = [
    {
      title: "Mã Booking",
      dataIndex: "booking_id",
      key: "booking_id",
      width: 100,
      fixed: "left" as const,
      render: (id: number) => (
        <span style={{ fontWeight: 600, color: "#1890ff" }}>#{id}</span>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (record: Booking) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>
            <UserOutlined style={{ marginRight: 6, color: "#666" }} />
            {record.user?.name || "Không có tên"}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: 2 }}>
            {record.user?.email}
          </div>
          <div style={{ fontSize: "12px", color: "#999" }}>
            ID: {record.user?.user_id}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "dates",
      width: 180,
      render: (record: Booking) => (
        <div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: 2 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            Nhận phòng
          </div>
          <div style={{ fontWeight: 500, fontSize: "13px" }}>
            {dayjs(record.check_in).format("DD/MM/YYYY")}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
            Trả phòng
          </div>
          <div style={{ fontWeight: 500, fontSize: "13px" }}>
            {dayjs(record.check_out).format("DD/MM/YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: "Số đêm",
      dataIndex: "nights",
      key: "nights",
      width: 80,
      align: "center" as const,
      render: (nights: number) => (
        <Badge count={nights} style={{ backgroundColor: "#52c41a" }} />
      ),
    },
    {
      title: "Loại phòng",
      key: "rooms",
      width: 180,
      render: (record: Booking) => (
        <div>
          {record.items?.map((item, index) => (
            <div
              key={item.booking_item_id}
              style={{ marginBottom: index < record.items.length - 1 ? 4 : 0 }}
            >
              <div style={{ fontSize: "12px" }}>
                {item.room_type_name} × {item.quantity}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      key: "amount",
      width: 150,
      render: (record: Booking) => (
        <div>
          <div style={{ fontSize: "12px", color: "#666" }}>Tổng:</div>
          <div style={{ fontWeight: 600, color: "#1890ff", fontSize: "14px" }}>
            {formatCurrency(record.total_price)}
          </div>
          {record.voucher_discount > 0 && (
            <div style={{ fontSize: "11px", color: "#52c41a", marginTop: 2 }}>
              -{formatCurrency(record.voucher_discount)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => {
        const config = statusConfig[status] || {
          color: "default",
          text: status,
          badge: "default",
        };
        return (
          <Badge
            status={config.badge as any}
            text={
              <Tag
                color={config.color}
                style={{ border: "none", padding: "2px 8px" }}
              >
                {config.text}
              </Tag>
            }
          />
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date: string) => (
        <div style={{ fontSize: "12px", color: "#666" }}>
          {dayjs(date).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      fixed: "right" as const,
      render: (record: Booking) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/bookings/show/${record.booking_id}`)}
          >
            Xem chi tiết
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="payment"
                  icon={<DollarOutlined />}
                  onClick={() => handleAction(record, "payment")}
                  disabled={
                    record.status === "paid" || record.status === "canceled"
                  }
                >
                  {record.status === "paid"
                    ? "Đã thanh toán"
                    : "Xác nhận thanh toán"}
                </Menu.Item>
                <Menu.Item
                  key="cancel"
                  danger
                  onClick={() => handleAction(record, "cancel")}
                  disabled={
                    record.status === "canceled" ||
                    record.status === "check_out"
                  }
                >
                  Hủy booking
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="send_email"
                  onClick={() => handleAction(record, "send_email")}
                >
                  Gửi email xác nhận
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button icon={<MoreOutlined />} size="small" type="text" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // ===============================
  // HANDLE ACTION
  // ===============================
  const handleAction = async (booking: Booking, action: string) => {
    const token = localStorage.getItem("auth")
      ? JSON.parse(localStorage.getItem("auth")!).token
      : null;

    try {
      switch (action) {
        case "payment":
          // Gọi API xác nhận thanh toán
          await axios.put(
            `${API_URL}/api/bookings/${booking.booking_id}/confirm-payment`,
            { paid_amount: booking.total_price },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success("Xác nhận thanh toán thành công!");
          fetchBookings(pagination.current, pagination.pageSize);
          break;

        case "cancel":
          Modal.confirm({
            title: "Xác nhận hủy booking",
            content: `Bạn có chắc muốn hủy booking #${booking.booking_id}?`,
            okText: "Hủy booking",
            okType: "danger",
            cancelText: "Thoát",
            onOk: async () => {
              await axios.put(
                `${API_URL}/api/bookings/${booking.booking_id}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              message.success("Hủy booking thành công!");
              fetchBookings(pagination.current, pagination.pageSize);
            },
          });
          break;

        case "send_email":
          // Gửi email xác nhận
          await axios.post(
            `${API_URL}/api/bookings/${booking.booking_id}/send-confirmation`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success("Đã gửi email xác nhận!");
          break;
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || `Lỗi khi ${action}`);
    }
  };

  // ===============================
  // STATISTICS
  // ===============================
  const statistics = {
    total: bookings.length,
    pending: bookings.filter(
      (b) => b.status === "pending_payment" || b.status === "pending"
    ).length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    paid: bookings.filter((b) => b.status === "paid").length,
    canceled: bookings.filter((b) => b.status === "canceled").length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.total_price, 0),
  };

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Quản lý Booking</h2>
              <div style={{ fontSize: "14px", color: "#666", marginTop: 4 }}>
                Tổng số: {statistics.total} booking
              </div>
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={() =>
                fetchBookings(pagination.current, pagination.pageSize)
              }
            >
              Làm mới
            </Button>
          </div>
        }
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Filters */}
        <Card
          size="small"
          style={{ marginBottom: "24px", background: "#fff" }}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FilterOutlined />
              <span>Bộ lọc</span>
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
              >
                Trạng thái
              </div>
              <Select
                placeholder="Tất cả trạng thái"
                style={{ width: 180 }}
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <Option key={key} value={key}>
                    <Tag color={config.color}>{config.text}</Tag>
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
              >
                Tìm kiếm
              </div>
              <Input
                placeholder="Tìm theo tên, email..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
              />
            </div>

            <div>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
              >
                Ngày check-in
              </div>
              <RangePicker
                value={filters.dateRange}
                onChange={(dates) => handleFilterChange("dateRange", dates)}
                style={{ width: 250 }}
                format="DD/MM/YYYY"
              />
            </div>

            <Space>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={applyFilters}
              >
                Lọc
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                Đặt lại
              </Button>
            </Space>
          </div>
        </Card>

        {/* Bookings Table */}
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="booking_id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} booking`,
          }}
          onChange={handleTableChange}
          style={{ borderRadius: "8px", overflow: "hidden" }}
        />
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EyeOutlined />
            <span>Chi tiết Booking #{selectedBooking?.booking_id}</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedBooking?.status === "pending_payment" && (
            <Button
              key="payment"
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => handleAction(selectedBooking!, "payment")}
            >
              Xác nhận thanh toán
            </Button>
          ),
        ]}
        width={800}
        style={{ borderRadius: "12px" }}
      >
        {selectedBooking && (
          <div>
            {/* Booking Info */}
            <Descriptions
              column={2}
              bordered
              size="small"
              style={{ marginBottom: "24px" }}
            >
              <Descriptions.Item label="Mã Booking" span={2}>
                <strong style={{ color: "#1890ff", fontSize: "16px" }}>
                  #{selectedBooking.booking_id}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag color={statusConfig[selectedBooking.status]?.color}>
                  {statusConfig[selectedBooking.status]?.text}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedBooking.created_at).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>

              <Descriptions.Item label="Khách hàng" span={2}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <UserOutlined />
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {selectedBooking.user?.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {selectedBooking.user?.email}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      ID: {selectedBooking.user?.user_id}
                    </div>
                  </div>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày nhận phòng">
                {dayjs(selectedBooking.check_in).format("DD/MM/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày trả phòng">
                {dayjs(selectedBooking.check_out).format("DD/MM/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Số đêm">
                <Badge
                  count={selectedBooking.nights}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Descriptions.Item>
            </Descriptions>

            {/* Room Details */}
            <Card
              size="small"
              title="Chi tiết phòng"
              style={{ marginBottom: "16px" }}
            >
              <Table
                dataSource={selectedBooking.items}
                rowKey="booking_item_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Loại phòng",
                    dataIndex: "room_type_name",
                    key: "room_type_name",
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
                    title: "Giá/đêm",
                    dataIndex: "base_price",
                    key: "base_price",
                    align: "right" as const,
                    render: (price) => formatCurrency(price),
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
                    title: "Thành tiền",
                    dataIndex: "amount",
                    key: "amount",
                    align: "right" as const,
                    render: (amount) => (
                      <strong style={{ color: "#1890ff" }}>
                        {formatCurrency(amount)}
                      </strong>
                    ),
                  },
                ]}
              />
            </Card>

            {/* Pricing Summary */}
            <Card
              size="small"
              title="Tổng hợp thanh toán"
              style={{ background: "#fafafa" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Tổng tiền phòng:</span>
                <span>{formatCurrency(selectedBooking.subtotal_price)}</span>
              </div>

              {selectedBooking.voucher_discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    color: "#52c41a",
                  }}
                >
                  <span>
                    Giảm giá voucher ({selectedBooking.voucher_code}):
                  </span>
                  <span>
                    -{formatCurrency(selectedBooking.voucher_discount)}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #e8e8e8",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                <span>Tổng thanh toán:</span>
                <span style={{ color: "#1890ff" }}>
                  {formatCurrency(selectedBooking.total_price)}
                </span>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
