import { useAppSelector } from "@/app/reduxHooks";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  return userId ? <Outlet /> : <Navigate to='/' replace />
};

export default ProtectedRoute;