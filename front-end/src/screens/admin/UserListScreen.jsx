import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
    useDeleteUserMutation,
    useGetUsersQuery,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function UserListScreen() {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    // afficher nos donné (users)
    console.log(users);
    const [deleteUser] = useDeleteUserMutation();
    const deleteHandler = async (id) => {
        if (window.confirm("Etes vous sur de supprimé l'utilisateur? ")) {
            try {
                await deleteUser(id);
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    };

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl font-bold mb-6">Utilisateurs </h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message>{error?.data?.message || error.error}</Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    id
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    Admin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user._id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href={`mailto:${user.email}`}>
                                            {user.email}
                                        </a>
                                        {/* revoir ca  */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {!user.isAdmin && (
                                            <div className="flex space-x-2">
                                                <Link
                                                    className="text-primary hover:text-secondary"
                                                    to={`/admin/user/${user._id}/edit`}
                                                >
                                                    <FaEdit size={20} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteHandler(user._id)
                                                    }
                                                >
                                                    <FaTrash
                                                        size={20}
                                                        className="text-red-500 hover:text-red-700"
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
export default UserListScreen;
