// import React from "react";
// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../components/Loader";
// import { useLoginMutation } from "../slices/usersApiSlice";
// import { setCredentials } from "../slices/authSlice";
// import { toast } from "react-toastify";
// import { FaEyeSlash, FaEye } from "react-icons/fa";
// import FormContainer from "../components/FormContainer";

// export default function LoginScreen() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = "";
//     const [showPassword, setShowPassword] = useState(false);

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [login, { isLoading }] = useLoginMutation();
//     const { userInfo } = useSelector((state) => state.auth);

//     // use location permet d'avoir le path dans l'url
//     const { search } = useLocation();
//     // permet de chercher
//     const sp = new URLSearchParams(search);
//     const redirect = sp.get("redirect") || "/";

//     useEffect(() => {
//         // si l'user est connecté on le redirige vers la page home
//         if (userInfo) {
//             navigate(redirect);
//         }
//     }, [navigate, redirect, userInfo]);

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await login({ email, password }).unwrap();
//             dispatch(setCredentials({ ...res }));
//             navigate(redirect);
//         } catch (error) {
//             toast.error(error?.data?.message || error.error);
//         }
//     };
//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };
//     return (
//         <FormContainer>
//             <h1 className="text-2xl font-semibold mb-4 mt-5"> Connexion</h1>
//             <form className="space-y-4" onSubmit={submitHandler}>
//                 <div className="space-y-2">
//                     <label
//                         className="block text-sm font-medium text-gray-700"
//                         htmlFor="email"
//                     >
//                         Votre email
//                     </label>
//                     <input
//                         type="email"
//                         id="email"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md
//                         focus:outline-none focus:ring-2 focus:right-2 focus:ring-primary"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="votre Email"
//                     />
//                 </div>
//                 <div className="space-y-2 relative">
//                     <label
//                         className="block text-sm font-medium text-gray-700"
//                         htmlFor="password"
//                     >
//                         Votre mot de passe
//                     </label>
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         id="email"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md
//                         focus:outline-none focus:ring-2 focus:right-2 focus:ring-primary"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Votre mot de passe"
//                     />
//                     <button type="button" onClick={togglePasswordVisibility}>
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                 </div>
//                 <button
//                     className="w-full bg-primary text-white px-2 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
//                     disabled={isLoading}
//                     type="submit"
//                 >
//                     Connexion
//                 </button>
//                 {isLoading && <Loader />}
//             </form>
//             <div className="py-3">
//                 <p>
//                     Avez-vous déja un compte ?
//                     <Link
//                         className="text-primary hover:text-secondary"
//                         to={
//                             redirect
//                                 ? `register?redirect=${redirect}`
//                                 : "/register"
//                         }
//                     >
//                         Inscription
//                     </Link>
//                 </p>
//             </div>
//         </FormContainer>
//     );
// }
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import FormContainer from "../components/FormContainer";

function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPaswword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    // useLocation permet d avoir le path dans url
    const { search } = useLocation();
    //  recherche de path
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPaswword);
    };

    return (
        <FormContainer>
            <h1 className="text-2xl font-semibold mb-4 mt-5">Connexion</h1>
            <form className="space-y-4" onSubmit={submitHandler}>
                <div className="space-y-2">
                    <label
                        className="block text-sm
              font-medium text-gray-700"
                        htmlFor="email"
                    >
                        Votre Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border
                border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:right-2
                 focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre Email"
                    />
                </div>
                <div className="space-y-2 relative">
                    <label
                        className="block text-sm
              font-medium text-gray-700"
                        htmlFor="password"
                    >
                        Votre mot de passe
                    </label>
                    <input
                        type={showPaswword ? "text" : "password"}
                        id="password"
                        className="w-full px-3 py-2 border
                border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:right-2
                 focus:ring-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                    />

                    <button
                        onClick={togglePasswordVisibility}
                        type="button"
                        className="absolute inset-y-0 right-2 top-5 text-primary"
                    >
                        {showPaswword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-primary text-white
            px-2 py-2 rounded-md hover:bg-secondary
             focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                    Connexion
                </button>
                {isLoading && <Loader />}
            </form>
            <div className="py-3">
                <p>
                    Avez-vous deja un compte ?
                    <Link
                        className="text-primary hover:text-secondary"
                        to={
                            redirect
                                ? `register?redirect=${redirect}`
                                : "/register"
                        }
                    >
                        Inscription
                    </Link>
                </p>
            </div>
        </FormContainer>
    );
}

export default LoginScreen;
