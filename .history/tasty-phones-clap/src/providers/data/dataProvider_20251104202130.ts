import { DataProvider } from "@refinedev/core";

// ✅ DataProvider đúng type cho Refine
export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    return {
      data: [],
      total: 0,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    return {
      data: {
        id: id,
        ...meta?.defaultData,
      } as any,
    };
  },

  create: async ({ resource, variables, meta }) => {
    return {
      data: {
        id: Date.now(),
        ...variables,
      } as any,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    return {
      data: {
        id: id,
        ...variables,
      } as any,
    };
  },

  deleteOne: async ({ resource, id, meta }) => {
    return {
      data: {
        id: id,
      } as any,
    };
  },

  getApiUrl: () => "http://localhost:8000/api",

  // ✅ Thêm các method bắt buộc khác
  getMany: async ({ resource, ids, meta }) => {
    return {
      data: ids.map((id) => ({ id })) as any[],
    };
  },

  createMany: async ({ resource, variables, meta }) => {
    return {
      data: variables.map((vars, index) => ({
        id: Date.now() + index,
        ...vars,
      })) as any[],
    };
  },

  updateMany: async ({ resource, ids, variables, meta }) => {
    return {
      data: ids.map((id) => ({ id })) as any[],
    };
  },

  deleteMany: async ({ resource, ids, meta }) => {
    return {
      data: ids.map((id) => ({ id })) as any[],
    };
  },

  // ✅ Method custom nếu cần
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
    return { data: {} as any };
  },
};
