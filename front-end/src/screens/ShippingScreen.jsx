import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";

function ShippingScreen() {
    const cart = useSelector((state) => state.cart);
    //on stocke notre panier dans shippingAddress
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setcity] = useState(shippingAddress.city || "");
    const [postalCode, setpostalCode] = useState(
        shippingAddress.postalCode || ""
    );
    const [country, setcountry] = useState(shippingAddress.country || "");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress(address, city, postalCode, country));
        navigate("/payment");
    };
    return (
        <FormContainer>
            <h1 className="text-2xl font-bold my-6">Expédition</h1>
            <form onSubmit={submitHandler} className="space-y-2">
                {/* adresse */}
                <div className="space-y-2">
                    <label
                        htmlFor="address"
                        className="blok text-sm font-medium text-gray-700"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Entrer votre adresse"
                        value={address}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                {/* city */}
                <div className="space-y-2">
                    <label
                        htmlFor="city"
                        className="blok text-sm font-medium text-gray-700"
                    >
                        Ville
                    </label>
                    <input
                        type="text"
                        id="city"
                        placeholder="Entrer votre ville"
                        value={city}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setcity(e.target.value)}
                    />
                </div>
                {/* postaleCode */}
                <div className="space-y-2">
                    <label
                        htmlFor="postalCode"
                        className="blok text-sm font-medium text-gray-700"
                    >
                        Code postal
                    </label>
                    <input
                        type="text"
                        id="postalCode"
                        placeholder="Entrer votre code postal"
                        value={postalCode}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setpostalCode(e.target.value)}
                    />
                </div>
                {/* country */}
                <div className="space-y-2">
                    <label
                        htmlFor="country"
                        className="blok text-sm font-medium text-gray-700"
                    >
                        country
                    </label>
                    <input
                        type="text"
                        id="country"
                        placeholder="Entrer votre pays"
                        value={country}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setcountry(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    Continuer
                </button>
            </form>
        </FormContainer>
    );
}
export default ShippingScreen;
