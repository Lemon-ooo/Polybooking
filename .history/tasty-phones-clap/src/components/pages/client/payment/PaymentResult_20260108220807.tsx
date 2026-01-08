import { Result, Button } from "antd";
import { useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const code = params.get("vnp_ResponseCode");

  return code === "00" ? (
    <Result
      status="success"
      title="Payment Successful"
      subTitle="Your booking has been confirmed"
      extra={<Button type="primary">Go Home</Button>}
    />
  ) : (
    <Result
      status="error"
      title="Payment Failed"
      subTitle="Please try again"
      extra={<Button>Retry</Button>}
    />
  );
}
