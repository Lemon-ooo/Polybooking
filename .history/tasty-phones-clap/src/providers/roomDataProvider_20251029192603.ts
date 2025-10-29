// src/providers/roomDataProvider.ts
import { DataProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const roomDataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters }) => {
    const { data } = await axiosInstance.get(`/${resource}`);
    return {
      data: data.data,
      total: data.data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.get(`/${resource}/${id}`);
    return {
      data: data.data,
    };
  },

  create: async ({ resource, variables }) => {
    const { data } = await axiosInstance.post(`/${resource}`, variables);
    return {
      data: data.data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await axiosInstance.put(`/${resource}/${id}`, variables);
    return {
      data: data.data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.delete(`/${resource}/${id}`);
    return {
      data,
    };
  },

  getApiUrl: () => API_URL,

  // Các method khác
  getMany: async ({ resource, ids }) => {
    const { data } = await axiosInstance.get(`/${resource}`, {
      params: { ids },
    });
    return {
      data: data.data,
    };
  },

  custom: async ({ url, method, payload, headers }) => {
    const { data } = await axiosInstance.request({
      url,
      method,
      data: payload,
      headers,
    });
    return {
      data: data.data,
    };
  },
};
