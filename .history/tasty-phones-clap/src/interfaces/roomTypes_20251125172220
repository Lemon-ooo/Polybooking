export interface RoomTypeImage {
  image_id: number;
  room_type_id: number;
  image_url: string;
  image_type: "main" | string; // "main", "gallery" hoặc các loại khác
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RoomType {
  room_type_id: number;
  room_type_name: string;
  room_type_image: string;
  base_price: string; // giá lưu dạng string từ API
  max_guests: number;
  description: string;
  created_at: string;
  updated_at: string;
  rooms_count: number;
  total_rooms: number;
  images?: RoomTypeImage[]; // optional, vì có thể không có image
}
