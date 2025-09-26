export const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
    // la somme des produits
    const itemsPrice =
        state.cartItems.reduce(
            (acc, item) => acc + item.price * item.qty,
            0 // valeur initiale pour reduce
        ) / 100;
    state.itemsPrice = addDecimal(itemsPrice);
    // la livraison
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    state.itemsPrice = addDecimal(itemsPrice);
    // la TVA
    const taxPrice = 0.15 * itemsPrice;
    state.taxPrice = addDecimal(taxPrice);
    // total commande :
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    state.itemsPrice = addDecimal(itemsPrice);

    //envoyer nos donnés sur localStorage
    localStorage.setItem("cart", JSON.stringify(state));
    return state;
};
