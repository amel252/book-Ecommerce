import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrderQuery } from "../slices/orderApiSlice";
import { setCredentials } from "../slices/authSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function ProfileScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setshowPassword] = useState("false");
    const [showConfirmPassword, setShowConfirmPassword] = useState("false");

    const [activeTab, setActiveTab] = useState("profile");
    const { userInfo } = useSelector((state) => state.auth);

    const { data: orders, isLoading, error } = useGetMyOrderQuery();
    const [updateProfile, { isLoading: loadingUpdateProfile }] =
        useProfileMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        setName(userInfo.name);
        setName(userInfo.email);
    }, [userInfo.name, userInfo.email]);

    const togglePasswordVisibility = () => {
        setshowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const submitHandler = async (e) => {
        e.preventDefault;
        if (password !== confirmPassword) {
            toast.error("Mot de pass incoherent");
        } else {
            try {
                const res = await updateProfile({
                    name,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success("Mise a jour du profile reussie");
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    };
    return (
        <div className="container mx-auto my-5">
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 hover:bg-secondary${
                        activeTab === "profile"
                            ? "bg-primary text-white"
                            : "bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile utilisateur
                </button>
                <button
                    className={`px-4 py-2 hover:bg-secondary${
                        activeTab === "orders"
                            ? "bg-primary text-white"
                            : "bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("orders")}
                >
                    mes commandes
                </button>
            </div>
            <FormContainer>
                {activeTab === "profile" && (
                    <div className="bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Profile</h2>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Votre Nom
                                </label>
                                <input
                                    type="text"
                                    placeholder="Entrer votre Nom"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                            {/* mot de passe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Votre E-mail
                                </label>
                                <input
                                    type="email"
                                    placeholder="Entrer votre email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Votre Mot de passe
                                </label>
                                <input
                                    // si le mot de passe est affiché prend moi le text sinon les points masqué
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Entrer votre mot de passe"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-2 top-6 text-primary"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className="relative">
                                <label className="block">
                                    Confirmation de mot de passe
                                </label>
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="confirmation de mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="mt-1 block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-2 top-6 text-primary"
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Mise à jour
                            </button>
                            {loadingUpdateProfile && <Loader />}
                        </form>
                    </div>
                )}
            </FormContainer>
        </div>
    );
}

export default ProfileScreen;
