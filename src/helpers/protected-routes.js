import { Navigate, Outlet } from "react-router-dom";
import * as ROUTES from "../constants/routes";

export default function ProtectedRoute({ isUserLoggedIn }) {
  if (!isUserLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
}
