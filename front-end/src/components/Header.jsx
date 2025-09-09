import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "ract-router-dom";
import { useLogoutMutattion } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import {
    FashoppingCard,
    FaUser,
    FaChevronDown,
    FaBars,
    FaSignOutAlt,
    FaTimes,
} from "react-icons";

export default function Header() {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutattion();
    const [menuOpen, setMenuOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };
}
