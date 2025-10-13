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

    return <div></div>;
}
export default OrderScreen;
