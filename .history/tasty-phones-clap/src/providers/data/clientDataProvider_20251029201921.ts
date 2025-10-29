import { DataProvider } from "@refinedev/core";
import { dataProvider } from "./dataProvider";

// Data provider giới hạn cho client
export const clientDataProvider: DataProvider = {
  ...dataProvider,

  // Client chỉ có thể xem, không thể xóa
  deleteOne: async () => {
    throw new Error("Client không có quyền xóa dữ liệu");
  },

  // Client chỉ có thể tạo booking
  create: async ({ resource, variables }) => {
    if (resource !== "bookings") {
      throw new Error("Client chỉ có thể tạo booking");
    }
    return dataProvider.create({ resource, variables });
  },
};
