import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import { PaypalButtons, usePaypalScriptReducer } from "@paypal/react-paypal-js";

function OrderScreen() {
    const { id: orderId } = useParams();
    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery();
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] =
        useDeliverOrderMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const [{ isPending }, paypalDispatch] = usePaypalScriptReducer();
    const {
        data: paypal,
        isLoading: loadingPaypal,
        errorPayPal,
    } = useGetPaypalClientIdQuery();
    useEffect(() => {
        if (!errorPayPal && !loadingPaypal && paypal.clientId) {
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
            // verifie si la commande existe et pas encore payé
            if (order && !order.isPaid) {
                // si windows fentere n'est pas affiché
                if (!window.paypal) {
                    // si paypal pas lancé éxcute moi la function paypal
                    loadingPaypalScript();
                }
            }
        }
    }, [errorPayPal, loadingPaypal, order, paypal, paypalDispatch]);
    // fution  confirmation
    function onApprouve(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                //  une fois la commande est passé on revient a l'état initial
                await payOrder({ orderId, details });
                refetch();
                toast.success("La commande a été effectué avec succes");
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        });
    }
    function onError(error) {
        toast.error(error.message);
    }
    // function pour créer la commande
    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [{ amount: { value: order.totalPrice } }],
            })
            .then((orderId) => {
                return orderId;
            });
    }
    // function de livraison
    const deliverHandler = async () => {
        await deliverOrder(orderId);
        refetch();
    };

    return;
    isLoading ? (
        <Loader />
    ) : error ? (
        <Message>{error.data.message}</Message>
    ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-5">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-500">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                            Expédition
                        </h1>
                        <p className="text-gray-600">
                            <strong>Name: </strong>
                            {order.user.name}
                        </p>
                        <p className="text-gray-600">
                            <strong>Email:</strong>
                            <a
                                href={`mailto:${order.user.mail}`}
                                className="text-primary hover:text-secondary transition-colors"
                            >
                                {order.user.email}
                            </a>
                        </p>
                        <p className="text-gray-600">
                            <strong>Address</strong>
                            {order.shippingAddress.address}, {""}
                            {order.shippingAddress.city},{""}
                            {order.shippingAddress.postalCode},{""}
                            {order.shippingAddress.country},{""}
                        </p>
                        {order.isDelivered ? (
                            <Message variant="success">
                                Delivred on{order.deliveredAt}
                            </Message>
                        ) : (
                            <Message className="danger">Pas Livré</Message>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Methode de paiement
                        </h2>
                        <p className="text-gray-800">
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message>Payé le {order.paidAt}</Message>
                        ) : (
                            <Message variant="danger">Non payé</Message>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Commander des articles
                        </h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Pas de commande</Message>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg hover;bg-gray-500 transition-colors"
                                    >
                                        <div className="w-16 h-16 flex-shrink-0 sm:mb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />
                                        </div>
                                        <div className="sm:ml-6 flex-1">
                                            <Link
                                                to={`product.${item.product}`}
                                                className=""
                                            >
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-right mt-4 sm:mt-0">
                                            <p className="text-grayè700">
                                                {item.qty}* ${item.price}= {""}
                                                <strong>
                                                    {" "}
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
                {/* **** */}
            </div>
        </>
    );
}
export default OrderScreen;
