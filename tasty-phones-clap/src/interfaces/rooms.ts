import { BaseRecord } from "@refinedev/core";

// interfaces/rooms.ts
export interface Room extends BaseRecord {
  room_id: number;
  room_number: string;
  room_type_id: number;
  description: string;
  price: string;
  status: string;
  created_at: string;
  updated_at: string;
  room_type: RoomType;
  amenities: Amenity[];
}

export interface RoomType {
  id: number;
  name: string;
  description: string;
  base_price: string;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  amenity_id: number;
  name: string;
  category: string;
  icon_url: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  pivot: {
    room_id: number;
    amenity_id: number;
  };
}

export interface RoomListResponse {
  success: boolean;
  data: Room[];
  message: string;
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface RoomResponse {
  success: boolean;
  data: Room;
  message: string;
}

// Create room request
export interface CreateRoomRequest {
  room_number: string;
  room_type_id: number;
  description: string;
  price: number;
  status: string;
  amenities?: number[];
}

// Update room request
export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

// Room status options
export const ROOM_STATUSES = [
  { label: "Trống", value: "trống", color: "green" },
  { label: "Đang sử dụng", value: "đang sử dụng", color: "blue" },
  { label: "Available", value: "available", color: "green" },
  { label: "Bảo trì", value: "maintenance", color: "orange" },
  { label: "Đã đặt", value: "occupied", color: "red" },
] as const;

// Utility functions
export const getRoomStatusColor = (status: string): string => {
  const statusConfig = ROOM_STATUSES.find((s) => s.value === status);
  return statusConfig?.color || "default";
};

export const getRoomStatusLabel = (status: string): string => {
  const statusConfig = ROOM_STATUSES.find((s) => s.value === status);
  return statusConfig?.label || status;
};

export const formatPrice = (price: string): string => {
  const priceNumber = parseFloat(price);
  return isNaN(priceNumber)
    ? "0 VND"
    : `${priceNumber.toLocaleString("vi-VN")} VND`;
};
export interface IEvent extends BaseRecord {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventListResponse {
  success: boolean;
  data: IEvent[];
  message: string;
  meta: {
    total: number;
    page?: number;
    per_page?: number;
  };
}

export interface EventResponse {
  success: boolean;
  data: IEvent;
  message: string;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  location: string;
  date: string;
}
// Interface cho từng ảnh trong gallery
export interface IGallery extends BaseRecord {
  gallery_id: number;
  gallery_category: string;
  image_path: string;
  caption: string | null;
  created_at: string;
  updated_at: string;
}

// Interface cho dữ liệu trả về dạng grouped theo category
export interface GalleryListData {
  [category: string]: IGallery[];
}

// Interface response API
export interface GalleryListResponse {
  status: "success" | "error";
  data: GalleryListData;
}

// Ví dụ: request tạo mới (nếu cần)
export interface CreateGalleryRequest {
  gallery_category: string;
  image_path: string;
  caption?: string;
}
