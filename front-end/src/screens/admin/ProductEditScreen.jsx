import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../FormContainer";

import { toast } from "react-toastify";
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from "../../slices/productApiSlice";

import { IoChevronUpCircleSharp } from "react-icons/io5";

function ProductEditScreen() {
    const { id: productId } = useParams();
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [countInStock, setCountInStock] = useState("");

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);
    const [updateProduct, { isLoading: loadingUpdate }] =
        useUpdateProductMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] =
        useUploadProductImageMutation();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                category,
                description,
                countInStock,
            }).unwrap();
            toast.success("La mise à jour à éte faite avec success");
            refetch();
            navigate("/admin/productlist");
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);
    const uploadFileHandler = async (e) => {
        const file = e.target.value;
        if (!file) {
            toast.error("Fichier non trouvé ");
            return;
        }
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };
    return <div></div>;
}
export default ProductEditScreen;
