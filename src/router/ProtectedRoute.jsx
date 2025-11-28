import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { authorized } = useAuth();

  if (authorized === null) return null; // 인증 검사중
  if (authorized === false) return <Navigate to="/ksponcoadministrator/login" replace />;

  return children;
}