import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import {
    FaShoppingCart,
    FaUser,
    FaChevronDown,
    FaBars,
    FaSignOutAlt,
    FaTimes,
} from "react-icons/fa";
import { resetCart } from "../slices/cartSlice";

function Header() {
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            dispatch(resetCart());
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="bg-orange-700 text-white">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-lg font-bold"
                >
                    <img src="/images/logo.png" alt="logo" className="h-8" />
                </Link>
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? (
                            <FaTimes size={24} />
                        ) : (
                            <FaBars size={24} />
                        )}
                    </button>
                </div>
                <div
                    className={`
                    ${menuOpen ? "flex" : "hidden"} 
                    flex-col md:flex md:flex-row md:items-center md:gap-4
                    absolute md:static
                    top-16 left-0 
                    w-full md:w-auto 
                    bg-orange-700 md:bg-transparent
                    z-50
                 `}
                >
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 p-2 md:p-0"
                    >
                        <FaShoppingCart /> Panier
                        {cartItems.length > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-gray-500
                             text-white text-xs w-4 h-4 flex items-center
                             justify-center rounded-full max-sm:left-12 max-sm:top-0"
                            >
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="relative">
                            <Link
                                to="/profile"
                                className="flex items-center gap-1 p-2 md:p-0 focus:outline-none"
                            >
                                <FaUser /> {userInfo.name}
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-1 p-2 md:p-0"
                        >
                            <FaUser /> Connexion
                        </Link>
                    )}
                    {userInfo && userInfo.isAdmin && (
                        <div className="relative">
                            <button
                                className="flex items-center gap-1 border-gray-500
                                     rounded-md hover:border-gray-500 hover:bg-gray-100 hover:text-black transition-all p-1 max-md:mx-2"
                                onClick={() => setAdminOpen(!adminOpen)}
                            >
                                <FaChevronDown className="mt-0.5" />
                            </button>
                            {adminOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white
                                         text-gray-700 shadow-lg rounded-lg z-50"
                                >
                                    <Link
                                        onClick={() => setAdminOpen(false)}
                                        to="/admin/productlist"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Produits
                                    </Link>
                                    <Link
                                        onClick={() => setAdminOpen(false)}
                                        to="/admin/orderlist"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Commandes
                                    </Link>
                                    <Link
                                        onClick={() => setAdminOpen(false)}
                                        to="/admin/userlist"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Utilisateurs
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    {userInfo ? (
                        <Link onClick={logoutHandler} className="p-2">
                            <FaSignOutAlt />
                        </Link>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
