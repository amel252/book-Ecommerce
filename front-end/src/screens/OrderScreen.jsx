// import { useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Message from "../components/Message";
// import Loader from "../components/Loader";
// import {
//     useCreateOrderMutation,
//     useGetMyOrderQuery,
//     useGetOrderDetailsQuery,
//     usePayOrderMutation,
//     useGetPaypalClientIdQuery,
//     useDeliverOrderMutation,
//     useGetOrdersQuery,
// } from "../slices/orderApiSlice";
// import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// function OrderScreen() {
//     const { id: orderId } = useParams();

//     const {
//         data: order,
//         refetch,
//         isLoading,
//         error,
//     } = useGetOrderDetailsQuery(orderId, {
//         skip: !orderId,
//     });

//     const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
//     const [deliverOrder, { isLoading: loadingDeliver }] =
//         useDeliverOrderMutation();

//     const { userInfo } = useSelector((state) => state.auth);
//     const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

//     const {
//         data: paypal,
//         isLoading: loadingPaypal,
//         error: errorPayPal,
//     } = useGetPaypalClientIdQuery();

//     useEffect(() => {
//         if (!errorPayPal && !loadingPaypal && paypal?.clientId) {
//             const loadPaypalScript = async () => {
//                 paypalDispatch({
//                     type: "resetOptions",
//                     value: {
//                         "client-id": paypal.clientId,
//                         currency: "USD",
//                     },
//                 });
//                 paypalDispatch({ type: "setLoadingStatus", value: "pending" });
//             };

//             if (order && !order.isPaid && !window.paypal) {
//                 loadPaypalScript();
//             }
//         }
//     }, [errorPayPal, loadingPaypal, order, paypal, paypalDispatch]);

//     // ✅ Fonction de création d’ordre PayPal
//     function createOrder(data, actions) {
//         return actions.order
//             .create({
//                 purchase_units: [{ amount: { value: order.totalPrice } }],
//             })
//             .then((orderId) => orderId);
//     }

//     // ✅ Quand le paiement est approuvé
//     function onApprove(data, actions) {
//         return actions.order.capture().then(async function (details) {
//             try {
//                 await payOrder({
//                     orderId,
//                     details: {
//                         paypalId: details.id,
//                         status: details.status,
//                         update_time: details.update_time,
//                         email_address: details.payer.email_address,
//                     },
//                 }).unwrap();
//                 refetch();
//                 toast.success("La commande a été effectuée avec succès !");
//             } catch (error) {
//                 toast.error(error?.data?.message || error.error);
//             }
//         });
//     }

//     function onError(error) {
//         toast.error(error.message);
//     }

//     const deliverHandler = async () => {
//         await deliverOrder(orderId);
//         refetch();
//     };

//     return isLoading ? (
//         <Loader />
//     ) : error ? (
//         <Message>{error.data.message}</Message>
//     ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-5">
//             {/* Infos de livraison */}
//             <div className="md:col-span-2 space-y-6">
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                     <h1 className="text-2xl font-semibold text-gray-800 mb-4">
//                         Expédition
//                     </h1>
//                     <p>
//                         <strong>Nom :</strong> {order.user.name}
//                     </p>
//                     <p>
//                         <strong>Email :</strong>{" "}
//                         <a
//                             href={`mailto:${order.user.email}`}
//                             className="text-blue-600"
//                         >
//                             {order.user.email}
//                         </a>
//                     </p>
//                     <p>
//                         <strong>Adresse :</strong>{" "}
//                         {order.shippingAddress.address},{" "}
//                         {order.shippingAddress.city},{" "}
//                         {order.shippingAddress.postalCode},{" "}
//                         {order.shippingAddress.country}
//                     </p>

//                     {order.isDelivered ? (
//                         <Message variant="success">
//                             Livré le {order.deliveredAt}
//                         </Message>
//                     ) : (
//                         <Message variant="danger">Pas encore livré</Message>
//                     )}
//                 </div>

//                 {/* Méthode de paiement */}
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//                         Méthode de paiement
//                     </h2>
//                     <p>
//                         <strong>Méthode :</strong> {order.paymentMethod}
//                     </p>
//                     {order.isPaid ? (
//                         <Message variant="success">
//                             Payé le {order.paidAt}
//                         </Message>
//                     ) : (
//                         <Message variant="danger">Non payé</Message>
//                     )}
//                 </div>

//                 {/* Liste des articles */}
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//                         Articles commandés
//                     </h2>
//                     {order.orderItems.length === 0 ? (
//                         <Message>Pas de commande</Message>
//                     ) : (
//                         order.orderItems.map((item, index) => (
//                             <div
//                                 key={index}
//                                 className="flex items-center justify-between border-b py-3"
//                             >
//                                 <div className="flex items-center space-x-4">
//                                     <img
//                                         src={item.image}
//                                         alt={item.name}
//                                         className="w-16 h-16 rounded"
//                                     />
//                                     <Link
//                                         to={`/product/${item.product}`}
//                                         className="text-gray-800 hover:underline"
//                                     >
//                                         {item.name}
//                                     </Link>
//                                 </div>
//                                 <p>
//                                     {item.qty} × ${item.price} ={" "}
//                                     <strong>${item.qty * item.price}</strong>
//                                 </p>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Résumé de la commande */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">
//                     Résumé de la commande
//                 </h2>
//                 <div className="space-y-2">
//                     <div className="flex justify-between">
//                         <span>Articles</span>
//                         <span>${order.itemsPrice}</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span>Expédition</span>
//                         <span>${order.shippingPrice}</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span>Taxes</span>
//                         <span>${order.taxPrice}</span>
//                     </div>
//                     <div className="flex justify-between font-bold">
//                         <span>Total</span>
//                         <span>${order.totalPrice}</span>
//                     </div>
//                 </div>

//                 {!order.isPaid && (
//                     <div className="mt-6">
//                         {loadingPay && <Loader />}
//                         {isPending ? (
//                             <Loader />
//                         ) : (
//                             <PayPalButtons
//                                 createOrder={createOrder}
//                                 onApprove={onApprove}
//                                 onError={onError}
//                             />
//                         )}
//                     </div>
//                 )}

//                 {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
//                     <button
//                         onClick={deliverHandler}
//                         className="btn btn-primary mt-4"
//                     >
//                         Marquer comme livré
//                     </button>
//                 )}

//                 {loadingDeliver && <Loader />}
//             </div>
//         </div>
//     );
// }

// export default OrderScreen;
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";

import {
    useCreateOrderMutation,
    useGetMyOrderQuery,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useDeliverOrderMutation,
    useGetOrdersQuery,
} from "../slices/orderApiSlice";

import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";

function OrderScreen() {
    const { id: orderId } = useParams();
    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId, { skip: !orderId });

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const [deliverOrder, { isLoading: loadingDeliver }] =
        useDeliverOrderMutation();

    const { userInfo } = useSelector((state) => state.auth);
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPaypalClientIdQuery();

    // execution ou lancement de paypal

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadingPaypalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                    },
                });
                paypalDispatch({ type: "setLoadingStatus", value: "pending" });
            };
            // Si la commande existe et qu'elle n'est pas encore payé
            if (order && !order.isPaid) {
                // Si paypal n'est pas encore affiché
                if (!window.paypal) {
                    loadingPaypalScript();
                }
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({
                    orderId,
                    paypalId: details.id,
                    // details: {
                    //     paypalId: details.id,
                    //     status: details.status,
                    //     update_time: details.update_time,
                    //     email_address: details.payer.email_address,
                    // },
                }).unwrap();
                await refetch();
                toast.success("La commande a été effectuée avec succès");
            } catch (error) {
                toast.error(
                    error?.data?.message ||
                        error?.message ||
                        "Erreur lors du paiement."
                );
            }
        });
    }

    function onError(error) {
        toast.error(error.message);
    }

    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [{ amount: { value: order.totalPrice } }],
            })
            .then((orderId) => {
                return orderId;
            });
    }

    const deliverHandler = async () => {
        await deliverOrder(orderId);
        refetch();
    };

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">
            {error?.data?.message || error?.error || "Une erreur est survenue."}
        </Message>
    ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-5">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-500">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                            Expédition
                        </h1>
                        <p className="text-gray-600">
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p className="text-gray-600">
                            <strong>Email: </strong>
                            <a
                                href={`mailto:${order.user.mail}`}
                                className="text-primary hover:text-secondary transition-colors"
                            >
                                {order.user.email}
                            </a>
                        </p>
                        <p className="text-gray-600">
                            <strong>Adresse: </strong>
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.postalCode},{" "}
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <Message variant="success">
                                Livré le {order.deliveredAt}
                            </Message>
                        ) : (
                            <Message className="danger">Non Livré</Message>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Methode de payement
                        </h2>
                        <p className="text-gray-800">
                            <strong>Method: </strong> {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message>
                                Payé le{" "}
                                {new Date(order.paidAt).toLocaleString()}
                            </Message>
                        ) : (
                            <Message variant="danger">Non payé</Message>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Commander des articles
                        </h2>
                        {!order?.orderItems || order.orderItems.length === 0 ? (
                            <Message>Pas de commande</Message>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row items-start
                                 sm:items-center p-4 rounded-lg transition-colors"
                                    >
                                        <div className="w-16 h-16 mb-4 sm:mb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full rounded-lg"
                                            />
                                        </div>
                                        <div className="sm:ml-6 flex-1">
                                            <Link
                                                to={`/product/${item.product}`}
                                                className="text-lg font-medium text-primary
                                          hover:text-secondary transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-right mt-4 sm:mt-0">
                                            <p className="text-gray-700">
                                                {item.qty} * ${item.price} ={" "}
                                                <strong>
                                                    ${item.qty * item.price}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* suite */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2>Résumé de la commande</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Articles</span>
                                <span className="text-gray-800">
                                    ${order.itemsPrice}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Expedition
                                </span>
                                <span className="text-gray-800">
                                    ${order.shippingPrice}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Taxe</span>
                                <span className="text-gray-800">
                                    ${order.taxPrice}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Totale</span>
                                <span className="text-gray-800">
                                    ${order.totalPrice}
                                </span>
                            </div>
                        </div>
                        {!order.isPaid && (
                            <div className="mt-6">
                                {loadingPay && <Loader />}
                                {isPending ? (
                                    <Loader />
                                ) : (
                                    <div className="mt-4">
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {/* si l'user est admin et commande payé passe a l'étape suivante */}
                        {loadingDeliver && <Loader />}
                        {userInfo &&
                            userInfo.isAdmin &&
                            order.isPaid &&
                            !order.isDelivered && (
                                <div className="mt-6">
                                    <button
                                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors"
                                        onClick={deliverHandler}
                                    >
                                        Pret à livrer
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default OrderScreen;
