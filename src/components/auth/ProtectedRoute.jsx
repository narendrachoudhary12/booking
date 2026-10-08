import { Navigate, useLocation } from "react-router-dom";
import { dashboardPath, getUserType, isLoggedIn } from "../../utils/auth";

// Client-side gate only: it keeps people out of screens they can't use.
// The API must still enforce the token on every request.
/** @param {{ allow?: string[], children: React.ReactNode }} props */
export default function ProtectedRoute({ allow, children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allow && !allow.includes(getUserType())) {
    return <Navigate to={dashboardPath()} replace />;
  }

  return children;
}
