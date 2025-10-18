import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
    useUpdateUserMutation,
    useGetUsersQuery,
    useGetUserDetailQuery,
} from "../../slices/usersApiSlice";
import { IoChevronBackCircleSharp } from "react-icons/io5";

function UserEditScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const {
        data: user,
        isLoading,
        error,
        refetch,
    } = useGetUserDetailQuery(userId);
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ userId, name, email, isAdmin });
            toast.success("La mise à jour est faite avec succés");
            refetch();
            navigate("/admin/userlist");
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };
    // mise à jour de notre requette
    useEffect(() => {
        // si user existe
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);
    return (
        <div className="container mx-auto">
            <Link to="/admin/userlist" className="inline-block">
                <IoChevronBackCircleSharp
                    size={35}
                    className="text-primary hover:text-secondary"
                />
            </Link>
            <FormContainer>
                <h1 className="text-2xl font-bold mb-6">Edition</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger"></Message>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nom
                            </label>
                            <input
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                type="text"
                                id="name"
                                placeholder="Entrer votre nom "
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                E-mail
                            </label>
                            <input
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                type="email"
                                id="email"
                                placeholder="Entrer votre mail "
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                type="checkbox"
                                id="isadmin"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.value)}
                            />
                            <label
                                htmlFor="isadmin"
                                className="block ml-2 text-sm font-medium text-gray-700"
                            >
                                est administrateur
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Mettre à jour
                        </button>
                    </form>
                )}
            </FormContainer>
        </div>
    );
}
export default UserEditScreen;
