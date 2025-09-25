import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./slices/authSlice";
import { ToastContainer } from "react-toastify";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const checkTokenExpiration = () => {
            try {
                // si la valeur expire existe ?
                const expirationTime = localStorage.getItem("expirationTime");
                if (!expirationTime) return;
                // si elle existe ? et la date actuelle est superieur a la date dans localStorage
                const isExpired = Date.now() > Number(expirationTime);
                if (isExpired) {
                    dispatch(logout());
                }
            } catch (error) {
                console.log(
                    "Erreur de vérification de l'expiration de token",
                    error
                );
            }
        };
        checkTokenExpiration();
    }, [dispatch]);
    return (
        <>
            <ToastContainer />
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default App;
