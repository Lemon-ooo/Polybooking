import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    const userRole = await getCurrentUserRole();

    // Role-based access control
    const permissions: Record<string, any> = {
      admin: {
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
      },
      client: {
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
      },
    };

    const canAccess = permissions[userRole]?.[resource]?.[action] ?? false;

    return {
      can: canAccess,
      reason: canAccess
        ? undefined
        : `Bạn không có quyền ${action} ${resource}`,
    };
  },
};

const getCurrentUserRole = async (): Promise<string> => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth).user.role : "guest";
};
