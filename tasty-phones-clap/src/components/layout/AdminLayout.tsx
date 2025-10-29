import { ThemedLayout } from "@refinedev/antd";
import { Outlet } from "react-router-dom";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <ThemedLayout>{children}</ThemedLayout>;
};
