import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const auth = useContext(AuthContext);

    if (!auth) return null;
    if (auth.isLoading) return <div className="p-20 h-screen text-center bg-cyan-950 text-white">Загрузка профиля...</div>;

    return auth.token ? <Outlet /> : <Navigate to="/login" replace />
}
export default ProtectedRoute;