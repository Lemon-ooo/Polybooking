// src/components/pages/admin/services/Show.tsx
import { Show, useShow, DateField, TagField } from "@refinedev/antd";
import { Typography } from "antd";

const { Title, Text } = Typography;

export const ServicesShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading} title="Chi tiết dịch vụ">
      <Title level={5}>ID</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Tên dịch vụ</Title>
      <Text strong>{record?.name}</Text>

      <Title level={5}>Giá</Title>
      <Text>{record?.price?.toLocaleString()} ₫</Text>

      <Title level={5}>Mô tả</Title>
      <Text>{record?.description || "Không có mô tả"}</Text>

      <Title level={5}>Trạng thái</Title>
      <TagField
        value={record?.isActive !== false ? "Hoạt động" : "Tạm dừng"}
        color={record?.isActive !== false ? "green" : "red"}
      />

      <Title level={5}>Ngày tạo</Title>
      <DateField value={record?.createdAt} format="DD/MM/YYYY" />
    </Show>
  );
};