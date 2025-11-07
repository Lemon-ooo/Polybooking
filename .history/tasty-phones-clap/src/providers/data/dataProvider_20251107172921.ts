// providers/dataProvider.ts
import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "./axiosConfig";
import { RoomListResponse, RoomResponse } from "../../interfaces/rooms";

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const { current = 1, pageSize = 10 } = pagination || {};

    const params: any = {
      page: current,
      per_page: pageSize,
    };

    // Xử lý filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter) {
          params[`filter[${filter.field}]`] = filter.value;
        }
      });
    }

    try {
      const response = await axiosInstance.get(`/${resource}`, { params });
      const responseData: RoomListResponse = response.data;

      // ✅ Map room_id to id để Refine hoạt động đúng
      const mappedData = responseData.data.map((room) => ({
        ...room,
        id: room.room_id, // Refine cần field 'id'
      }));

      return {
        data: mappedData,
        total: responseData.meta.total,
      };
    } catch (error) {
      console.error("Error in getList:", error);
      throw error;
    }
  },

  getOne: async ({ resource, id, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}/${id}`);
      const responseData: RoomResponse = response.data;

      // ✅ Map room_id to id
      const mappedData = {
        ...responseData.data,
        id: responseData.data.room_id,
      };

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in getOne:", error);
      throw error;
    }
  },

  create: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}`, variables);
      const responseData = response.data;

      // ✅ Map room_id to id
      const mappedData = {
        ...responseData.data,
        id: responseData.data.room_id,
      };

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    try {
      const response = await axiosInstance.put(`/${resource}/${id}`, variables);
      const responseData = response.data;

      // ✅ Map room_id to id
      const mappedData = {
        ...responseData.data,
        id: responseData.data.room_id,
      };

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id, meta }) => {
    try {
      await axiosInstance.delete(`/${resource}/${id}`);
      return {
        data: { id },
      };
    } catch (error) {
      console.error("Error in deleteOne:", error);
      throw error;
    }
  },

  // ... các method khác giữ nguyên
  getMany: async ({ resource, ids, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}`, {
        params: { ids: ids.join(",") },
      });
      const responseData: RoomListResponse = response.data;

      const mappedData = responseData.data.map((room) => ({
        ...room,
        id: room.room_id,
      }));

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in getMany:", error);
      throw error;
    }
  },

  createMany: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}/batch`, {
        data: variables,
      });
      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error in createMany:", error);
      throw error;
    }
  },

  updateMany: async ({ resource, ids, variables, meta }) => {
    try {
      const response = await axiosInstance.patch(`/${resource}/batch`, {
        ids,
        data: variables,
      });
      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error in updateMany:", error);
      throw error;
    }
  },

  deleteMany: async ({ resource, ids, meta }) => {
    try {
      await axiosInstance.delete(`/${resource}/batch`, {
        data: { ids },
      });
      return {
        data: ids.map((id) => ({ id })),
      };
    } catch (error) {
      console.error("Error in deleteMany:", error);
      throw error;
    }
  },

  getApiUrl: () => "http://localhost:8000/api",

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
    meta,
  }) => {
    try {
      const response = await axiosInstance({
        url: url || "",
        method: method || "GET",
        data: payload,
        params: query,
        headers,
      });
      return { data: response.data };
    } catch (error) {
      console.error("Error in custom:", error);
      throw error;
    }
  },
};
