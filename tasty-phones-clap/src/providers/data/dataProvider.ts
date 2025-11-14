// providers/dataProvider.ts
import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "./axiosConfig";

// --- Hàm tiện ích: Xác định khóa chính (Primary Key) ---
const getPrimaryKey = (resource: string) => {
  switch (resource) {
    case "galleries":
      return "gallery_id";
    case "rooms":
      return "room_id";
    // Thêm các tài nguyên khác nếu cần (ví dụ: 'users' -> 'id')
    default:
      return "id";
  }
};

// --- Hàm tiện ích: Ánh xạ dữ liệu ---
const mapDataToRefine = (data: any, resource: string) => {
  const pk = getPrimaryKey(resource);
  // Đảm bảo data là một mảng trước khi map
  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: item[pk] || item.id, // Ưu tiên khóa chính API, sau đó là 'id'
      ...item,
    }));
  }
  // Dành cho getOne, create, update (khi data là một đối tượng đơn)
  return {
    id: data[pk] || data.id,
    ...data,
  };
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const { current = 1, pageSize = 10 } = pagination || {};
    const params: any = { page: current, per_page: pageSize };

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

      let dataArray = responseData.data;
      let total = responseData.meta?.total || 0;

      // ✅ LOGIC XỬ LÝ ĐẶC BIỆT CHO GALLERY (DỮ LIỆU LỒNG NHAU THEO CATEGORY)
      if (
        resource === "galleries" &&
        typeof responseData.data === "object" &&
        !Array.isArray(responseData.data)
      ) {
        let flatData: any[] = [];
        const categorizedData = responseData.data;

        // Lặp qua các danh mục ('Lobby', 'Rooms',...) và gom dữ liệu
        for (const key in categorizedData) {
          if (Array.isArray(categorizedData[key])) {
            flatData = flatData.concat(categorizedData[key]);
          }
        }
        dataArray = flatData;
        total = flatData.length; // Phải tự tính total vì API không trả về tổng
      }

      // ❌ Lỗi: Nếu không phải gallery, API phải trả về mảng ở responseData.data
      if (!Array.isArray(dataArray)) {
        console.warn(
          `[Refine DataProvider]: Expected an array for ${resource} but received a non-array object.`
        );
        dataArray = [];
      }

      // Ánh xạ ID chung
      const mappedData = mapDataToRefine(dataArray, resource);

      return {
        data: mappedData,
        total: total,
      };
    } catch (error) {
      console.error("Error in getList:", error);
      throw error;
    }
  },

  // --------------------------------------------------------------------------
  // CÁC HÀM CÒN LẠI (getOne, create, update) được tổng quát hóa:
  // --------------------------------------------------------------------------

  getOne: async ({ resource, id, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}/${id}`);
      const mappedData = mapDataToRefine(response.data.data, resource);
      return { data: mappedData };
    } catch (error) {
      console.error("Error in getOne:", error);
      throw error;
    }
  },

  create: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}`, variables);
      const mappedData = mapDataToRefine(response.data.data, resource);
      return { data: mappedData };
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    try {
      const response = await axiosInstance.put(`/${resource}/${id}`, variables);
      const mappedData = mapDataToRefine(response.data.data, resource);
      return { data: mappedData };
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  },

  // --------------------------------------------------------------------------
  // CÁC HÀM KHÁC (Đã đúng logic map, chỉ cần dùng hàm tiện ích)
  // --------------------------------------------------------------------------

  getMany: async ({ resource, ids, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}`, {
        params: { ids: ids.join(",") },
      });
      const mappedData = mapDataToRefine(response.data.data, resource);
      return { data: mappedData };
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
      const mappedData = mapDataToRefine(response.data.data, resource);
      return { data: mappedData };
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
      const mappedData = mapDataToRefine(response.data.data, resource);
      return { data: mappedData };
    } catch (error) {
      console.error("Error in updateMany:", error);
      throw error;
    }
  },

  // --------------------------------------------------------------------------
  // HÀM DELETE (Không cần map ID)
  // --------------------------------------------------------------------------

  deleteOne: async ({ resource, id, meta }) => {
    try {
      await axiosInstance.delete(`/${resource}/${id}`);
      return { data: { id } };
    } catch (error) {
      console.error("Error in deleteOne:", error);
      throw error;
    }
  },

  deleteMany: async ({ resource, ids, meta }) => {
    try {
      await axiosInstance.delete(`/${resource}/batch`, { data: { ids } });
      return { data: ids.map((id) => ({ id })) };
    } catch (error) {
      console.error("Error in deleteMany:", error);
      throw error;
    }
  },

  // --------------------------------------------------------------------------
  // HÀM KHÁC
  // --------------------------------------------------------------------------

  getApiUrl: () => "http://localhost:8000/api",

  custom: async ({ url, method, payload, query, headers }) => {
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
