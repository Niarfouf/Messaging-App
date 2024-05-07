import { useOutletContext, Navigate, Outlet } from "react-router-dom";
const AuthRoute = () => {
  const [userStatus, setUserStatus] = useOutletContext();
  if (!userStatus) return <Navigate to="/home" replace />;
  if (userStatus) return <Outlet />;
};
export default AuthRoute;
