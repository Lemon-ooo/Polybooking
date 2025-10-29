import { Show, useShow } from "@refinedev/antd";
import { Typography, Tag } from "antd";

const { Title, Text } = Typography;

export const RoomShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Số phòng</Title>
      <Text>{record?.room_number}</Text>

      <Title level={5}>Loại phòng</Title>
      <Text>{record?.room_type?.name}</Text>

      <Title level={5}>Giá</Title>
      <Text>₫{record?.price?.toLocaleString()}</Text>

      <Title level={5}>Trạng thái</Title>
      <Tag color={record?.status === "available" ? "green" : "red"}>
        {record?.status === "available" ? "Có sẵn" : "Đã thuê"}
      </Tag>

      <Title level={5}>Mô tả</Title>
      <Text>{record?.description || "Không có mô tả"}</Text>
    </Show>
  );
};
