<<<<<<< HEAD
import React from "react";
import { Show, useShow, DateField, TagField } from "@refinedev/antd";
import { Typography } from "antd";

const { Title, Text } = Typography;

export const RoomShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Tên phòng</Title>
      <Text>{record?.name}</Text>

      <Title level={5}>Loại phòng</Title>
      <Text>{record?.type}</Text>

      <Title level={5}>Giá</Title>
      <Text>{record?.price?.toLocaleString()} VND</Text>

      <Title level={5}>Trạng thái</Title>
      <TagField
        value={
          record?.status === "available"
            ? "Có sẵn"
            : record?.status === "occupied"
            ? "Đã đặt"
            : "Bảo trì"
        }
        color={
          record?.status === "available"
            ? "green"
            : record?.status === "occupied"
            ? "red"
            : "orange"
        }
      />

      <Title level={5}>Mô tả</Title>
      <Text>{record?.description || "Không có mô tả"}</Text>

      <Title level={5}>Ngày tạo</Title>
      <DateField value={record?.createdAt} />
    </Show>
  );
};
=======
>>>>>>> lamtangthanh
