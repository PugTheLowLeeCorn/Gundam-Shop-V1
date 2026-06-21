import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, role }) {

  const { user } = useAuth();


  // Chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }


  // Sai quyền
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }


  return children;

}

export default ProtectedRoute;