import axiosInstance from "../providers/data/axiosConfig";

export interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  status: "available" | "occupied" | "maintenance";
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const roomService = {
  // Lấy tất cả phòng
  getAllRooms: async (params?: any) => {
    const response = await axiosInstance.get("/rooms", { params });
    return response.data;
  },

  // Lấy chi tiết phòng
  getRoomById: async (id: number) => {
    const response = await axiosInstance.get(`/rooms/${id}`);
    return response.data;
  },

  // Tạo phòng mới
  createRoom: async (roomData: Omit<Room, "id">) => {
    const response = await axiosInstance.post("/rooms", roomData);
    return response.data;
  },

  // Cập nhật phòng
  updateRoom: async (id: number, roomData: Partial<Room>) => {
    const response = await axiosInstance.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  // Xóa phòng
  deleteRoom: async (id: number) => {
    const response = await axiosInstance.delete(`/rooms/${id}`);
    return response.data;
  },
};
