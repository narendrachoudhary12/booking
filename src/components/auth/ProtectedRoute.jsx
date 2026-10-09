import { Navigate, useLocation } from "react-router-dom";
import { dashboardPath, getUserType, isLoggedIn } from "../../utils/auth";

// Client-side gate only: it keeps people out of screens they can't use.
// The API must still enforce the token on every request.
// allow: only these account types; deny: every type except these;
// loginPath: where a logged-out visitor is sent.
/** @param {{ allow?: string[], deny?: string[], loginPath?: string, children: React.ReactNode }} props */
export default function ProtectedRoute({
  allow,
  deny,
  loginPath = "/login",
  children,
}) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  const type = getUserType();

  if ((allow && !allow.includes(type)) || deny?.includes(type)) {
    return <Navigate to={dashboardPath()} replace />;
  }

  return children;
}
