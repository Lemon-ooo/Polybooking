import { DataProvider } from "@refinedev/core";

// ✅ DataProvider đơn giản để test
export const dataProvider: DataProvider = {
  getList: async () => {
    return { data: [], total: 0 };
  },
  getOne: async () => {
    return { data: {} };
  },
  create: async () => {
    return { data: {} };
  },
  update: async () => {
    return { data: {} };
  },
  deleteOne: async () => {
    return { data: {} };
  },
  getApiUrl: () => "http://localhost:8000/api",
};
