import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "./axiosConfig";

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters }) => {
    const { data } = await axiosInstance.get(`/${resource}`, {
      params: { page: pagination?.currentPage, per_page: pagination?.pageSize },
    });

    return {
      data: data.data,
      total: data.meta?.total || data.data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.get(`/${resource}/${id}`);
    return { data: data.data };
  },

  create: async ({ resource, variables }) => {
    const { data } = await axiosInstance.post(`/${resource}`, variables);
    return { data: data.data };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await axiosInstance.put(`/${resource}/${id}`, variables);
    return { data: data.data };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.delete(`/${resource}/${id}`);
    return { data };
  },

  getApiUrl: () => process.env.VITE_API_URL || "http://localhost:8000/api",

  getMany: async ({ resource, ids }) => {
    const { data } = await axiosInstance.get(`/${resource}`, {
      params: { ids: ids.join(",") },
    });
    return { data: data.data };
  },

  custom: async ({ url, method, payload, headers }) => {
    const { data } = await axiosInstance.request({
      url,
      method,
      data: payload,
      headers,
    });
    return { data: data.data };
  },
};
