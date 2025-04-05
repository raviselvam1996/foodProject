import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../hooks";

const RoleGuard = ({ allowedRoles }) => {
const { user } = useAuthContext();
// console.log(user || {});


  if (!user) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  if (!user?.permissions.includes(allowedRoles)) { 
    return <Navigate to="/403" replace />; // Redirect to 403 Forbidden page if role not allowed
  }

  return <Outlet />; // Render the child routes
};

export default RoleGuard;
