// providers/dataProvider.ts
import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "./axiosConfig";

export const dataProvider: DataProvider = {
  // ✅ Sửa getList với types đúng
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
      const responseData = response.data;

      // ✅ Map data với type an toàn
      const mappedData = responseData.data.map((room: any) => ({
        id: room.room_id, // Refine bắt buộc có field 'id'
        ...room,
      }));

      return {
        data: mappedData,
        total: responseData.meta?.total || 0,
      };
    } catch (error) {
      console.error("Error in getList:", error);
      throw error;
    }
  },

  // ✅ Sửa getOne
  getOne: async ({ resource, id, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}/${id}`);
      const responseData = response.data;

      const mappedData = {
        id: responseData.data.room_id,
        ...responseData.data,
      };

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in getOne:", error);
      throw error;
    }
  },

  // ✅ Sửa create
  create: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}`, variables);
      const responseData = response.data;

      const mappedData = {
        id: responseData.data.room_id,
        ...responseData.data,
      };

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  },

  // ✅ Sửa update
  update: async ({ resource, id, variables, meta }) => {
    try {
      const response = await axiosInstance.put(`/${resource}/${id}`, variables);
      const responseData = response.data;

      const mappedData = {
        id: responseData.data.room_id,
        ...responseData.data,
      };

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  },

  // ✅ Sửa deleteOne
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

  // ✅ Sửa getMany
  getMany: async ({ resource, ids, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}`, {
        params: { ids: ids.join(",") },
      });
      const responseData = response.data;

      const mappedData = responseData.data.map((room: any) => ({
        id: room.room_id,
        ...room,
      }));

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in getMany:", error);
      throw error;
    }
  },

  // ✅ Sửa createMany
  createMany: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}/batch`, {
        data: variables,
      });
      const responseData = response.data;

      const mappedData = responseData.data.map((room: any, index: number) => ({
        id: room.room_id || Date.now() + index,
        ...room,
      }));

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in createMany:", error);
      throw error;
    }
  },

  // ✅ Sửa updateMany
  updateMany: async ({ resource, ids, variables, meta }) => {
    try {
      const response = await axiosInstance.patch(`/${resource}/batch`, {
        ids,
        data: variables,
      });
      const responseData = response.data;

      const mappedData = responseData.data.map((room: any) => ({
        id: room.room_id,
        ...room,
      }));

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error in updateMany:", error);
      throw error;
    }
  },

  // ✅ Sửa deleteMany
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

  // ✅ Sửa custom
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