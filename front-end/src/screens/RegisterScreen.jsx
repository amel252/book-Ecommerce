// export default LoginScreen;
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import FormContainer from "../components/FormContainer";

function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect || "/");
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    };

    return (
        <FormContainer>
            <h1 className="text-2xl font-semibold mb-4 mt-5">Inscription</h1>
            <form className="space-y-4" onSubmit={submitHandler}>
                {/* name */}
                <div className="space-y-2">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="name"
                    >
                        Votre nom
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-primary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre Nom"
                        required
                    />
                </div>
                {/* email */}
                <div className="space-y-2">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="email"
                    >
                        Votre Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre Email"
                        required
                    />
                </div>
                {/* mot de passe */}
                <div className="space-y-2 relative">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="password"
                    >
                        Votre mot de passe
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        required
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        className="absolute inset-y-0 right-2 top-7 text-primary"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {/* confirmation mot de passe */}
                <div className="space-y-2 relative">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="confirmPassword"
                    >
                        Confirmer votre mot de passe
                    </label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-primary"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmez votre mot de passe"
                        required
                    />
                    <button
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        type="button"
                        className="absolute inset-y-0 right-2 top-7 text-primary"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {/* button */}
                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-primary text-white px-2 py-2 rounded-md hover:bg-secondary
                    focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                    Inscription
                </button>
                {isLoading && <Loader />}
            </form>
            <div className="py-3">
                <p>
                    Vous avez déjà un compte ?{" "}
                    <Link
                        className="text-primary hover:text-secondary"
                        to={redirect ? `/login?redirect=${redirect}` : "/login"}
                    >
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </FormContainer>
    );
}

export default RegisterScreen;
