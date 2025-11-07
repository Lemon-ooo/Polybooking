import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "./axiosConfig";

// ✅ DataProvider thực tế kết nối với API
export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const { current = 1, pageSize = 10 } = pagination || {};

    // Build query params
    const params: any = {
      page: current,
      per_page: pageSize,
    };

    // Xử lý filters nếu có
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter) {
          params[`filter[${filter.field}]`] = filter.value;
        }
      });
    }

    // Xử lý sorters nếu có
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      if ("field" in sorter) {
        params.sort =
          sorter.order === "desc" ? `-${sorter.field}` : sorter.field;
      }
    }

    try {
      const response = await axiosInstance.get(`/${resource}`, { params });

      // Format response theo chuẩn Refine
      return {
        data: response.data.data || response.data,
        total: response.data.meta?.total || response.data.total || 0,
      };
    } catch (error) {
      console.error("Error in getList:", error);
      throw error;
    }
  },

  getOne: async ({ resource, id, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}/${id}`);
      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error in getOne:", error);
      throw error;
    }
  },

  create: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}`, variables);
      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    try {
      const response = await axiosInstance.put(`/${resource}/${id}`, variables);
      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id, meta }) => {
    try {
      const response = await axiosInstance.delete(`/${resource}/${id}`);
      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error in deleteOne:", error);
      throw error;
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    try {
      // Gọi API để lấy nhiều bản ghi theo ids
      const response = await axiosInstance.get(`/${resource}`, {
        params: { ids: ids.join(",") },
      });
      return {
        data: response.data.data || response.data,
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
      const response = await axiosInstance.delete(`/${resource}/batch`, {
        data: { ids },
      });
      return {
        data: response.data.data || response.data,
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
