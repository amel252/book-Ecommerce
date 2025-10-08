import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
    // je récupére l'user connecté
    const { userInfo } = useSelector((state) => state.auth);
    // si userInfor existe redirige vers Outlet sinon login
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}
export default PrivateRoute;
