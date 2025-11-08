import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = localStorage.getItem("auth");

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
