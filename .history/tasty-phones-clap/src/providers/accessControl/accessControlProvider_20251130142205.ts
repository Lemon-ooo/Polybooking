import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    console.log("🔐 AccessControl - Checking:", { resource, action, params });

    // ✅ Lấy role từ localStorage - SỬA THÀNH "auth"
    const getCurrentUserRole = (): string => {
      try {
        const authStr = localStorage.getItem("auth");
        if (authStr) {
          const auth = JSON.parse(authStr);
          console.log("🔐 AccessControl - Auth data:", auth);
          return auth?.role || "guest";
        }
        return "guest";
      } catch (error) {
        console.error("🔐 AccessControl - Error parsing auth:", error);
        return "guest";
      }
    };

    const userRole = getCurrentUserRole();
    console.log("🔐 AccessControl - User role:", userRole);

    // ✅ Định nghĩa permissions cho từng role - SỬA RESOURCE NAMES
    const permissions: Record<string, any> = {
      admin: {
        // Admin có toàn quyền truy cập mọi thứ
        dashboard: {
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
        services: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        gallery: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        events: {
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
        // Thêm các resource khác nếu cần
        bookings: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
      },
      customer: {
        // Customer chỉ được xem và đặt phòng
        dashboard: {
          list: true,
          create: false,
          edit: false,
          delete: false,
          show: true,
        },
        rooms: {
          list: true,
          create: false,
          edit: false,
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
        gallery: {
          list: true,
          create: false,
          edit: false,
          delete: false,
          show: true,
        },
        events: {
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
        bookings: {
          list: true,
          create: true,
          edit: true,
          delete: false,
          show: true,
        },
      },
      guest: {
        // Khách vãng lai không có quyền gì
        dashboard: {
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

    // ✅ Nếu không có resource, cho phép truy cập (cho các route public)
    if (!resource) {
      console.log("🔐 AccessControl - No resource, allowing access");
      return { can: true };
    }

    // ✅ Kiểm tra quyền
    const canAccess = permissions[userRole]?.[resource]?.[action] ?? false;

    console.log(
      `🔐 AccessControl - Result: ${
        canAccess ? "ALLOWED" : "DENIED"
      } for ${userRole} to ${action} ${resource}`
    );

    return {
      can: canAccess,
      reason: canAccess
        ? undefined
        : `Bạn không có quyền ${action} trên ${resource}`,
    };
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
