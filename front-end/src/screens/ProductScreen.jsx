import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    useCreateReviewMutation,
    useGetProductDetailsQuery,
} from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Rating from "../components/Rating";
import Message from "../components/Message";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { FaWindowClose } from "react-icons/fa";

function ProductScreen() {
    const [isOpen, setIsOpen] = useState(false);
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);
    console.log(product);
    const { userInfo } = useSelector((state) => state.auth);

    const [createReview, { isLoading: loadingProductReview }] =
        useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap();
            toast.success("Avis créé avec succès");
        } catch (error) {}
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Link to="/">
                <IoChevronBackCircleSharp
                    size={35}
                    className="text-primary hover:text-secondary"
                />
            </Link>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-1">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-300 pb-4">
                            {product.name}
                        </h1>
                    </div>
                    <div className="mt-4 border-b border-gray-300 pb-4">
                        <Rating
                            value={product.rating}
                            text={`${product.numberReviews} Reviews`}
                        />
                    </div>
                    <p className="mt-4 text-gray-700">{product.description}</p>
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="space-y-4">
                                <p className="flex justify-between text-lg">
                                    <span className="text-gray-600">
                                        Price:
                                    </span>
                                    <span className="font-semibold">
                                        €{product.price}
                                    </span>
                                </p>
                                <p className="flex justify-between text-lg">
                                    <span className="text-gray-600">
                                        Status
                                    </span>
                                    <span
                                        className={`${
                                            product.countInStock > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {product.countInStock > 0
                                            ? "In Stock"
                                            : "Out of stock"}
                                    </span>
                                </p>
                                {product.countInStock > 0 && (
                                    <div className="mt-4">
                                        <label
                                            className="block text-gray-700 font-semibold"
                                            htmlFor="qty"
                                        >
                                            Quatité
                                        </label>
                                        <select
                                            className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={qty}
                                            name=""
                                            id="qty"
                                            onChange={(e) =>
                                                setQty(Number(e.target.value))
                                            }
                                        >
                                            {/* je fait l'actualisation de mon stock */}
                                            {[
                                                ...Array(
                                                    product.countInStock
                                                ).keys(),
                                            ].map((x) => {
                                                <option
                                                    key={x + 1}
                                                    value={x + 1}
                                                >
                                                    {""} {x + 1}
                                                </option>;
                                            })}
                                                    <button className={`w-full mt-6 py-3 rounded-lg font-semibold 
                                                    ${product.countInStock === 0 ? "bg-gray-300 cursor-not-ammowed": disabled={product.countInStock ===0 }

                                                    }`}></button>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ProductScreen;
