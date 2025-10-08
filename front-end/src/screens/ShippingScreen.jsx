import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormContainer } from "./components/FormContainer";
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
    return <div></div>;
}
export default ShippingScreen;
