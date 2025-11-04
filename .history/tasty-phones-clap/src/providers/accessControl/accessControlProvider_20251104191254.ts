import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    // ✅ Kiểm tra resource có tồn tại không
    if (!resource) {
      return {
        can: false,
        reason: "Resource không xác định",
      };
    }

    // ✅ Lấy role từ localStorage
    const getCurrentUserRole = (): string => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          return user?.role || "guest";
        }
        return "guest";
      } catch (error) {
        return "guest";
      }
    };

    const userRole = getCurrentUserRole();

    // ✅ Định nghĩa permissions cho từng role
    const permissions: Record<string, any> = {
      admin: {
        // Admin có toàn quyền
        "admin-dashboard": {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        "client-dashboard": {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        rooms: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        bookings: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        services: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        "room-types": {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        amenities: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        profile: { list: true, edit: true, show: true },
      },
      client: {
        // Client chỉ được xem phòng và đặt phòng
        "client-dashboard": {
          list: true,
          create: false,
          edit: false,
          delete: false,
          show: true,
        },
        "admin-dashboard": {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        rooms: {
          list: true,
          create: false,
          edit: false,
          delete: false,
          show: true,
        },
        bookings: {
          list: true,
          create: true,
          edit: true,
          delete: false,
          show: true,
        },
        services: {
          list: true,
          create: false,
          edit: false,
          delete: false,
          show: true,
        },
        "room-types": {
          list: true,
          create: false,
          edit: false,
          delete: false,
          show: true,
        },
        amenities: {
          list: true,
          create: false,
          edit: false,
          delete: false,
          show: true,
        },
        profile: { list: true, edit: true, show: true },
      },
      guest: {
        // Khách vãng lai không có quyền gì
        "client-dashboard": {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        "admin-dashboard": {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        rooms: {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        bookings: {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        services: {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        profile: { list: false, edit: false, show: false },
      },
    };

    // ✅ Kiểm tra quyền - đảm bảo resource là string
    const canAccess = permissions[userRole]?.[resource]?.[action] ?? false;

    return {
      can: canAccess,
      reason: canAccess
        ? undefined
        : `Bạn không có quyền ${action} trên ${resource}`,
    };
  },

  // ✅ Thêm method options (tuỳ chọn)
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
