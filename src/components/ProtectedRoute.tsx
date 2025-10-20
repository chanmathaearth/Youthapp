import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../utils/authen";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const role = getRole();

  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/403" replace />;
  console.log(role)

  return <Outlet />; // ✅ แสดง children route ได้ถ้าผ่าน
}
