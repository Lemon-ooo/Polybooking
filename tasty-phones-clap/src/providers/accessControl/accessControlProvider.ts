import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    // ✅ Lấy role của user từ authProvider
    const userRole = await getCurrentUserRole();

    // ✅ Định nghĩa permissions cho từng role
    const permissions: Record<string, any> = {
      admin: {
        // Admin có toàn quyền
        rooms: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        users: {
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
        categories: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
        blog_posts: {
          list: true,
          create: true,
          edit: true,
          delete: true,
          show: true,
        },
      },
      client: {
        // Client chỉ được xem phòng và đặt phòng
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
        users: {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        categories: {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
        blog_posts: {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
      },
      guest: {
        // Khách vãng lai không có quyền gì
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
        users: {
          list: false,
          create: false,
          edit: false,
          delete: false,
          show: false,
        },
      },
    };

    // ✅ Kiểm tra quyền
    const canAccess = permissions[userRole]?.[resource]?.[action] ?? false;

    return {
      can: canAccess,
      reason: canAccess
        ? undefined
        : `Bạn không có quyền ${action} ${resource}`,
    };
  },
};

// ✅ Helper function để lấy role hiện tại
const getCurrentUserRole = async (): Promise<string> => {
  try {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const parsedAuth = JSON.parse(auth);
      return parsedAuth.user?.role || "guest";
    }
    return "guest";
  } catch (error) {
    return "guest";
  }
};
