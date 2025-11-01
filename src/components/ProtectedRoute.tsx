import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../utils/authen";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const role = getRole();

  // 🔒 ถ้าไม่มี role (เช่น ยังไม่ได้ login)
  if (!role) return <Navigate to="/login" replace />;

  // 🚫 ถ้ามี role แต่ไม่มีสิทธิ์เข้าหน้านี้
  if (!allowedRoles.includes(role)) return <Navigate to="/403" replace />;

  // ✅ ผ่านการตรวจสอบทั้งหมด → render children routes
  return <Outlet />;
}
