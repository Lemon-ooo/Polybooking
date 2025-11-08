import { DataProvider } from "@refinedev/core";
import { dataProvider } from "./dataProvider";

// Data provider mở rộng cho admin (có thêm các method đặc biệt)
export const adminDataProvider: DataProvider = {
  ...dataProvider,

  // Method chỉ dành cho admin
  getStatistics: async () => {
    const { data } = (await dataProvider.custom?.({
      url: "/admin/statistics",
      method: "get",
    })) || { data: null };

    return { data };
  },

  // Quản lý users (chỉ admin)
  manageUsers: async (variables: any) => {
    const { data } = (await dataProvider.custom?.({
      url: "/admin/users",
      method: "post",
      payload: variables,
    })) || { data: null };

    return { data };
  },
};
