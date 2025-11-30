import React, { useState } from "react";
import { List, useTable } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import {
  Table,
  Typography,
  Tooltip,
  Button,
  Popconfirm,
  message,
  Space,
  Alert,
  Modal,
  Carousel,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export interface RoomType {
  room_type_id: number;
  room_type_name: string;
  room_type_image: string;
  base_price: string;
  max_guests: number;
  description: string;
  created_at: string;
  updated_at: string;
  rooms_count: number;
  total_rooms: number;
  images: {
    image_id: number;
    room_type_id: number;
    image_url: string;
    image_type: string;
  }[];
}

const formatPrice = (price: string) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(price)
  );

export const RoomTypeList: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps, queryResult, refetch } = useTable<RoomType>({
    resource: "room-types",
    queryOptions: {
      select: (response: any) => ({
        ...response,
        data: response.data,
        total: response.total,
      }),
    },
  });

  const { data, isLoading, isError, error } = queryResult || {};

  const { mutate: deleteRoomType } = useDelete<RoomType>();

  const handleDelete = (id: number) => {
    deleteRoomType(
      { resource: "room-types", id: id.toString() },
      {
        onSuccess: () => message.success("Xóa loại phòng thành công"),
        onError: () => message.error("Xóa loại phòng thất bại"),
      }
    );
  };

  // State hiển thị Modal ảnh
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const openImageModal = (images: string[], index = 0) => {
    setModalImages(images);
    setActiveIndex(index);
    setModalVisible(true);
  };

  if (isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error?.message || "Không thể kết nối đến API."}
        type="error"
        showIcon
      />
    );
  }

  const baseUrl = "http://localhost:8000/storage/";

  return (
    <List>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Button
          type="primary"
          onClick={() => navigate("/admin/room-types/create")}
          style={{ marginRight: 16 }}
        >
          Thêm loại phòng mới
        </Button>
        <Button onClick={() => refetch?.()} loading={isLoading}>
          Làm mới dữ liệu
        </Button>
        <Text style={{ marginLeft: 16 }}>
          Tổng số: {data?.total || 0} loại phòng
        </Text>
      </div>

      <Table
        {...tableProps}
        rowKey="room_type_id"
        loading={isLoading}
        dataSource={tableProps.dataSource || []}
        scroll={{ x: 1000 }}
      >
        <Table.Column
          title="Ảnh"
          render={(_, record: RoomType) => {
            const allImages = [
              record.room_type_image,
              ...(record.images?.map((img) => img.image_url) || []),
            ];
            return (
              <img
                src={`${baseUrl}${record.room_type_image}`}
                alt={record.room_type_name}
                style={{
                  width: 80,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => openImageModal(allImages)}
              />
            );
          }}
        />

        <Table.Column dataIndex="room_type_name" title="Tên loại phòng" />
        <Table.Column
          dataIndex="base_price"
          title="Giá cơ bản"
          render={(price: string) => formatPrice(price)}
          sorter={(a: RoomType, b: RoomType) =>
            parseFloat(a.base_price) - parseFloat(b.base_price)
          }
        />
        <Table.Column dataIndex="max_guests" title="Số khách tối đa" />
        <Table.Column
          dataIndex="description"
          title="Mô tả"
          ellipsis
          render={(description: string) => (
            <Tooltip title={description}>
              <span>{description || "Không có mô tả"}</span>
            </Tooltip>
          )}
        />
        <Table.Column dataIndex="rooms_count" title="Số phòng hiện có" />
        <Table.Column
          title="Hành động"
          render={(_, record: RoomType) => (
            <Space>
              <Button
                type="default"
                onClick={() =>
                  navigate(`/admin/room-types/edit/${record.room_type_id}`)
                }
              >
                Sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc muốn xóa loại phòng này không?"
                onConfirm={() => handleDelete(record.room_type_id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      {/* Modal hiển thị ảnh */}
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Carousel initialSlide={activeIndex}>
          {modalImages.map((img, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <img
                src={`${baseUrl}${img}`}
                alt={`room-${idx}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </List>
  );
};
