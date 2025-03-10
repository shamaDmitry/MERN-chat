import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
