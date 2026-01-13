import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import ReviewStars from "./ReviewStars";
import { axiosInstance } from "../../../../providers/data/axiosConfig";

interface ReviewFormProps {
  bookingId: number;
  onSuccess?: () => void;
}

const ReviewForm = ({ bookingId, onSuccess }: ReviewFormProps) => {
  const [form] = Form.useForm();
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    if (!rating) {
      message.warning("Please select a star rating");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post("/reviews", {
        booking_id: bookingId,
        rating,
        comment: values.comment?.trim() || undefined,
      });

      message.success("Thank you! Your review has been submitted successfully");
      form.resetFields();
      setRating(5);
      onSuccess?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to submit review. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="How would you rate this experience?" required>
        <ReviewStars value={rating} onChange={setRating} disabled={submitting} />
      </Form.Item>

      <Form.Item label="Comment (optional)" name="comment">
        <Input.TextArea
          rows={4}
          placeholder="Share your experience about the room, service, and stay..."
          maxLength={1000}
          showCount
          disabled={submitting}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting} block>
          Submit Review
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;