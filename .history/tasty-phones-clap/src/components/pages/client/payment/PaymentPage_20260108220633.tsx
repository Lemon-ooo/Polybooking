import { Button, Card, message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function PaymentPage() {
  const { bookingId } = useParams();

  const handlePayVnpay = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/payments/vnpay/booking`, {
        booking_id: bookingId,
      });

      window.location.href = res.data.payment_url;
    } catch (err) {
      message.error("Cannot create payment");
    }
  };

  return (
    <Card title="Online Payment">
      <p>Please complete your payment to confirm booking</p>

      <Button
        type="primary"
        size="large"
        style={{
          background: "#8B5E3C",
          borderColor: "#8B5E3C",
          fontWeight: 600,
        }}
        onClick={handlePayVnpay}
      >
        Pay with VNPAY
      </Button>
    </Card>
  );
}
