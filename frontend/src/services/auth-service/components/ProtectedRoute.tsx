import { useAuth } from "react-oidc-context";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const auth = useAuth();
  return auth.isAuthenticated ? <Outlet /> : <Navigate to='/' replace />
};

export default ProtectedRoute;