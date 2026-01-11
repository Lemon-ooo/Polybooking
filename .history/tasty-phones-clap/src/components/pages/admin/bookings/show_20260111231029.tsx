// Thêm state để tracking invoice
const [invoiceStatus, setInvoiceStatus] = useState<{
  exists: boolean;
  code?: string;
  issued_at?: string;
}>({ exists: false });

// Thêm effect để check invoice status
useEffect(() => {
  const checkInvoiceExists = async () => {
    if (!booking) return;

    try {
      const authStr = localStorage.getItem("auth");
      const token = authStr ? JSON.parse(authStr).token : null;

      // Bạn có thể thêm API endpoint để check invoice
      // Hoặc fetch từ booking data nếu có
      if (booking.status === "check_out" || booking.status === "completed") {
        // Giả sử bạn có API để check
        const response = await axios.get(
          `${API_URL}/api/bookings/${displayBookingId}/invoice/check`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        if (response.data.exists) {
          setInvoiceStatus({
            exists: true,
            code: response.data.invoice_code,
            issued_at: response.data.issued_at,
          });
        }
      }
    } catch (error) {
      // Nếu không có API, bỏ qua
      console.log("No invoice check API available");
    }
  };

  if (booking) {
    checkInvoiceExists();
  }
}, [booking, displayBookingId]);

// Thêm badge vào header
{
  /* HEADER SECTION */
}
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

        {/* Thêm invoice status badge */}
        {invoiceStatus.exists && (
          <div style={{ marginTop: 8 }}>
            <Tag
              color="green"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
              }}
            >
              <FileTextOutlined style={{ marginRight: 4 }} />
              Hóa đơn: {invoiceStatus.code}
            </Tag>
          </div>
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
</div>;
