import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { clearCartItems } from "../slices/cartSlice";

function PlaceOrderScreen() {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    console.log(cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping");
        } else if (!cart.paymentMethod) {
            navigate("/payment");
        }
    }, [cart.paymentMethod, cart.shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            navigate(`/order/${res._id}`);
            dispatch(clearCartItems());
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                VERIFICATION
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Détails d'expedition{" "}
                        </h2>
                        <p className="text-gray-600">
                            <strong>Address:</strong>
                            {cart.shippingAddress.address},
                            {cart.shippingAddress.city},{" "}
                            {cart.shippingAddress.postalCode},
                            {cart.shippingAddress.country}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl transition-shadow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Methode de paiement
                        </h2>
                        <p className="text-gray-600">
                            <strong className="text-primary">Methode:</strong>
                            {cart.paymentMethod}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Vos commandes
                        </h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Votre panier et vide</Message>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-20 h-20 flex-shrink-0 mb-4 sm:mb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="sm:ml-6 flex-1">
                                            <p className="text-base sm:text-lg font-medium text-primary hover:text-secondary transition-colors">
                                                {item.name}
                                            </p>
                                        </div>
                                        <div className="sm:text-right mt-4 sm:mt-0">
                                            <p className="text-gray-700">
                                                {item.qty} * ${item.price} ={" "}
                                                <strong>
                                                    $
                                                    {(
                                                        item.qty * item.price
                                                    ).toFixed(2)}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div
                        className="bg-white p-8 rounded-xl shadow-sm
                  border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Resumé de la commande
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Articles:</span>
                                <span className="text-gray-800">
                                    ${cart.itemsPrice}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Expédition:
                                </span>
                                <span className="text-gray-800">
                                    ${cart.shippingPrice}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Taxe:</span>
                                <span className="text-gray-800">
                                    ${cart.taxPrice}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Totale:</span>
                                <span className="text-gray-800">
                                    ${cart.totalPrice}
                                </span>
                            </div>
                        </div>
                        {error && (
                            <div className="mt-6">
                                <Message variant="danger">
                                    {error.data?.message}
                                </Message>
                            </div>
                        )}
                        <div className="mt-8">
                            <button
                                type="button"
                                className="w-full bg-primary text-white py-3
                            rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={cart.cartItems.length === 0}
                                onClick={placeOrderHandler}
                            >
                                {isLoading ? <Loader /> : "Passer une commande"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PlaceOrderScreen;
// *********************************************
//
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import Message from "../components/Message";
// import Loader from "../components/Loader";
// import { useCreateOrderMutation } from "../slices/orderApiSlice";
// import { clearCartItems } from "../slices/cartSlice";

// function PlaceOrderScreen() {
//     const navigate = useNavigate();
//     const cart = useSelector((state) => state.cart);

//     const [createOrder, { isLoading, error }] = useCreateOrderMutation();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (!cart.shippingAddress?.address) {
//             navigate("/shipping");
//         } else if (!cart.paymentMethod) {
//             navigate("/payment");
//         }
//     }, [cart.shippingAddress, cart.paymentMethod, navigate]);

//     const placeOrderHandler = async () => {
//         try {
//             const res = await createOrder({
//                 orderItems: cart.cartItems,
//                 shippingAddress: cart.shippingAddress,
//                 paymentMethod: cart.paymentMethod,
//                 itemsPrice: cart.itemsPrice,
//                 shippingPrice: cart.shippingPrice,
//                 taxPrice: cart.taxPrice,
//                 totalPrice: cart.totalPrice,
//             }).unwrap();
//             navigate(`/order/${res._id}`);
//             dispatch(clearCartItems());
//         } catch (err) {
//             toast.error(err?.data?.message || err.message);
//         }
//     };
//     //  function pour calculé le total :
//     const calculateTotal = () => {
//         const itemsPrice = cart.cartItems.reduce(
//             (acc, item) => acc + Number(item.price) * Number(item.qty),
//             0
//         );
//         const shippingPrice = itemsPrice > 100 ? 0 : 10;
//         const taxPrice = 0.15 * itemsPrice;
//         const totalPrice = itemsPrice + shippingPrice + taxPrice;

//         return {
//             itemsPrice: itemsPrice.toFixed(2),
//             shippingPrice: shippingPrice.toFixed(2),
//             taxPrice: taxPrice.toFixed(2),
//             totalPrice: totalPrice.toFixed(2),
//         };
//     };

//     const totals = calculateTotal();

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-4xl font-bold text-gray-900 mb-8">
//                 VERIFICATION
//             </h1>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2 space-y-8">
//                     <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                             Détails d'expedition
//                         </h2>
//                         <p className="text-gray-600">
//                             <strong>Address:</strong>{" "}
//                             {cart.shippingAddress.address},{" "}
//                             {cart.shippingAddress.city},{" "}
//                             {cart.shippingAddress.postalCode},{" "}
//                             {cart.shippingAddress.country}
//                         </p>
//                     </div>

//                     <div className="bg-white p-8 rounded-xl transition-shadow">
//                         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                             Methode de paiement
//                         </h2>
//                         <p className="text-gray-600">
//                             <strong className="text-primary">Methode:</strong>{" "}
//                             {cart.paymentMethod}
//                         </p>
//                     </div>

//                     <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                             Vos commandes
//                         </h2>
//                         {cart.cartItems.length === 0 ? (
//                             <Message>Votre panier est vide</Message>
//                         ) : (
//                             <div className="space-y-4">
//                                 {cart.cartItems.map((item) => (
//                                     <div
//                                         key={item._id}
//                                         className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
//                                     >
//                                         <div className="w-20 h-20 flex-shrink-0 mb-4 sm:mb-0">
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.name}
//                                                 className="w-full h-full object-cover rounded-lg"
//                                             />
//                                         </div>
//                                         <div className="sm:ml-6 flex-1">
//                                             <p className="text-base sm:text-lg font-medium text-primary hover:text-secondary transition-colors">
//                                                 {item.name}
//                                             </p>
//                                         </div>
//                                         <div className="sm:text-right mt-4 sm:mt-0">
//                                             <p className="text-gray-700">
//                                                 {item.qty} x ${item.price} ={" "}
//                                                 <strong>
//                                                     $
//                                                     {(
//                                                         item.qty * item.price
//                                                     ).toFixed(2)}
//                                                 </strong>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="lg:col-span-1">
//                     <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                             Résumé de la commande
//                         </h2>
//                         <div className="space-y-4">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Articles:</span>
//                                 <span className="text-gray-800">
//                                     ${totals.itemsPrice}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">
//                                     Expédition:
//                                 </span>
//                                 <span className="text-gray-800">
//                                     ${totals.shippingPrice}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Taxe:</span>
//                                 <span className="text-gray-800">
//                                     ${totals.taxPrice}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Totale:</span>
//                                 <span className="text-gray-800">
//                                     ${totals.totalPrice}
//                                 </span>
//                             </div>
//                         </div>
//                         {error && (
//                             <div className="mt-6">
//                                 <Message variant="danger">
//                                     {error.data?.message || error.message}
//                                 </Message>
//                             </div>
//                         )}
//                         <div className="mt-8">
//                             <button
//                                 type="button"
//                                 className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                                 disabled={cart.cartItems.length === 0}
//                                 onClick={placeOrderHandler}
//                             >
//                                 {isLoading ? <Loader /> : "Passer une commande"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default PlaceOrderScreen;
