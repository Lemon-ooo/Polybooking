import { Avatar, List, Rate, Typography, Tooltip } from "antd";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Still using vi for relative time (e.g., "2 days ago")
import { useEffect, useState } from "react";
import axiosInstance from "../../../../providers/data/axiosConfig";

const { Text, Paragraph } = Typography;

interface ReviewUser {
  user_name: string;
  avatar?: string;
}

interface Review {
  id: number;
  rating: number;
  comment?: string;
  user: ReviewUser;
  created_at?: string;
}

interface ReviewListProps {
  roomId: number;
}

const ReviewList = ({ roomId }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/room-types/${roomId}/reviews`);
        setReviews(response.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) fetchReviews();
  }, [roomId]);

  const formatReviewDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch {
      return null;
    }
  };

  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={reviews}
      locale={{ emptyText: "No reviews for this room yet." }}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                src={item.user.avatar}
                alt={item.user.user_name || "Guest"}
                size={48}
              />
            }
            title={
              <div>
                <Text strong>{item.user.user_name || "Guest"}</Text>
                <div style={{ marginTop: 4 }}>
                  <Rate disabled value={item.rating} />
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {item.rating}/5
                  </Text>
                </div>
                {item.created_at && (
                  <Tooltip title={new Date(item.created_at).toLocaleString("en-US")}>
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                      {formatReviewDate(item.created_at)}
                    </Text>
                  </Tooltip>
                )}
              </div>
            }
            description={
              item.comment ? (
                <Paragraph style={{ marginTop: 8 }}>{item.comment}</Paragraph>
              ) : (
                <Text type="secondary" italic>
                  No comment
                </Text>
              )
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ReviewList;