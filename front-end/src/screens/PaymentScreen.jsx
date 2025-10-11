import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

function PaymentScreen() {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress]);
    const [paymentMethod, setPaymentMethod] = useState("Paypal");
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/place-order");
    };
    return (
        <div>
            <FormContainer>
                <h1 className="text-2xl font-bold my-8">Methode de paiement</h1>
                <form
                    onSubmit={submitHandler}
                    className="block text-sm font-medium text-gray-700"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Methode de paiement
                        </label>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Paypal"
                                    checked={paymentMethod === "Paypal"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="form-radio h-4 w-4 accent-primary focus:ring-primary border-gray-300"
                                />
                                <span className="text-gray-700">
                                    Paypal ou carte de crédit
                                </span>
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-semibold rounded-lg hover:bg-secondary focus:ring-2 focus:ring-primary py-2 my-4"
                    >
                        Continue
                    </button>
                </form>
            </FormContainer>
        </div>
    );
}
export default PaymentScreen;
