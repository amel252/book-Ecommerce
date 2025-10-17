import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/orderApiSlice";
import { Link } from "react-router-dom";

function OrderListScreen() {
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    console.log(orders);
    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl font-bold mb-6">Commandes</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    id
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    utilisateur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    totale
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    payé
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    livré
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                    actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order._id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.user && order.user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.totalPrice}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.idDelivred ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="text-primary hover:text-secondary underline"
                                        >
                                            Détails
                                        </Link>
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
export default OrderListScreen;
