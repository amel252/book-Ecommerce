import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useCreateProductMutation,
} from "../../slices/productApiSlice";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

function ProductListScreen() {
    const { pageNumber } = useParams();
    const { data, isLoading, error, refetch } = useGetProductsQuery({
        // Si ya pas de pageNumber on reste sur la 1ere page
        pageNumber: pageNumber || 1,
    });
    const [deleteProduct, { isLoading: loadingDelete }] =
        useDeleteProductMutation();
    const deleteHandler = async (id) => {
        if (window.confirm("Etes vous sur de supprimer ? ")) {
            try {
                await deleteProduct(id);
                refetch();
            } catch (error) {
                toast.error(error?.data?.message);
            }
        }
    };
    const [createProduct, { isLoading: loadingCreate }] =
        useCreateProductMutation();

    const createProductHandler = async () => {
        if (window.confirm("Etes vous sur de créer un nouveau produit ? ")) {
            try {
                const createdProduct = await createProduct({}).unwrap();
                toast.success("Le product a été crée avec succes ");
                window.location.href = `/admin/product/${createdProduct._id}/edit`;
            } catch (error) {
                toast.error(error?.data?.message);
            }
        }
    };

    return (
        <div className="container mx-auto p-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-6">Produits</h1>
                <button
                    onClick={createProductHandler}
                    className="bg-primary text-white px-4 py-4 rounded-md hover:bg-secondry flex items-center"
                >
                    <FaPlus className="mr-2" /> Ajouter un produit
                </button>
            </div>
            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message}</Message>
            ) : (
                <>
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
                                        Prix
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                        categorie
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product._id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/admin/product/${product._id}/edit`}
                                                    className="text-primary hover:text-secondary"
                                                >
                                                    <FaEdit size={20} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteHandler(
                                                            product._id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-6">
                            <Pagination
                                pages={data?.pages}
                                page={data.page}
                                isAdmin={true}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
export default ProductListScreen;
